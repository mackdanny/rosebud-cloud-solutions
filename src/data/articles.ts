// Insights articles. Content as typed structured blocks (mirrors the
// caseStudies.ts data-driven pattern) rendered by ArticlePage. Keep copy in
// UK English with no em-dashes; paragraph text may use markdown-style links
// [text](/path) which the renderer turns into router links.
//
// PUBLISHING GATE: these carry a real person's byline. They go live only via
// INSIGHTS_ENABLED in src/config/features.ts, after the author has approved
// the drafts in docs/drafts/insights/. Bump datePublished/dateModified to the
// real publish date at flip time.

export interface ArticleBlock {
  readonly type: 'h2' | 'h3' | 'p' | 'list' | 'code' | 'callout' | 'table';
  readonly text?: string; // h2, h3, p, callout
  readonly items?: readonly string[]; // list
  readonly ordered?: boolean; // list
  readonly label?: string; // code
  readonly code?: string; // code
  readonly headers?: readonly string[]; // table
  readonly rows?: readonly (readonly string[])[]; // table
}

export interface Article {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly datePublished: string;
  readonly dateModified: string;
  readonly readingMinutes: number;
  readonly blocks: readonly ArticleBlock[];
}

export const articleAuthor = {
  name: 'Alex Hunte',
  role: 'Founder & Lead Architect',
  linkedin: 'https://www.linkedin.com/in/alex-hunte-ab716a45/',
} as const;

