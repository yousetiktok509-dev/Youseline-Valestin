import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.disable('x-powered-by');

// Health check endpoint for Cloud Run health probes
app.get(['/_healthz', '/healthz'], (_req, res) => {
  res.status(200).send('OK');
});

// Resolve dist folder
const distPath = path.resolve(__dirname, 'dist');

if (fs.existsSync(distPath)) {
  // Serve static files from production build dist
  app.use(express.static(distPath, {
    maxAge: '1d',
    etag: true,
  }));

  // SPA fallback
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  console.warn('Warning: dist/ directory not found. Please run "npm run build" first.');
  app.get('*', (_req, res) => {
    res.status(503).send('Application is building or dist folder is missing. Please run npm run build.');
  });
}

app.listen(Number(port), '0.0.0.0', () => {
  console.log(`✨ Une Nuit Magique pour Baguens server is running on http://0.0.0.0:${port}`);
});
