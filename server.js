import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import testCallHomepage from './src/api/test-call-homepage.js';
import buildIntake from './src/api/build-intake.js';
import buildReviewCalendar from './src/api/build-review-calendar.js';
import optOut from './src/api/opt-out.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// API routes
app.post('/api/test-call-homepage', testCallHomepage);
app.post('/api/build-intake', buildIntake);
app.get('/api/build-review-calendar', buildReviewCalendar);
app.post('/api/opt-out', optOut);

// Serve static Astro build
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback — serve index.html only for routes without file extensions
app.get('/{*splat}', (req, res) => {
  if (path.extname(req.path)) {
    return res.status(404).end();
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`VoiceCloser server running on port ${PORT}`);
});