export const articles: readonly Article[] = [
  {
    slug: 'spf-dkim-dmarc-explained',
    title: 'SPF, DKIM and DMARC explained in plain English',
    description:
      'What SPF, DKIM and DMARC actually do, how they work together to stop email spoofing, and the five misconfigurations we see most often in UK businesses.',
    datePublished: '2026-06-12',
    dateModified: '2026-06-12',
    readingMinutes: 7,
    blocks: [
      {
        type: 'p',
        text: 'Email was designed in an era when nobody imagined criminals would want to impersonate your company. Out of the box, there is nothing stopping anyone, anywhere, from sending an email that claims to be from your domain. SPF, DKIM and DMARC are the three DNS-based standards that close that gap. This guide explains what each one does, how they fit together, and the mistakes that quietly undo them.',
      },
      { type: 'h2', text: 'The one-paragraph version' },
      {
        type: 'callout',
        text: 'SPF says which mail servers are allowed to send email for your domain. DKIM puts a tamper-evident cryptographic signature on each message. DMARC ties the two together, tells receiving servers what to do with mail that fails (deliver, quarantine or reject), and sends you reports about who is sending email in your name. You need all three, and DMARC only protects you once its policy is set to quarantine or reject.',
      },
      { type: 'h2', text: 'What is SPF?' },
      {
        type: 'p',
        text: 'SPF (Sender Policy Framework) is a TXT record in your DNS that lists the servers permitted to send email on behalf of your domain. When a mail server receives a message claiming to be from you, it looks up that record and checks whether the sending server is on the list.',
      },
      {
        type: 'code',
        label: 'A typical SPF record for a Microsoft 365 organisation',
        code: 'v=spf1 include:spf.protection.outlook.com -all',
      },
      {
        type: 'p',
        text: 'The include statement authorises Microsoft 365 to send for you, and the -all at the end says "and nobody else". SPF has two important limitations. First, it breaks when email is forwarded, because the forwarding server is not on your list. Second, on its own it does not check the From address your recipient actually sees, only a hidden technical address. That is why SPF alone never stopped spoofing, and why DMARC exists.',
      },
      { type: 'h2', text: 'What is DKIM?' },
      {
        type: 'p',
        text: 'DKIM (DomainKeys Identified Mail) adds a digital signature to every message you send. Your mail server signs each outgoing email with a private key, and the matching public key is published in your DNS. Receiving servers use it to verify two things: the message genuinely came from a server holding your key, and nobody altered it in transit.',
      },
      {
        type: 'p',
        text: 'Because the signature travels with the message, DKIM survives forwarding where SPF fails. Its weakness is the opposite one: a criminal can send a message with no signature at all, and DKIM alone says nothing about whether that is suspicious. Again, that judgement is the job of DMARC.',
      },
      { type: 'h2', text: 'What is DMARC?' },
      {
        type: 'p',
        text: 'DMARC (Domain-based Message Authentication, Reporting and Conformance) is the policy layer on top of SPF and DKIM. It does three things that neither of the others can do alone.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Alignment: it checks that the domain your recipient sees in the From line matches the domain that passed SPF or DKIM. This is what actually stops display-name spoofing.',
          'Policy: it tells receiving servers what to do with mail that fails, with three levels: none (deliver it anyway, just observe), quarantine (send it to junk), and reject (refuse it outright).',
          'Reporting: it asks receiving servers to send you regular reports listing every source sending email as your domain, legitimate or not.',
        ],
      },
      {
        type: 'code',
        label: 'A starter DMARC record (monitoring mode)',
        code: 'v=DMARC1; p=none; rua=mailto:dmarc-reports@yourdomain.co.uk',
      },
      {
        type: 'p',
        text: 'A policy of p=none changes nothing about delivery. It is the safe starting point, but it is also where many organisations stop, which gives them visibility and no protection. The UK National Cyber Security Centre recommends moving to an enforced policy (quarantine or reject) once you know your legitimate senders all pass. We cover the safe way to get there in [our step-by-step DMARC guide for Microsoft 365](/insights/set-up-dmarc-microsoft-365).',
      },
      { type: 'h2', text: 'How the three work together' },
      {
        type: 'table',
        headers: ['Standard', 'What it does', 'What it cannot do alone'],
        rows: [
          ['SPF', 'Lists the servers allowed to send for your domain', 'Breaks on forwarding; does not check the visible From address'],
          ['DKIM', 'Cryptographically signs each message against tampering', 'Says nothing about unsigned mail claiming to be you'],
          ['DMARC', 'Aligns SPF/DKIM with the visible From, sets policy, sends reports', 'Does nothing until SPF or DKIM is in place underneath it'],
        ],
      },
      { type: 'h2', text: 'The five misconfigurations we see most often' },
      {
        type: 'list',
        ordered: true,
        items: [
          'A DMARC policy of p=none left in place for years. Monitoring mode was always meant to be a phase, not a destination. It offers zero protection against spoofing.',
          'Two SPF records on one domain. The standard allows exactly one. A second record (often added when a new marketing tool was set up) makes SPF fail outright.',
          'Blowing the SPF lookup limit. SPF allows a maximum of ten DNS lookups. Each include can trigger more lookups of its own, and busy domains hit the ceiling without noticing, at which point SPF silently stops working.',
          'No DMARC reports being read. The rua address either is missing, or points to a mailbox nobody opens. The reports are XML and unreadable by hand, but report-processing tools turn them into a clear picture of who is sending as you.',
          'Forgotten subdomains and parked domains. Criminals do not need your main domain if invoices.yourdomain.co.uk is unprotected. Parked domains that never send email should carry an explicit reject policy.',
        ],
      },
      { type: 'h2', text: 'How do I check my own domain?' },
      {
        type: 'p',
        text: 'You can check all three records, along with your TLS configuration and externally visible services, with our [free domain security check](/security-check). It runs from outside your network, the same view an attacker has, takes about 15 seconds, and needs no access to your systems. If the results show gaps, our [cloud security team](/services/cloud-security) can help you close them without disrupting legitimate mail.',
      },
    ],
  },
  {
    slug: 'set-up-dmarc-microsoft-365',
    title: 'How to set up DMARC for Microsoft 365 without breaking your email',
    description:
      'A step-by-step guide to rolling out DMARC on Microsoft 365 safely: verify SPF and DKIM, monitor at p=none, fix your senders, then tighten to reject.',
    datePublished: '2026-06-12',
    dateModified: '2026-06-12',
    readingMinutes: 9,
    blocks: [
      {
        type: 'p',
        text: 'Most organisations that have heard of DMARC are stuck in one of two places: no record at all, or a permanent p=none policy that monitors and protects nothing. The reason is almost always the same and it is a fair one: fear of breaking legitimate email. The fix is not bravery, it is sequence. Done in the right order, DMARC enforcement is a low-drama change. This guide walks through that order for a Microsoft 365 organisation.',
      },
      {
        type: 'callout',
        text: 'Scope: this guide covers the straightforward case, a single domain sending most of its mail through Microsoft 365. If you run multiple domains, on-premises relays, or a stack of third-party tools that send as your domain, the same principles apply but the discovery phase matters far more. The final section covers exactly where it gets risky.',
      },
      { type: 'h2', text: 'Before you start: confirm SPF and DKIM' },
      {
        type: 'p',
        text: 'DMARC sits on top of SPF and DKIM, so both need to be right first. If you are not sure what these three standards each do, read our [plain-English explainer](/insights/spf-dkim-dmarc-explained) first.',
      },
      { type: 'h3', text: 'SPF' },
      {
        type: 'p',
        text: 'Your domain needs exactly one SPF TXT record. For a pure Microsoft 365 setup it looks like this:',
      },
      {
        type: 'code',
        label: 'SPF record (all mail via Microsoft 365)',
        code: 'v=spf1 include:spf.protection.outlook.com -all',
      },
      {
        type: 'p',
        text: 'Every other service that legitimately sends email as your domain (CRM, marketing platform, invoicing system, website contact forms) needs its own include in this record. One record, all senders, and keep an eye on the ten-DNS-lookup limit that SPF imposes.',
      },
      { type: 'h3', text: 'DKIM' },
      {
        type: 'p',
        text: 'Microsoft 365 does not fully sign with your own domain until you enable DKIM for it. In the Microsoft Defender portal, open the email authentication settings, select your domain under the DKIM tab, and Microsoft will give you two CNAME records (selector1 and selector2) to publish in your DNS. Once the records resolve, switch signing on. If you prefer PowerShell, the same is done with New-DkimSigningConfig and Set-DkimSigningConfig.',
      },
      { type: 'h2', text: 'Step 1: publish DMARC in monitoring mode' },
      {
        type: 'p',
        text: 'Create a TXT record named _dmarc on your domain:',
      },
      {
        type: 'code',
        label: 'DNS TXT record at _dmarc.yourdomain.co.uk',
        code: 'v=DMARC1; p=none; rua=mailto:dmarc-reports@yourdomain.co.uk',
      },
      {
        type: 'p',
        text: 'This changes nothing about how your mail is delivered. Its only effect is that receiving servers around the world start sending aggregate reports to the rua address, telling you every source that sends email claiming to be your domain. Use a dedicated mailbox or, better, a DMARC report-processing service, because the raw reports are XML files not meant for human eyes.',
      },
      { type: 'h2', text: 'Step 2: read the reports for two to four weeks' },
      {
        type: 'p',
        text: 'Give the reports a couple of normal business weeks, longer if you have monthly processes like invoicing runs or newsletters. You are looking for one thing: legitimate senders that fail DMARC alignment. Typical finds are the marketing platform nobody mentioned to IT, a line-of-business app relaying through a third party, and the website contact form sending as your domain from your web host.',
      },
      {
        type: 'p',
        text: 'Everything else that fails, the mail from servers you do not recognise in countries you do not operate in, is the spoofing you are about to switch off.',
      },
      { type: 'h2', text: 'Step 3: fix the senders you found' },
      {
        type: 'list',
        ordered: false,
        items: [
          'Add each legitimate service to your SPF record using the include its vendor documents.',
          'Where the service supports it, set up DKIM signing with your domain (most reputable platforms do, and it is the more robust fix).',
          'For services that cannot authenticate properly, decide deliberately: replace them, move them to a subdomain with its own policy, or accept that their mail will be affected by enforcement.',
        ],
      },
      { type: 'h2', text: 'Step 4: tighten the policy gradually' },
      {
        type: 'p',
        text: 'Once the reports show your legitimate mail passing, move to enforcement in stages. A common, sensible progression:',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'p=quarantine with pct=25, which quarantines a quarter of failing mail. Watch the reports for a week or two.',
          'p=quarantine with no pct (100 percent). Watch again.',
          'p=reject. Failing mail is now refused outright. This is the policy the NCSC recommends arriving at, and it is the point where spoofing your domain stops working.',
        ],
      },
      {
        type: 'code',
        label: 'The destination record',
        code: 'v=DMARC1; p=reject; rua=mailto:dmarc-reports@yourdomain.co.uk',
      },
      {
        type: 'p',
        text: 'Keep the rua reporting in place permanently. New senders get added by well-meaning colleagues all the time, and the reports are how you find out before their mail starts bouncing.',
      },
      { type: 'h2', text: 'Common mistakes' },
      {
        type: 'list',
        ordered: false,
        items: [
          'Going straight to p=reject on day one. This is the move that breaks payroll notifications and earns DMARC its scary reputation. The monitoring phase exists for a reason.',
          'Forgetting subdomains. By default your policy covers them, but if you have deliberately weakened it with sp=none, anything.yourdomain.co.uk remains spoofable.',
          'Treating it as a one-off project. DMARC is a living control; senders change, vendors change their infrastructure, and the reports need an owner.',
          'Leaving parked domains unprotected. Domains that never send email should carry v=DMARC1; p=reject and an SPF record of v=spf1 -all, so they cannot be used against you either.',
        ],
      },
      { type: 'h2', text: 'Where this gets risky, and when to get help' },
      {
        type: 'p',
        text: 'The process above is safe for the simple case. The risk concentrates where the estate is messy: several domains with different sender mixes, hybrid Exchange with on-premises relays, multifunction printers and legacy apps sending direct, marketing agencies with their own sending infrastructure, or a business where one bounced invoice run is a board-level incident. In those environments the discovery phase is the project, and enforcing without doing it properly is how legitimate mail gets lost.',
      },
      {
        type: 'p',
        text: 'That discovery and safe-enforcement work is what our [cloud security team](/services/cloud-security) does, alongside the broader Microsoft estate hardening it usually surfaces. If you want to know where you stand right now, run our [free domain security check](/security-check): it reads your SPF, DKIM and DMARC records in about 15 seconds and tells you in plain English what they mean.',
      },
    ],
  },
];

export function articleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
