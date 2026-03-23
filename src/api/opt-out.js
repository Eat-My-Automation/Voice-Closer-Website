// POST /api/opt-out
// Body: { phone, email, opt_out_sms, opt_out_email }
// Logs opt-out records to sms_consent table.

import supabase from './supabase.js';

export default async function optOut(req, res) {
  const ts = new Date().toISOString();
  console.log(`[${ts}] POST /api/opt-out`);

  try {
    const { phone, email, opt_out_sms, opt_out_email } = req.body;

    if (!phone && !email) {
      return res.status(400).json({ error: 'Please provide a phone number or email address.' });
    }

    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
    const ua = req.headers['user-agent'];

    // Normalize phone if provided
    let normalizedPhone = null;
    if (phone) {
      const digits = phone.replace(/\D/g, '');
      if (digits.length === 10) normalizedPhone = `+1${digits}`;
      else if (digits.length === 11 && digits.startsWith('1')) normalizedPhone = `+${digits}`;
      else normalizedPhone = digits; // store as-is if format is unusual
    }

    if (opt_out_sms && normalizedPhone) {
      const rows = [
        { phone: normalizedPhone, email, consent_type: 'transactional', consented: false, source: 'opt-out-page', ip_address: ip, user_agent: ua },
        { phone: normalizedPhone, email, consent_type: 'marketing', consented: false, source: 'opt-out-page', ip_address: ip, user_agent: ua },
      ];

      const { error } = await supabase.from('sms_consent').insert(rows);
      if (error) {
        console.error(`[${ts}] Opt-out SMS log error:`, error.message);
        return res.status(500).json({ error: 'Failed to process opt-out. Please try again.' });
      }
    }

    console.log(`[${ts}] Opt-out processed — phone: ${normalizedPhone}, sms: ${opt_out_sms}, email: ${opt_out_email}`);
    return res.json({ success: true });
  } catch (err) {
    console.error('opt-out error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
