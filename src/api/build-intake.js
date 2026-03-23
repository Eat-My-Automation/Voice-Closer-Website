// POST /api/build-intake
// Receives form data from /build page.
// Forwards to:
//   1. VoiceCloser app intake endpoint (builds the demo bot)
//   2. GHL webhook (creates the contact)
// Also logs SMS consent to Supabase sms_consent table.

import supabase from './supabase.js';

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

    // 3. Log consent to Supabase (fire-and-forget)
    const phone = data.phone ? data.phone.replace(/\D/g, '') : null;
    const normalizedPhone = phone && phone.length === 10 ? `+1${phone}` : phone && phone.length === 11 && phone.startsWith('1') ? `+${phone}` : null;

    if (normalizedPhone) {
      const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
      const ua = req.headers['user-agent'];
      const consentRows = [];

      if (data.consent_reminders) {
        consentRows.push({ phone: normalizedPhone, name: data.first_name, email: data.email, consent_type: 'transactional', consented: true, source: 'build', ip_address: ip, user_agent: ua });
      }
      if (data.consent_marketing) {
        consentRows.push({ phone: normalizedPhone, name: data.first_name, email: data.email, consent_type: 'marketing', consented: true, source: 'build', ip_address: ip, user_agent: ua });
      }
      if (consentRows.length > 0) {
        supabase.from('sms_consent').insert(consentRows)
          .then(({ error }) => { if (error) console.error('Consent log error:', error.message); })
          .catch(err => console.error('Consent log failed:', err.message));
      }
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('build-intake error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
