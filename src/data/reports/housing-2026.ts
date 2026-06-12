// UK Housing Email Security Report 2026, public report data.
//
// AGGREGATE ONLY. No single organisation's posture is exposed here. The figures
// come from apps/reports/data/out/housing-2026-aggregate.json (scan of 2026-06-12,
// 41 providers, 0 errors). The named topPerformers list below is positive only,
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
  sampleSize: 41,
  headline: {
    value: '1 in 5',
    label: 'of the largest UK housing associations have no enforced DMARC, leaving their domain open to spoofing',
    sub: 'Eight of the 41 providers we scanned could be impersonated in phishing emails sent to their own tenants.',
  },
  standfirst: [
    'Housing associations hold some of the most sensitive relationships in the country: they email tenants about rent, repairs, benefits and safety. If a domain can be spoofed, a criminal can send a convincing email that appears to come from the landlord, and tenants have every reason to trust it.',
    'We ran a free external security scan of the 41 largest housing associations in England by homes owned. The good news is that most are well defended. The concern is a clear minority that are not, and a set of quieter weaknesses that even the strong performers share.',
  ],
  keyStats: [
    { value: '80%', label: 'enforce DMARC (quarantine or reject)' },
    { value: '20%', label: 'have no enforced DMARC and can be spoofed' },
    { value: '66%', label: 'score 90 or above out of 100 overall' },
    { value: '15%', label: 'have an SPF record that silently breaks' },
  ],
  dmarcBreakdown: [
    { label: 'Reject (strongest, fully enforced)', pct: 41, tone: 'good' },
    { label: 'Quarantine (enforced)', pct: 39, tone: 'good' },
    { label: 'None (monitoring only, no protection)', pct: 12, tone: 'warn' },
    { label: 'No DMARC record at all', pct: 7, tone: 'bad' },
  ],
  scoreBands: [
    { band: '90 to 100 (excellent)', pct: 66 },
    { band: '75 to 89 (good)', pct: 15 },
    { band: '60 to 74 (fair)', pct: 10 },
    { band: '40 to 59 (weak)', pct: 7 },
    { band: '0 to 39 (poor)', pct: 2 },
  ],
  scoreMean: 86,
  scoreMedian: 92,
  findings: [
    {
      heading: 'The sector is in better shape than its reputation suggests',
      body: [
        'Four out of five of the largest housing associations have an enforced DMARC policy, and two thirds score 90 or above overall. Every single provider we scanned had a published SPF record. For a sector often described as behind on technology, this is a genuinely strong baseline, and the teams responsible deserve credit for it.',
        'Enforcement is split fairly evenly between the two protective policies: 41% use the strongest setting, reject, which refuses spoofed mail outright, and 39% use quarantine, which sends it to junk. Both stop a spoofed email reaching a tenant inbox.',
      ],
    },
    {
      heading: 'But one in five remain wide open',
      body: [
        'Eight of the 41 providers have no enforced DMARC. Five publish a DMARC record set to none, which monitors but protects nothing, and three have no DMARC record at all. In practical terms, a criminal can send an email that appears to come from any of these domains, and the receiving mail server will deliver it to the tenant.',
        'For organisations that email vulnerable people about money and housing, this is the single highest-impact gap to close, and it is usually a matter of weeks of careful work, not months. We have not named the providers concerned in this report. Each has been able to see their own result through our free scanner, and we would always rather help a landlord fix this quietly than publish a list.',
      ],
    },
    {
      heading: 'SPF is universal, but quietly broken in places',
      body: [
        'Every provider publishes an SPF record, but 15% have exceeded the limit of ten DNS lookups that the SPF standard allows. Once a record goes over that limit, SPF stops working, often without anyone noticing, because each new email tool that gets added quietly pushes the count higher. It is one of the most common and most invisible email security faults we find.',
        'A further detail: 59% end their SPF record with a hard fail (-all), the correct, strict setting. The rest use a softer configuration that is more forgiving of misconfiguration but also of abuse.',
      ],
    },
    {
      heading: 'DKIM and modern transport security lag behind',
      body: [
        'Just under three quarters (71%) publish a valid DKIM signature at a standard selector, the cryptographic signing that lets recipients verify a message has not been tampered with. The newer transport-security standards are barely adopted at all: only 15% publish MTA-STS and 22% publish TLS-RPT, both of which protect mail in transit. These are not urgent for most providers, but they are the difference between a good posture and a complete one.',
      ],
    },
    {
      heading: 'What good looks like, and where to start',
      body: [
        'The strongest providers in our sample share a simple pattern: an enforced DMARC policy of reject, a valid SPF record kept under the lookup limit, and DKIM signing switched on. None of it requires new software, and most of it is free to configure.',
        'If you run email for a housing association and you are not sure where you stand, the fastest way to find out is to run the same external check we used for this report. It takes about 15 seconds and needs no access to your systems. Where the results show gaps, our cloud security team can help you reach enforcement safely, without disrupting the legitimate mail your tenants rely on.',
      ],
    },
  ],
  methodology: [
    'On 12 June 2026 we ran a passive external security scan of the primary corporate domains of the 41 largest housing associations in England by homes owned, identified from the public register maintained by the Regulator of Social Housing and sector data. Each domain was confirmed to operate live mail servers before scanning.',
    'Every check reads only publicly available DNS records and public-facing services. No system was accessed, no credentials were used, and no intrusive testing was performed. This is the same external view any member of the public, or any attacker, already has.',
    'Email authentication posture (SPF, DKIM, DMARC) was assessed against current NCSC guidance, and an overall score was calculated from the same engine that powers our free domain security check. Recently merged providers are counted as their current combined entity. Results are a snapshot as of the scan date; DNS configurations change over time, and a provider that was exposed on this date may since have fixed it.',
  ],
  // Positive recognition only. Re-verify against a fresh scan and obtain
  // Hannah/Alex sign-off before REPORTS_ENABLED is flipped on.
  topPerformers: [
    'Sovereign Network Group',
    'The Guinness Partnership',
    'Aster Group',
    'Karbon Homes',
    'Gentoo Group',
    'Regenda Homes',
    'Citizen',
    'Metropolitan Thames Valley',
    'Home Group',
    'Hyde',
  ],
};
