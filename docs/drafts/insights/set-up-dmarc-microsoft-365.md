# How to set up DMARC for Microsoft 365 without breaking your email

> DRAFT FOR REVIEW. Byline: Alex Hunte, Founder & Lead Architect. Exported from src/data/articles.ts on 2026-06-12. Publishes at rosebudcloudsolutions.co.uk/insights/set-up-dmarc-microsoft-365 once approved (currently feature-flagged off). Reading time approx 9 min.

**Meta description:** A step-by-step guide to rolling out DMARC on Microsoft 365 safely: verify SPF and DKIM, monitor at p=none, fix your senders, then tighten to reject.

Most organisations that have heard of DMARC are stuck in one of two places: no record at all, or a permanent p=none policy that monitors and protects nothing. The reason is almost always the same and it is a fair one: fear of breaking legitimate email. The fix is not bravery, it is sequence. Done in the right order, DMARC enforcement is a low-drama change. This guide walks through that order for a Microsoft 365 organisation.

> Scope: this guide covers the straightforward case, a single domain sending most of its mail through Microsoft 365. If you run multiple domains, on-premises relays, or a stack of third-party tools that send as your domain, the same principles apply but the discovery phase matters far more. The final section covers exactly where it gets risky.

## Before you start: confirm SPF and DKIM

DMARC sits on top of SPF and DKIM, so both need to be right first. If you are not sure what these three standards each do, read our [plain-English explainer](/insights/spf-dkim-dmarc-explained) first.

### SPF

Your domain needs exactly one SPF TXT record. For a pure Microsoft 365 setup it looks like this:

*SPF record (all mail via Microsoft 365):*

```
v=spf1 include:spf.protection.outlook.com -all
```

Every other service that legitimately sends email as your domain (CRM, marketing platform, invoicing system, website contact forms) needs its own include in this record. One record, all senders, and keep an eye on the ten-DNS-lookup limit that SPF imposes.

### DKIM

Microsoft 365 does not fully sign with your own domain until you enable DKIM for it. In the Microsoft Defender portal, open the email authentication settings, select your domain under the DKIM tab, and Microsoft will give you two CNAME records (selector1 and selector2) to publish in your DNS. Once the records resolve, switch signing on. If you prefer PowerShell, the same is done with New-DkimSigningConfig and Set-DkimSigningConfig.

## Step 1: publish DMARC in monitoring mode

Create a TXT record named _dmarc on your domain:

*DNS TXT record at _dmarc.yourdomain.co.uk:*

```
v=DMARC1; p=none; rua=mailto:dmarc-reports@yourdomain.co.uk
```

This changes nothing about how your mail is delivered. Its only effect is that receiving servers around the world start sending aggregate reports to the rua address, telling you every source that sends email claiming to be your domain. Use a dedicated mailbox or, better, a DMARC report-processing service, because the raw reports are XML files not meant for human eyes.

## Step 2: read the reports for two to four weeks

Give the reports a couple of normal business weeks, longer if you have monthly processes like invoicing runs or newsletters. You are looking for one thing: legitimate senders that fail DMARC alignment. Typical finds are the marketing platform nobody mentioned to IT, a line-of-business app relaying through a third party, and the website contact form sending as your domain from your web host.

Everything else that fails, the mail from servers you do not recognise in countries you do not operate in, is the spoofing you are about to switch off.

## Step 3: fix the senders you found

- Add each legitimate service to your SPF record using the include its vendor documents.
- Where the service supports it, set up DKIM signing with your domain (most reputable platforms do, and it is the more robust fix).
- For services that cannot authenticate properly, decide deliberately: replace them, move them to a subdomain with its own policy, or accept that their mail will be affected by enforcement.

## Step 4: tighten the policy gradually

Once the reports show your legitimate mail passing, move to enforcement in stages. A common, sensible progression:

1. p=quarantine with pct=25, which quarantines a quarter of failing mail. Watch the reports for a week or two.
2. p=quarantine with no pct (100 percent). Watch again.
3. p=reject. Failing mail is now refused outright. This is the policy the NCSC recommends arriving at, and it is the point where spoofing your domain stops working.

*The destination record:*

```
v=DMARC1; p=reject; rua=mailto:dmarc-reports@yourdomain.co.uk
```

Keep the rua reporting in place permanently. New senders get added by well-meaning colleagues all the time, and the reports are how you find out before their mail starts bouncing.

## Common mistakes

- Going straight to p=reject on day one. This is the move that breaks payroll notifications and earns DMARC its scary reputation. The monitoring phase exists for a reason.
- Forgetting subdomains. By default your policy covers them, but if you have deliberately weakened it with sp=none, anything.yourdomain.co.uk remains spoofable.
- Treating it as a one-off project. DMARC is a living control; senders change, vendors change their infrastructure, and the reports need an owner.
- Leaving parked domains unprotected. Domains that never send email should carry v=DMARC1; p=reject and an SPF record of v=spf1 -all, so they cannot be used against you either.

## Where this gets risky, and when to get help

The process above is safe for the simple case. The risk concentrates where the estate is messy: several domains with different sender mixes, hybrid Exchange with on-premises relays, multifunction printers and legacy apps sending direct, marketing agencies with their own sending infrastructure, or a business where one bounced invoice run is a board-level incident. In those environments the discovery phase is the project, and enforcing without doing it properly is how legitimate mail gets lost.

That discovery and safe-enforcement work is what our [cloud security team](/services/cloud-security) does, alongside the broader Microsoft estate hardening it usually surfaces. If you want to know where you stand right now, run our [free domain security check](/security-check): it reads your SPF, DKIM and DMARC records in about 15 seconds and tells you in plain English what they mean.
