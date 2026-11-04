const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPNG(width, height, r, g, b) {
  // Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type (RGB)
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crc = Buffer.alloc(4);
    // Simple CRC-32
    let c = 0 ^ -1;
    for (let i = 0; i < typeBuf.length; i++) {
      c = updateCrc(c, typeBuf[i]);
    }
    for (let i = 0; i < data.length; i++) {
      c = updateCrc(c, data[i]);
    }
    c = (c ^ -1) >>> 0;
    crc.writeUInt32BE(c, 0);
    return Buffer.concat([len, typeBuf, data, crc]);
  }

  function updateCrc(c, byte) {
    let t = (c ^ byte) & 0xff;
    for (let j = 0; j < 8; j++) {
      t = (t & 1) ? (0xedb88320 ^ (t >>> 1)) : (t >>> 1);
    }
    return (c >>> 8) ^ t;
  }

  // Scanlines with filter byte 0
  const rowSize = 1 + width * 3;
  const rawData = Buffer.alloc(height * rowSize);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // filter None
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 3;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
    }
  }

  const idatData = zlib.deflateSync(rawData);
  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', idatData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const dir = path.join(__dirname, 'extension', 'public', 'icons');
fs.mkdirSync(dir, { recursive: true });

const png16 = createPNG(16, 16, 37, 99, 235);
const png48 = createPNG(48, 48, 37, 99, 235);
const png128 = createPNG(128, 128, 37, 99, 235);

fs.writeFileSync(path.join(dir, 'icon-16.png'), png16);
fs.writeFileSync(path.join(dir, 'icon-48.png'), png48);
fs.writeFileSync(path.join(dir, 'icon-128.png'), png128);

console.log('PNG icons created successfully.');
