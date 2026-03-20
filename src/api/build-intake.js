// POST /api/build-intake
// Receives form data from /build page.
// Forwards to:
//   1. VoiceCloser app intake endpoint (builds the demo bot)
//   2. GHL webhook (creates the contact)

export default async function buildIntake(req, res) {
  const ts = new Date().toISOString();
  console.log(`[${ts}] POST /api/build-intake`);

  try {
    const data = req.body;

    if (!data.business_name) {
      return res.status(400).json({ error: 'Business name is required.' });
    }

    // 1. Forward to app intake endpoint (builds demo bot)
    const appIntakeUrl = process.env.APP_INTAKE_URL;
    const appIntakeSecret = process.env.APP_INTAKE_SECRET;

    if (appIntakeUrl && appIntakeSecret) {
      fetch(`${appIntakeUrl}?secret=${appIntakeSecret}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).catch(err => console.error('App intake forward failed:', err));
    } else {
      console.warn('APP_INTAKE_URL or APP_INTAKE_SECRET not set — skipping app forward');
    }

    // 2. Forward to GHL webhook (creates contact)
    const ghlWebhook = process.env.GHL_WEBHOOK_DEMO_BOT_BUILD;

    if (ghlWebhook) {
      fetch(ghlWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).catch(err => console.error('GHL webhook failed:', err));
    } else {
      console.warn('GHL_WEBHOOK_DEMO_BOT_BUILD not set — skipping GHL forward');
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('build-intake error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
