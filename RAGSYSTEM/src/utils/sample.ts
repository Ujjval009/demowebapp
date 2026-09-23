const SAMPLE_DOC =
  'Northwind Robotics — Employee & Product Handbook\n\n' +
  'Remote work policy. Employees may work remotely up to four days per week with manager approval. Full-remote arrangements require a written exception from the department head and are reviewed every six months. All remote staff must be reachable during core hours, 10am to 3pm in their local timezone, and must attend the Monday planning sync on camera.\n\n' +
  'Paid time off. Full-time employees accrue 22 days of PTO per year, plus 10 company holidays. Unused PTO up to 5 days may be carried into the next calendar year; anything beyond that is forfeited on December 31. New hires accrue PTO from day one but cannot take more than 5 days in their first 90 days without special approval.\n\n' +
  'Expense reimbursement. Submit expense reports through the Finance portal within 30 days of purchase. Meals during business travel are reimbursed up to $75 per day. Home office equipment purchases over $150 require pre-approval from your manager. Reimbursements are processed on the 15th and last day of each month.\n\n' +
  'Product: Orbit Analytics pricing tiers. The Starter tier is $49 per month and includes up to 3 dashboards and 10,000 monthly events. The Growth tier is $199 per month, includes unlimited dashboards, 250,000 monthly events, and email support. The Enterprise tier is custom-priced, includes SSO, a dedicated account manager, and a 99.9% uptime SLA. All tiers include a 14-day free trial with no credit card required.\n\n' +
  'Incident response runbook — API outages. If the public API error rate exceeds 5% for more than 3 minutes, PagerDuty pages the on-call engineer automatically. The on-call engineer must acknowledge within 5 minutes and post a status update in #incidents within 10 minutes. If the outage is customer-visible, the status page must be updated within 15 minutes. A postmortem is required within 3 business days for any incident rated Sev1 or Sev2.\n\n' +
  'Onboarding checklist for new engineers. Day one: laptop setup, VPN access, and a 30-minute intro call with your onboarding buddy. Week one: complete the codebase walkthrough, get read access to all repos, and ship a small first pull request. Month one: meet with your manager to set 90-day goals and shadow one on-call rotation.\n\n' +
  'Performance review cycle. Reviews run twice a year, in June and December. Each cycle includes a self-assessment, peer feedback from at least 3 colleagues, and a calibration meeting between managers. Compensation changes tied to performance take effect the month after calibration is complete.'

export function getSampleDoc(): string { return SAMPLE_DOC }

let sampleFn: ((prompt: string, opts: { modelTier: string; onText: (evt: { text: string }) => void }) => Promise<{ text: string }>) | null = null
let sampleChecked = false

export async function getSample(): Promise<typeof sampleFn> {
  if (sampleChecked) return sampleFn
  sampleChecked = true
  try {
    sampleFn = await (claude as any).use('sample')
  } catch { sampleFn = null }
  return sampleFn
}
