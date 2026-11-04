import { Router, Request, Response } from 'express';
import { db } from '../db/client';
import { BrandAnchorSchema } from '../../../shared/validators';

const router = Router();

// GET /api/v1/signatures/brands - Sync bundle for Chrome Extension
router.get('/brands', async (req: Request, res: Response) => {
  try {
    const result = await db.query(
      'SELECT id, brand_name, canonical_domains, category, phash_signature, logo_svg_url FROM brand_anchors ORDER BY brand_name ASC'
    );

    // Cache header: cache for 1 hour, stale while revalidate
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=600');

    return res.status(200).json({
      timestamp: new Date().toISOString(),
      count: result.rows.length,
      brands: result.rows,
    });
  } catch (error: any) {
    console.error('[Brands] Failed to fetch brand signatures:', error);
    return res.status(500).json({ error: 'Failed to retrieve brand signatures', message: error.message });
  }
});

// POST /api/v1/signatures/brands - Create or register new brand anchor
router.post('/brands', async (req: Request, res: Response) => {
  const parseResult = BrandAnchorSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid brand anchor payload', details: parseResult.error.format() });
  }

  const { brandName, canonicalDomains, category, phashSignature, logoSvgUrl } = parseResult.data;

  try {
    const result = await db.query(
      `INSERT INTO brand_anchors (brand_name, canonical_domains, category, phash_signature, logo_svg_url)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (brand_name) DO UPDATE SET
         canonical_domains = EXCLUDED.canonical_domains,
         category = EXCLUDED.category,
         phash_signature = EXCLUDED.phash_signature,
         logo_svg_url = EXCLUDED.logo_svg_url,
         updated_at = NOW()
       RETURNING *`,
      [brandName, canonicalDomains, category, phashSignature, logoSvgUrl || null]
    );

    return res.status(201).json({
      success: true,
      brand: result.rows[0],
    });
  } catch (error: any) {
    console.error('[Brands] Brand insert error:', error);
    return res.status(500).json({ error: 'Failed to register brand anchor', message: error.message });
  }
});

export default router;
