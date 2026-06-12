// UK Housing Email Security Report 2026, public report data.
//
// AGGREGATE ONLY. No single organisation's posture is exposed here. The figures
// come from apps/reports/data/out/housing-2026-aggregate.json (scan of 2026-06-12,
// 200 providers, 0 errors). The named topPerformers list below is positive only,
// derived from the private raw scan, and must be re-verified + signed off by
// Hannah/Alex before REPORTS_ENABLED is flipped on. UK English, no em-dashes.

export interface ReportStat {
  readonly value: string;
  readonly label: string;
}
export interface ReportBar {
  readonly label: string;
  readonly pct: number;
  readonly tone?: 'brand' | 'good' | 'warn' | 'bad';
}
export interface ReportSection {
  readonly heading: string;
  readonly body: readonly string[];
}

export interface SectorReport {
  readonly slug: string;
  readonly title: string;
  readonly datePublished: string;
  readonly scannedAt: string;
  readonly sampleSize: number;
  readonly headline: { value: string; label: string; sub?: string };
  readonly standfirst: readonly string[];
  readonly keyStats: readonly ReportStat[];
  readonly dmarcBreakdown: readonly ReportBar[];
  readonly scoreBands: readonly { band: string; pct: number }[];
  readonly scoreMean: number;
  readonly scoreMedian: number;
  readonly findings: readonly ReportSection[];
  readonly methodology: readonly string[];
  readonly topPerformers?: readonly string[];
}

