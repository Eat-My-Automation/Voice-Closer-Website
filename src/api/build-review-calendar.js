// GET /api/build-review-calendar
// Returns the GHL calendar URL for the bot build review booking page.

export default function buildReviewCalendar(req, res) {
  const url = process.env.GHL_BOT_BUILD_REVIEW_CALENDAR;
  if (!url) {
    return res.status(500).json({ error: 'Calendar not configured' });
  }
  return res.json({ url });
}
