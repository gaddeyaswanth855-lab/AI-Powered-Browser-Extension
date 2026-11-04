import brandSignatures from '../shared/brandSignatures.json';
import { calculateHammingDistance } from '../shared/heuristics';
// Compute 2D Discrete Cosine Transform (DCT) on 32x32 matrix
function computeDCT(matrix) {
    const N = 32;
    const dct = Array.from({ length: N }, () => Array(N).fill(0));
    const c = (i) => (i === 0 ? 1 / Math.sqrt(2) : 1);
    for (let u = 0; u < N; u++) {
        for (let v = 0; v < N; v++) {
            let sum = 0;
            for (let x = 0; x < N; x++) {
                for (let y = 0; y < N; y++) {
                    sum +=
                        matrix[x][y] *
                            Math.cos(((2 * x + 1) * u * Math.PI) / (2 * N)) *
                            Math.cos(((2 * y + 1) * v * Math.PI) / (2 * N));
                }
            }
            dct[u][v] = (2 / N) * c(u) * c(v) * sum;
        }
    }
    return dct;
}
// Compute Perceptual Hash (pHash) from HTMLImageElement
function computePHashFromImage(img) {
    const canvas = document.getElementById('phash-canvas');
    if (!canvas)
        return '0000000000000000';
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx)
        return '0000000000000000';
    // Resize image to 32x32
    ctx.clearRect(0, 0, 32, 32);
    ctx.drawImage(img, 0, 0, 32, 32);
    const imgData = ctx.getImageData(0, 0, 32, 32);
    const data = imgData.data;
    // Convert to 32x32 Grayscale Matrix
    const gray = Array.from({ length: 32 }, () => Array(32).fill(0));
    for (let y = 0; y < 32; y++) {
        for (let x = 0; x < 32; x++) {
            const idx = (y * 32 + x) * 4;
            // Luminance formula: 0.299R + 0.587G + 0.114B
            gray[y][x] = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
        }
    }
    // Compute DCT
    const dct = computeDCT(gray);
    // Extract top-left 8x8 low-frequency components (64 values)
    const vals = [];
    for (let u = 0; u < 8; u++) {
        for (let v = 0; v < 8; v++) {
            // Exclude DC component (0,0) for better luminance invariance
            if (u === 0 && v === 0)
                continue;
            vals.push(dct[u][v]);
        }
    }
    // Compute median
    const sorted = [...vals].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    // Generate 64-bit binary sequence (1 if > median, else 0)
    let binaryStr = '';
    for (let u = 0; u < 8; u++) {
        for (let v = 0; v < 8; v++) {
            if (u === 0 && v === 0) {
                binaryStr += '0';
            }
            else {
                binaryStr += dct[u][v] > median ? '1' : '0';
            }
        }
    }
    // Convert 64-bit binary to 16-hex characters
    let hexStr = '';
    for (let i = 0; i < 64; i += 4) {
        const chunk = binaryStr.substring(i, i + 4);
        hexStr += parseInt(chunk, 2).toString(16);
    }
    return hexStr;
}
// Process incoming hashing request
async function handleHashRequest(payload) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            try {
                const phash = computePHashFromImage(img);
                let bestBrand = null;
                let minDistance = 64;
                // Compare against bundled brand signatures
                for (const brand of brandSignatures) {
                    const dist = calculateHammingDistance(phash, brand.phashSignature);
                    if (dist < minDistance) {
                        minDistance = dist;
                        bestBrand = brand.brandName;
                    }
                }
                resolve({
                    imageUrl: payload.imageUrl,
                    phash,
                    matchedBrand: minDistance <= 15 ? bestBrand : null,
                    hammingDistance: minDistance <= 15 ? minDistance : null,
                });
            }
            catch (err) {
                console.warn('[Offscreen] pHash extraction error:', err);
                resolve({
                    imageUrl: payload.imageUrl,
                    phash: '0000000000000000',
                    matchedBrand: null,
                    hammingDistance: null,
                });
            }
        };
        img.onerror = () => {
            resolve({
                imageUrl: payload.imageUrl,
                phash: '0000000000000000',
                matchedBrand: null,
                hammingDistance: null,
            });
        };
        img.src = payload.imageUrl;
    });
}
// Listen for background worker messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'COMPUTE_PHASH' && message.payload) {
        handleHashRequest(message.payload).then((result) => {
            sendResponse(result);
        });
        return true; // Keep message channel open for async response
    }
});
console.log('[Offscreen Worker] PhishLens pHash Engine initialized.');
