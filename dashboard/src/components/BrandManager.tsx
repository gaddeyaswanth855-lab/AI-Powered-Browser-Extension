import React, { useState } from 'react';
import { createBrand } from '../lib/api';
import { Plus, Search, Layers, CheckCircle2 } from 'lucide-react';

interface BrandManagerProps {
  brands: any[];
  onRefresh: () => void;
}

export const BrandManager: React.FC<BrandManagerProps> = ({ brands, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [brandName, setBrandName] = useState('');
  const [domains, setDomains] = useState('');
  const [category, setCategory] = useState('IDENTITY');
  const [phashSignature, setPhashSignature] = useState('a1b2c3d4e5f60718');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const filtered = brands.filter((b) =>
    b.brand_name.toLowerCase().includes(search.toLowerCase()) ||
    b.canonical_domains.some((d: string) => d.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);
    try {
      const canonicalDomains = domains
        .split(',')
        .map((d) => d.trim().toLowerCase())
        .filter(Boolean);

      await createBrand({
        brandName: brandName.trim(),
        canonicalDomains,
        category,
        phashSignature: phashSignature.trim(),
      });

      setMsg('Brand anchor successfully registered.');
      setShowAddModal(false);
      setBrandName('');
      setDomains('');
      onRefresh();
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search registered brand anchors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Brand Anchor</span>
        </button>
      </div>

      {msg && (
        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-xs text-blue-300">
          {msg}
        </div>
      )}

      {/* Grid of Brand Anchors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((b) => (
          <div
            key={b.id || b.brand_name}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-base text-white">{b.brand_name}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-slate-800 text-slate-300">
                  {b.category}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="text-[11px] text-slate-400 font-semibold uppercase">Canonical Domains</div>
                <div className="flex flex-wrap gap-1.5">
                  {b.canonical_domains.map((dom: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs"
                    >
                      {dom}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>pHash:</span>
              <span className="text-blue-400">{b.phash_signature}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for adding brand */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Register Enterprise Brand Anchor</h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Brand Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Corp"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  Canonical Domains (comma-separated)
                </label>
                <input
                  type="text"
                  required
                  placeholder="acme.com, login.acme.com"
                  value={domains}
                  onChange={(e) => setDomains(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="FINANCIAL">Financial Institution</option>
                  <option value="IDENTITY">Identity & SSO Provider</option>
                  <option value="COMMERCE">E-Commerce & Delivery</option>
                  <option value="SOCIAL">Social & Messaging</option>
                  <option value="CRYPTO">Cryptocurrency & Web3</option>
                  <option value="OTHER">Other Enterprise Target</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  Baseline pHash Signature (16-char Hex)
                </label>
                <input
                  type="text"
                  required
                  maxLength={16}
                  placeholder="16-character hexadecimal"
                  value={phashSignature}
                  onChange={(e) => setPhashSignature(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

