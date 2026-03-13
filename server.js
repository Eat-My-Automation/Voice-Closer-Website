import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import triggerCall from './src/api/trigger-call.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API routes
app.post('/api/trigger-call', triggerCall);

// Serve static Astro build
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback — serve index.html for any unmatched route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`VoiceCloser server running on port ${PORT}`);
});
