# SPF, DKIM and DMARC explained in plain English

> DRAFT FOR REVIEW. Byline: Alex Hunte, Founder & Lead Architect. Exported from src/data/articles.ts on 2026-06-12. Publishes at rosebudcloudsolutions.co.uk/insights/spf-dkim-dmarc-explained once approved (currently feature-flagged off). Reading time approx 7 min.

**Meta description:** What SPF, DKIM and DMARC actually do, how they work together to stop email spoofing, and the five misconfigurations we see most often in UK businesses.

Email was designed in an era when nobody imagined criminals would want to impersonate your company. Out of the box, there is nothing stopping anyone, anywhere, from sending an email that claims to be from your domain. SPF, DKIM and DMARC are the three DNS-based standards that close that gap. This guide explains what each one does, how they fit together, and the mistakes that quietly undo them.

## The one-paragraph version

> SPF says which mail servers are allowed to send email for your domain. DKIM puts a tamper-evident cryptographic signature on each message. DMARC ties the two together, tells receiving servers what to do with mail that fails (deliver, quarantine or reject), and sends you reports about who is sending email in your name. You need all three, and DMARC only protects you once its policy is set to quarantine or reject.

## What is SPF?

SPF (Sender Policy Framework) is a TXT record in your DNS that lists the servers permitted to send email on behalf of your domain. When a mail server receives a message claiming to be from you, it looks up that record and checks whether the sending server is on the list.

*A typical SPF record for a Microsoft 365 organisation:*

```
v=spf1 include:spf.protection.outlook.com -all
```

The include statement authorises Microsoft 365 to send for you, and the -all at the end says "and nobody else". SPF has two important limitations. First, it breaks when email is forwarded, because the forwarding server is not on your list. Second, on its own it does not check the From address your recipient actually sees, only a hidden technical address. That is why SPF alone never stopped spoofing, and why DMARC exists.

## What is DKIM?

DKIM (DomainKeys Identified Mail) adds a digital signature to every message you send. Your mail server signs each outgoing email with a private key, and the matching public key is published in your DNS. Receiving servers use it to verify two things: the message genuinely came from a server holding your key, and nobody altered it in transit.

Because the signature travels with the message, DKIM survives forwarding where SPF fails. Its weakness is the opposite one: a criminal can send a message with no signature at all, and DKIM alone says nothing about whether that is suspicious. Again, that judgement is the job of DMARC.

## What is DMARC?

DMARC (Domain-based Message Authentication, Reporting and Conformance) is the policy layer on top of SPF and DKIM. It does three things that neither of the others can do alone.

1. Alignment: it checks that the domain your recipient sees in the From line matches the domain that passed SPF or DKIM. This is what actually stops display-name spoofing.
2. Policy: it tells receiving servers what to do with mail that fails, with three levels: none (deliver it anyway, just observe), quarantine (send it to junk), and reject (refuse it outright).
3. Reporting: it asks receiving servers to send you regular reports listing every source sending email as your domain, legitimate or not.

*A starter DMARC record (monitoring mode):*

```
v=DMARC1; p=none; rua=mailto:dmarc-reports@yourdomain.co.uk
```

A policy of p=none changes nothing about delivery. It is the safe starting point, but it is also where many organisations stop, which gives them visibility and no protection. The UK National Cyber Security Centre recommends moving to an enforced policy (quarantine or reject) once you know your legitimate senders all pass. We cover the safe way to get there in [our step-by-step DMARC guide for Microsoft 365](/insights/set-up-dmarc-microsoft-365).

## How the three work together

| Standard | What it does | What it cannot do alone |
|---|---|---|
| SPF | Lists the servers allowed to send for your domain | Breaks on forwarding; does not check the visible From address |
| DKIM | Cryptographically signs each message against tampering | Says nothing about unsigned mail claiming to be you |
| DMARC | Aligns SPF/DKIM with the visible From, sets policy, sends reports | Does nothing until SPF or DKIM is in place underneath it |

## The five misconfigurations we see most often

1. A DMARC policy of p=none left in place for years. Monitoring mode was always meant to be a phase, not a destination. It offers zero protection against spoofing.
2. Two SPF records on one domain. The standard allows exactly one. A second record (often added when a new marketing tool was set up) makes SPF fail outright.
3. Blowing the SPF lookup limit. SPF allows a maximum of ten DNS lookups. Each include can trigger more lookups of its own, and busy domains hit the ceiling without noticing, at which point SPF silently stops working.
4. No DMARC reports being read. The rua address either is missing, or points to a mailbox nobody opens. The reports are XML and unreadable by hand, but report-processing tools turn them into a clear picture of who is sending as you.
5. Forgotten subdomains and parked domains. Criminals do not need your main domain if invoices.yourdomain.co.uk is unprotected. Parked domains that never send email should carry an explicit reject policy.

## How do I check my own domain?

You can check all three records, along with your TLS configuration and externally visible services, with our [free domain security check](/security-check). It runs from outside your network, the same view an attacker has, takes about 15 seconds, and needs no access to your systems. If the results show gaps, our [cloud security team](/services/cloud-security) can help you close them without disrupting legitimate mail.
