// POST /api/test-call-homepage
// Body: { name: "Ken", phone: "+12155551234", agent: "voicecloser_demo" }
//
// Maps `agent` to AGENT_* env var, calls Retell createPhoneCall API.
// Agent IDs are stored in Replit secrets so they're easily switchable.

const AGENT_MAP = {
  voicecloser_demo:          'AGENT_VOICECLOSER_DEMO',
  city_fitness_reactivation: 'AGENT_CITY_FITNESS_REACTIVATION',
  cre_cold_caller:           'AGENT_CRE_COLD_CALLER',
  limitless_storage:         'AGENT_LIMITLESS_STORAGE',
};

export default async function testCallHomepage(req, res) {
  const ts = new Date().toISOString();
  console.log(`[${ts}] POST /api/test-call-homepage — body:`, JSON.stringify(req.body));

  try {
    const { name, phone, agent } = req.body;

    if (!phone) {
      console.log(`[${ts}] REJECTED: no phone number provided`);
      return res.status(400).json({ error: 'Phone number is required.' });
    }

    // Default to voicecloser_demo if no agent specified (website demo button)
    const agentKey = agent || 'voicecloser_demo';
    const envVar = AGENT_MAP[agentKey];

    if (!envVar) {
      console.log(`[${ts}] REJECTED: unknown agent key "${agentKey}"`);
      return res.status(400).json({ error: `Unknown agent: ${agentKey}` });
    }

    const agentId = process.env[envVar];
    if (!agentId) {
      console.error(`[${ts}] CONFIG ERROR: env var ${envVar} is not set`);
      return res.status(500).json({ error: `Agent secret ${envVar} is not configured.` });
    }

    const retellApiKey = process.env.RETELL_API_KEY;
    if (!retellApiKey) {
      console.error(`[${ts}] CONFIG ERROR: RETELL_API_KEY is not set`);
      return res.status(500).json({ error: 'RETELL_API_KEY is not configured.' });
    }

    const fromNumber = process.env.RETELL_FROM_NUMBER;
    if (!fromNumber) {
      console.error(`[${ts}] CONFIG ERROR: RETELL_FROM_NUMBER is not set`);
      return res.status(500).json({ error: 'RETELL_FROM_NUMBER is not configured.' });
    }

    // Normalize phone to E.164 if needed
    const toNumber = normalizePhone(phone);
    if (!toNumber) {
      console.log(`[${ts}] REJECTED: invalid phone "${phone}"`);
      return res.status(400).json({ error: 'Invalid phone number. Please use a US or Canada number.' });
    }

    const retellPayload = {
      from_number: fromNumber,
      to_number: toNumber,
      override_agent_id: agentId,
      retell_llm_dynamic_variables: {
        customer_name: name || 'there',
      },
    };

    console.log(`[${ts}] Calling Retell API — agent: ${agentKey} (${agentId}), to: ${toNumber}, from: ${fromNumber}`);

    const retellRes = await fetch('https://api.retellai.com/v2/create-phone-call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${retellApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(retellPayload),
    });

    const retellBody = await retellRes.text();

    if (!retellRes.ok) {
      console.error(`[${ts}] RETELL ERROR ${retellRes.status}: ${retellBody}`);
      return res.status(502).json({ error: 'Failed to initiate call. Please try again.' });
    }

    const data = JSON.parse(retellBody);
    console.log(`[${ts}] SUCCESS — call_id: ${data.call_id}`);

    return res.json({ success: true, callId: data.call_id });
  } catch (err) {
    console.error(`[${ts}] UNHANDLED ERROR:`, err.message, err.stack);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

// Normalize US/Canada phone to E.164 format
function normalizePhone(raw) {
  const digits = raw.replace(/\D/g, '');

  if (digits.length === 10) {
    return `+1${digits}`;
  }
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits}`;
  }

  return null;
}
