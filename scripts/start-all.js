const { spawn } = require('child_process');
const path = require('path');

console.log('================================================================');
console.log('🛡️  PhishLens AI — Starting Enterprise Backend & Dashboard');
console.log('================================================================');

// 1. Start Backend Server (Port 5000)
console.log('[1/2] Launching PhishLens Cloud Intelligence Engine on :5000...');
const server = spawn('node', ['dist/server/src/index.js'], {
  cwd: path.resolve(__dirname, '../server'),
  stdio: 'inherit',
  shell: true,
});

server.on('error', (err) => {
  console.error('[Server Error]:', err);
});

// 2. Start Dashboard Dev Server (Port 3000)
console.log('[2/2] Launching PhishLens Threat Dashboard on :3000...');
const dashboard = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '3000'], {
  cwd: path.resolve(__dirname, '../dashboard'),
  stdio: 'inherit',
  shell: true,
});

dashboard.on('error', (err) => {
  console.error('[Dashboard Error]:', err);
});

process.on('SIGINT', () => {
  console.log('\nStopping PhishLens AI services...');
  server.kill();
  dashboard.kill();
  process.exit(0);
});