export const housing2026: SectorReport = {
  slug: 'uk-housing-email-security-2026',
  title: 'UK Housing Email Security Report 2026',
  datePublished: '2026-06-12',
  scannedAt: '12 June 2026',
  sampleSize: 200,
  headline: {
    value: '2 in 5',
    label: 'of the UK largest housing associations have no enforced DMARC, leaving their domain open to spoofing',
    sub: 'Seventy-nine of the 200 providers we scanned could be impersonated in phishing emails sent to their own tenants.',
  },
  standfirst: [
    'Housing associations hold some of the most sensitive relationships in the country: they email tenants about rent, repairs, benefits and safety. If a domain can be spoofed, a criminal can send a convincing email that appears to come from the landlord, and tenants have every reason to trust it.',
    'We ran a free external security scan of 200 housing associations in England, every private registered provider owning 1,000 or more homes that we could verify. Between them they own around 2.76 million homes. The picture is a sector pulling in two directions: a well-defended top tier, and a large group that has either not started or, more often, started and stopped halfway.',
  ],
  keyStats: [
    { value: '61%', label: 'enforce DMARC (quarantine or reject)' },
    { value: '2 in 5', label: 'have no enforced DMARC and can be spoofed' },
    { value: '31%', label: 'published DMARC but left it unenforced' },
    { value: '2.76m', label: 'homes owned by the providers scanned' },
  ],
  dmarcBreakdown: [
    { label: 'Reject (strongest, fully enforced)', pct: 27, tone: 'good' },
    { label: 'Quarantine (enforced)', pct: 34, tone: 'good' },
    { label: 'None (published but monitoring only, no protection)', pct: 31, tone: 'warn' },
    { label: 'No DMARC record at all', pct: 9, tone: 'bad' },
  ],
  scoreBands: [
    { band: '90 to 100 (excellent)', pct: 49 },
    { band: '75 to 89 (good)', pct: 12 },
    { band: '60 to 74 (fair)', pct: 27 },
    { band: '40 to 59 (weak)', pct: 9 },
    { band: '0 to 39 (poor)', pct: 4 },
  ],
  scoreMean: 79,
  scoreMedian: 89,
  findings: [
    {
      heading: 'A sector pulling in two directions',
      body: [
        'Almost half of the providers we scanned (49%) score 90 or above out of 100, and these tend to be the larger, better-resourced associations. Their email is properly defended: an enforced DMARC policy, a valid SPF record, and DKIM signing in place. For organisations often described as behind on technology, that top tier is genuinely strong.',
        'But the sector as a whole tells a more uncomfortable story than the headline names suggest. Across all 200 providers, two in five have no enforced DMARC, and the average score falls to 79. The pattern is fairly consistent: the smaller the provider, the more likely it is to be exposed, and smaller housing associations still hold hundreds of thousands of tenant relationships between them.',
      ],
    },
    {
      heading: 'The unfinished journey: 31% started DMARC and stopped',
      body: [
        'The single most striking finding is not the associations with no DMARC at all (9%), it is the 31% that published a DMARC record and then left it set to none. A policy of none monitors who is sending mail as your domain but tells receiving servers to deliver spoofed messages anyway. It offers the reassurance of having done something, with none of the protection.',
        'This is the easiest gap in the whole report to close. These providers have already done the hard part, standing up DMARC and, usually, getting their legitimate senders passing. Moving from none to quarantine or reject is often a single DNS change once the reports confirm it is safe. Nearly a third of the sector is one careful step away from being protected and has not taken it.',
      ],
    },
    {
      heading: 'SPF is universal, but one in ten is silently broken',
      body: [
        'Every provider we scanned publishes an SPF record. But 10% have exceeded the limit of ten DNS lookups that the SPF standard allows. Once a record goes over that limit, SPF stops working, often without anyone noticing, because each new email tool that gets added quietly pushes the count higher. It is one of the most common and most invisible email security faults we find.',
      ],
    },
    {
      heading: 'DKIM is widespread, modern transport security is not',
      body: [
        'Four in five providers (80%) publish a valid DKIM signature, the cryptographic signing that lets recipients verify a message has not been tampered with. The newer transport-security standards are barely adopted: only 13% publish MTA-STS and 17% publish TLS-RPT, both of which protect mail in transit. These are not urgent for most providers, but they are the difference between a good posture and a complete one.',
      ],
    },
    {
      heading: 'What good looks like, and where to start',
      body: [
        'The strongest providers in our sample share a simple pattern: an enforced DMARC policy of reject, a valid SPF record kept under the lookup limit, and DKIM signing switched on. None of it requires new software, and most of it is free to configure.',
        'If you run email for a housing association, the fastest way to find out where you stand is to run the same external check we used for this report. It takes about 15 seconds and needs no access to your systems. We have not named any provider that scored poorly; each can see its own result privately through our free scanner. Where the results show gaps, our cloud security team can help you reach enforcement safely, without disrupting the legitimate mail your tenants rely on.',
      ],
    },
  ],
  methodology: [
    'We identified the 208 housing associations (private registered providers, not local-authority providers) in England owning 1,000 or more homes, using the Regulator of Social Housing Statistical Data Return. We confirmed a live email domain for 200 of them and ran a passive external security scan of each on 12 June 2026. Together these providers own around 2.76 million homes.',
    'Every check reads only publicly available DNS records and public-facing services. No system was accessed, no credentials were used, and no intrusive testing was performed. This is the same external view any member of the public, or any attacker, already has.',
    'Email authentication posture (SPF, DKIM, DMARC) was assessed against current NCSC guidance, and an overall score was calculated from the same engine that powers our free domain security check. Recently merged providers are counted as their current combined entity. Results are a snapshot as of the scan date; DNS configurations change over time, and a provider that was exposed on this date may since have fixed it.',
  ],
  // Positive recognition only. Re-verify against a fresh scan and obtain
  // Hannah/Alex sign-off before REPORTS_ENABLED is flipped on.
  topPerformers: [
    'PA Housing',
    'Westward Housing',
    'Bernicia',
    'Sovereign Network Group',
    'Gentoo Group',
    'Newlon Housing Trust',
    'Acis Group',
    'Cottsway',
    'Livv Housing Group',
    'Plymouth Community Homes',
    'Futures Housing Group',
    'A2Dominion',
  ],
};
