// POST /api/test-call-homepage
// Body: { name: "Ken", phone: "+12155551234", agent: "voicecloser_demo" }
//
// Maps `agent` to AGENT_* env var, calls Retell createPhoneCall API.
// Agent IDs are stored in Replit secrets so they're easily switchable.

const AGENT_MAP = {
  // Non-industry agents
  voicecloser_demo:              'AGENT_VOICECLOSER_DEMO',
  voicecloser_homepage:          'AGENT_VOICECLOSER_HOMEPAGE',
  city_fitness_reactivation:     'AGENT_CITY_FITNESS_REACTIVATION',
  cre_cold_caller:               'AGENT_CRE_COLD_CALLER',
  limitless_storage:             'AGENT_LIMITLESS_STORAGE',

  // Existing industries
  voicecloser_hvac:              'AGENT_VOICECLOSER_HVAC',
  voicecloser_gym:               'AGENT_VOICECLOSER_GYM',
  voicecloser_roofing:           'AGENT_VOICECLOSER_ROOFING',
  voicecloser_plumbing:          'AGENT_VOICECLOSER_PLUMBING',

  // Automotive
  voicecloser_auto_dealership:   'AGENT_VOICECLOSER_AUTO_DEALERSHIP',
  voicecloser_auto_detailing:    'AGENT_VOICECLOSER_AUTO_DETAILING',
  voicecloser_towing:            'AGENT_VOICECLOSER_TOWING',

  // Education
  voicecloser_music_school:      'AGENT_VOICECLOSER_MUSIC_SCHOOL',
  voicecloser_tutoring:          'AGENT_VOICECLOSER_TUTORING',
  voicecloser_vocational_school: 'AGENT_VOICECLOSER_VOCATIONAL_SCHOOL',

  // Finance
  voicecloser_accounting:        'AGENT_VOICECLOSER_ACCOUNTING',
  voicecloser_financial_advisor: 'AGENT_VOICECLOSER_FINANCIAL_ADVISOR',
  voicecloser_mortgage:          'AGENT_VOICECLOSER_MORTGAGE',
  voicecloser_insurance:         'AGENT_VOICECLOSER_INSURANCE',

  // Fitness & Wellness
  voicecloser_dance_studio:      'AGENT_VOICECLOSER_DANCE_STUDIO',
  voicecloser_martial_arts:      'AGENT_VOICECLOSER_MARTIAL_ARTS',
  voicecloser_personal_training: 'AGENT_VOICECLOSER_PERSONAL_TRAINING',
  voicecloser_yoga_studio:       'AGENT_VOICECLOSER_YOGA_STUDIO',
  voicecloser_weight_loss:       'AGENT_VOICECLOSER_WEIGHT_LOSS',

  // Food & Hospitality
  voicecloser_catering:          'AGENT_VOICECLOSER_CATERING',
  voicecloser_restaurant:        'AGENT_VOICECLOSER_RESTAURANT',

  // Healthcare
  voicecloser_chiropractic:      'AGENT_VOICECLOSER_CHIROPRACTIC',
  voicecloser_dermatology:       'AGENT_VOICECLOSER_DERMATOLOGY',
  voicecloser_med_spa:           'AGENT_VOICECLOSER_MED_SPA',
  voicecloser_mental_health:     'AGENT_VOICECLOSER_MENTAL_HEALTH',
  voicecloser_optometry:         'AGENT_VOICECLOSER_OPTOMETRY',
  voicecloser_physical_therapy:  'AGENT_VOICECLOSER_PHYSICAL_THERAPY',
  voicecloser_urgent_care:       'AGENT_VOICECLOSER_URGENT_CARE',
  voicecloser_veterinary:        'AGENT_VOICECLOSER_VETERINARY',

  // Home Services
  voicecloser_electrical:        'AGENT_VOICECLOSER_ELECTRICAL',
  voicecloser_flooring:          'AGENT_VOICECLOSER_FLOORING',
  voicecloser_foundation_repair: 'AGENT_VOICECLOSER_FOUNDATION_REPAIR',
  voicecloser_garage_door:       'AGENT_VOICECLOSER_GARAGE_DOOR',
  voicecloser_general_contractor:'AGENT_VOICECLOSER_GENERAL_CONTRACTOR',
  voicecloser_gutters:           'AGENT_VOICECLOSER_GUTTERS',
  voicecloser_lawn_care:         'AGENT_VOICECLOSER_LAWN_CARE',
  voicecloser_painting:          'AGENT_VOICECLOSER_PAINTING',
  voicecloser_pest_control:      'AGENT_VOICECLOSER_PEST_CONTROL',
  voicecloser_pool_service:      'AGENT_VOICECLOSER_POOL_SERVICE',
  voicecloser_windows:           'AGENT_VOICECLOSER_WINDOWS',

  // Legal
  voicecloser_family_law:        'AGENT_VOICECLOSER_FAMILY_LAW',
  voicecloser_immigration_law:   'AGENT_VOICECLOSER_IMMIGRATION_LAW',

  // Real Estate & Property
  voicecloser_commercial_re:     'AGENT_VOICECLOSER_COMMERCIAL_RE',
  voicecloser_property_management:'AGENT_VOICECLOSER_PROPERTY_MANAGEMENT',
  voicecloser_residential_re:    'AGENT_VOICECLOSER_RESIDENTIAL_RE',
  voicecloser_short_term_rental: 'AGENT_VOICECLOSER_SHORT_TERM_RENTAL',
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
        first_name: name || 'there',
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
