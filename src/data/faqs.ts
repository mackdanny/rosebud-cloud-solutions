export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

// Each entry should stay 40-90 words, self-contained (no "see above"), UK English.
// Pairs with faqSchema() in seoMeta.ts to emit FAQPage JSON-LD for AI citation.
export const faqs = {
  azureLandingZones: [
    {
      question: 'What is an Azure Landing Zone and do we actually need one?',
      answer:
        "An Azure Landing Zone is the foundational platform that sits beneath your workloads - management groups, subscriptions, policy, network topology, identity, and logging, all configured to Microsoft's Cloud Adoption Framework. If you plan to run more than a handful of workloads in Azure, building a landing zone early prevents the sprawl, inconsistency, and control gaps that are significantly harder to fix later.",
    },
    {
      question: "What's the difference between a landing zone and Microsoft's Cloud Adoption Framework?",
      answer:
        'The Cloud Adoption Framework (CAF) is the methodology - the full set of guidance for adopting Azure responsibly. A landing zone is one of its outputs: the concrete platform that encodes CAF principles into management groups, policies, networking, and identity. We design and deploy landing zones as the tangible implementation of CAF, not as a theoretical reference.',
    },
    {
      question: 'Can you retrofit a landing zone onto an existing Azure environment?',
      answer:
        "Yes, though the approach differs from a greenfield build. We start by mapping what is already in place - subscriptions, policies, network layout, identity - then design a target landing zone and a migration path that brings existing workloads into it in phases. It is slower than starting fresh, but avoids the disruption of rebuilding production workloads from scratch.",
    },
    {
      question: 'How is the landing zone actually deployed - Terraform, Bicep, or something else?',
      answer:
        'We use Infrastructure-as-Code for every deployment, typically Terraform or Bicep depending on client preference and existing tooling. The landing zone, policies, and baseline resources live in a Git repository with proper change control. This means the platform is reproducible, auditable, and evolvable - no click-ops configuration sitting in the portal.',
    },
    {
      question: 'How long does a landing zone engagement typically take?',
      answer:
        'A standard enterprise-scale landing zone takes four to eight weeks to design and deploy, depending on complexity and decision-making pace. Smaller or single-region environments can complete in two to four weeks. Timelines are dominated by architectural decisions - network topology, identity strategy, policy posture - rather than the deployment itself, which is largely automated once decisions are made.',
    },
    {
      question: 'Do landing zones handle multi-subscription governance automatically?',
      answer:
        'Yes - that is much of the point. Management groups, Azure Policy, and RBAC are configured at the group level so new subscriptions inherit the same guardrails by default. Adding a subscription becomes a declarative action rather than a manual checklist. Policies enforce allowed regions, resource types, tagging, encryption, and logging before any workload team touches the environment.',
    },
  ],
  cloudSecurity: [
    {
      question: "What does Rosebud's Cloud Security & Compliance service cover?",
      answer:
        'We cover the full lifecycle of Azure security - identity and access design, policy-based governance, threat detection through Microsoft Defender for Cloud, encryption and key management, network segmentation, and continuous compliance monitoring against recognised standards. The goal is a single, coherent security posture that is enforced automatically by the platform rather than checked manually after the fact.',
    },
    {
      question: 'How is this different from adding security to an existing Azure environment later?',
      answer:
        'Retrofitted security tends to be inconsistent - controls land on some workloads, get skipped on others, and drift over time. We embed security into the Azure platform itself, so every new subscription and workload inherits the same policies, network controls, and logging by default. It is enforcement through architecture, not periodic audits after deployment.',
    },
    {
      question: 'Which security standards and frameworks do you align to?',
      answer:
        'We map Azure environments to the frameworks most relevant to each client - typically ISO 27001, NIST CSF, CIS Benchmarks, the Microsoft Cloud Security Benchmark, and sector-specific controls such as FCA guidance for financial services or the NCSC Cloud Security Principles for public sector. Alignment is continuous and monitored, not a point-in-time assessment.',
    },
    {
      question: 'How does Microsoft Defender for Cloud fit into what you deliver?',
      answer:
        'Defender for Cloud is one component of the picture, not the whole answer. We configure it as the unified posture and threat-detection layer across subscriptions - tuning recommendations, enabling Defender plans where they add measurable value, and integrating alerts into your monitoring stack. We will also tell you where Defender alone is not sufficient and what needs to sit alongside it.',
    },
    {
      question: 'What does a typical cloud security engagement look like?',
      answer:
        'Most engagements open with a posture assessment - a review of the current environment against the Microsoft Cloud Security Benchmark and your target frameworks - followed by a prioritised remediation roadmap. From there we either deliver the hardening work directly, or hand it over with playbooks so your team can run it. Ongoing monitoring is available through our [Managed Cloud](/services/managed-cloud) service.',
    },
    {
      question: 'How do you keep an Azure environment compliant over time, not just at point of delivery?',
      answer:
        'Compliance drifts the moment deployment stops. We set up Azure Policy, Defender for Cloud regulatory compliance dashboards, and automated alerting so deviations surface the day they happen, not six months later in an audit. Where appropriate, policies are configured to deny or auto-remediate so non-compliant resources cannot exist in the first place.',
    },
  ],
  devSecOps: [
    {
      question: 'What does DevSecOps actually mean in an Azure context?',
      answer:
        'DevSecOps means security controls are built into the delivery pipeline itself, not layered on afterwards. In Azure, that typically covers automated policy enforcement, secret management through Key Vault, vulnerability scanning of code and container images, infrastructure-as-code validation, and compliance checks before anything reaches production. Security becomes a property of the pipeline rather than a separate review step.',
    },
    {
      question: 'How is DevSecOps different from regular DevOps?',
      answer:
        'DevOps focuses on delivery speed and automation; DevSecOps keeps those goals but embeds security as a first-class concern at every stage. Practically, that means security tooling runs automatically alongside build and deployment - shifting detection left so issues are caught by developers at commit time rather than by security teams weeks later. Same speed, higher confidence.',
    },
    {
      question: 'Which CI/CD platforms do you work with?',
      answer:
        'We work with Azure DevOps and GitHub Actions as primary platforms, which covers most Azure-centric teams. The patterns we implement - pipeline-as-code, policy gates, artifact scanning - are portable, so the same approach translates to other platforms if you change toolchains later. We do not mandate a specific stack; we adapt to what your team already uses.',
    },
    {
      question: 'How do you handle secrets and credentials in pipelines?',
      answer:
        'Secrets live in Azure Key Vault and are injected at runtime using workload identity federation or managed identities - never stored in pipeline variables, repository files, or config. Pipelines authenticate to Azure without long-lived credentials, access is scoped to the minimum required, and every secret access is logged. This removes the category of leaked-credentials incidents almost entirely.',
    },
    {
      question: 'What vulnerability scanning and policy enforcement do you typically set up?',
      answer:
        'Standard coverage includes static code analysis, dependency scanning for known CVEs in open-source libraries, container image scanning, infrastructure-as-code validation against Azure Policy, and secret scanning to catch credentials committed by mistake. Results are gated - a pipeline with critical findings cannot promote to production without an explicit, logged override.',
    },
    {
      question: 'Can you integrate with existing pipelines, or do we need to rebuild?',
      answer:
        'We integrate with what you have wherever possible. Most engagements start by reviewing existing pipelines and adding security stages incrementally - a scan here, a policy gate there - so teams keep shipping while the controls mature. Full rebuilds are only necessary when the existing pipelines are fundamentally unsuitable, which is rare.',
    },
  ],
  cloudOptimisation: [
    {
      question: 'Does cloud optimisation mean cost reduction, performance tuning, or both?',
      answer:
        'Both - and the two are often linked. Cost optimisation includes right-sizing, reserved capacity, spot instances, storage tiering, and eliminating orphaned resources. Performance optimisation covers architectural choices that remove expensive anti-patterns - inefficient data movement, wrong service tiers, poorly designed queries. A well-optimised environment usually costs less and performs better, because the same inefficiencies cause both problems.',
    },
    {
      question: 'What kind of Azure cost reduction is realistic?',
      answer:
        'Most unoptimised Azure environments have 20 to 40 percent of avoidable spend in them - idle resources, oversized VMs, unused storage, missed reservation opportunities. The first wave of optimisation typically recovers most of that within a few weeks. Beyond that, savings become architectural; further 10 to 20 percent gains usually come from redesigning hot-spot workloads rather than tweaking settings.',
    },
    {
      question: 'What is FinOps and how does it fit in?',
      answer:
        'FinOps is the operating model that keeps cloud costs under control over time - shared accountability between finance, engineering, and operations, with tagging, showback, and budgeting built into everyday delivery. We treat optimisation as a one-off clean-up, but FinOps as the discipline that prevents the next round of waste. Without FinOps, costs tend to climb straight back.',
    },
    {
      question: 'How quickly can we expect to see savings?',
      answer:
        'The first optimisation wave - right-sizing obvious waste, applying reservations, eliminating orphans - usually delivers visible savings within the first billing cycle, often within four weeks. Architectural optimisation is slower, delivering results over one to three months as workloads are redesigned or migrated. We sequence the quick wins first so they self-fund the deeper work.',
    },
    {
      question: 'Can you reduce costs without affecting reliability or performance?',
      answer:
        'Yes, when it is done properly. Every change goes through architectural review and is tested against performance and availability baselines before deployment. We never optimise by removing redundancy, shrinking capacity below real demand, or weakening resilience. Cost savings that create operational risk are not savings - they are deferred incidents.',
    },
  ],
  advisoryConsulting: [
    {
      question: 'What does Azure advisory actually cover?',
      answer:
        'Advisory is strategic guidance rather than implementation. It covers cloud adoption strategy, platform architecture decisions, target operating models, sourcing and vendor strategy, and independent reviews of existing environments. We act as a trusted technical counterpart for CIOs, heads of platform, and architecture teams who need senior input on direction without committing to a full delivery engagement.',
    },
    {
      question: 'How is advisory different from your other services?',
      answer:
        'Our other services deliver things - [a landing zone](/services/azure-landing-zones), [a security baseline](/services/cloud-security), [a managed environment](/services/managed-cloud). Advisory delivers clarity and decisions. It is the right fit when the next step is not build-something, it is decide-something: choosing a cloud strategy, assessing whether a proposed architecture will hold up, or reviewing an existing platform for risks and gaps before committing further investment.',
    },
    {
      question: 'Who do you typically work with inside the client organisation?',
      answer:
        'Most advisory engagements are with CIOs, CTOs, heads of platform engineering, enterprise architects, or programme leads. We are comfortable at board and executive level when that is where the decision sits, and equally comfortable working alongside architects in deep technical detail. The scope of each engagement is set by where the decision-making needs to happen.',
    },
    {
      question: 'Are you genuinely independent, given you are Microsoft-certified?',
      answer:
        "Microsoft certification reflects technical competence, not a sales mandate. We do not receive commissions for recommending Microsoft products, and we regularly advise clients against parts of the Microsoft stack when they are not the right fit. Our starting position is the client's constraints and goals - the toolset follows from there, not the other way round.",
    },
    {
      question: 'What does a typical advisory engagement look like?',
      answer:
        'Most engagements are short, intensive blocks - a two-to-four-week architecture review, a six-week strategy exercise, or ongoing retainer access for decision-level input. Output is usually a written report plus working sessions with the client team to pressure-test conclusions. We avoid open-ended engagements that drift into implementation without a clear transition.',
    },
  ],
  home: [
    {
      question: 'What does Rosebud Cloud Solutions actually do?',
      answer:
        'We are a UK-based Microsoft-certified consultancy focused on Azure. We design and deliver [landing zones](/services/azure-landing-zones), [cloud security](/services/cloud-security), [DevSecOps](/services/devsecops), [cost optimisation](/services/cloud-optimisation), [advisory](/services/advisory-consulting) engagements, and [ongoing managed operations](/services/managed-cloud). Clients are typically regulated enterprises - financial services, public sector, legal, retail - where security, compliance, and reliability are non-negotiable.',
    },
    {
      question: 'Which industries and client sizes do you typically work with?',
      answer:
        'Most clients are Tier-1 and mid-market organisations in regulated sectors: financial services (banks, asset managers), public sector bodies, legal firms, and retail businesses. We are comfortable at enterprise scale but equally effective with smaller organisations needing senior input without a large delivery team. The common thread is workloads where getting Azure wrong has real operational or regulatory consequences.',
    },
    {
      question: 'Are you genuinely Microsoft-certified, and what does that mean for clients?',
      answer:
        'Yes - we are a recognised Microsoft Solutions Partner for Data & AI, Digital & App Innovation, and Infrastructure on Azure, which is a company-level designation that requires demonstrated technical capability and proven client outcomes. On top of that, our architects hold individual Microsoft certifications across Azure platform, security, and DevOps disciplines. In practical terms, that means our designs are validated against Microsoft reference architectures, we get early access to Microsoft engineering guidance, and we know when to escalate through Microsoft support for genuinely difficult problems rather than spending client time re-discovering answers.',
    },
    {
      question: 'Where are you based and where can you work?',
      answer:
        'We are based in the United Kingdom and deliver primarily for UK clients, though we work comfortably with multinational organisations whose UK entity is the point of engagement. Delivery is usually remote with on-site presence where security clearances, workshops, or critical incidents require it. Data handling and residency follow UK and EU regulations by default.',
    },
    {
      question: 'What is the best way to start a conversation?',
      answer:
        'The [contact page](/contact) is the fastest route - a short message describing your current situation (migrating to Azure, reviewing an existing platform, dealing with a specific problem) and we will come back within one working day to set up an initial discussion. First conversations are free, short, and under no obligation. We will tell you honestly whether we can help or whether someone else is better placed.',
    },
  ],
  about: [
    {
      question: 'What makes Rosebud Cloud Solutions different from other Azure consultancies?',
      answer:
        "We focus narrowly on Azure and the Microsoft cloud stack rather than spreading across every cloud and every technology. Depth over breadth. We hold Microsoft Solutions Partner designations for Data & AI, Digital & App Innovation, and Infrastructure, and every senior engineer carries individual Microsoft certifications with real delivery experience at enterprise scale. We do not staff engagements with people learning on the client's time, and we do not take on work that sits outside what we are genuinely expert in.",
    },
    {
      question: 'What does your team look like?',
      answer:
        'A small, senior team of Azure architects, cloud security specialists, and DevSecOps engineers - each with years of delivery in regulated environments. We are deliberately right-sized rather than scaled-for-sales: engagements are led by the people who actually understand your environment, not handed off to junior delivery teams after the pitch. If you want to know who will be doing the work, ask on the first call.',
    },
    {
      question: 'Do you have references or client case studies?',
      answer:
        'Yes. Our [case studies page](/case-studies) covers anonymised engagements across financial services, public sector, legal, and retail - landing zones, security hardening, FinOps, identity modernisation, and platform migrations. For named references, we arrange introductions directly with clients who have agreed to act as referees. These are typically available once an engagement is being seriously discussed.',
    },
    {
      question: 'How long has the company been working on Azure?',
      answer:
        "Rosebud Cloud Solutions was built specifically for Azure platform delivery, and the team's collective Azure experience goes back to the platform's early enterprise adoption. Several team members have been building on Azure since before ARM templates, which means we have seen which patterns age well and which collapse under scale. That perspective shapes every design decision we make.",
    },
    {
      question: 'How should I decide whether to engage Rosebud?',
      answer:
        'Short answer: if you need senior, independent Azure expertise and want engineers rather than a sales team, we are probably a good fit. If you need a generalist cloud consultancy covering AWS, GCP, and everything else, we are not. Our [how-we-work page](/how-we-work) explains the engagement model in more detail, and a 30-minute call is the fastest way to find out if we match your situation.',
    },
  ],
  howWeWork: [
    {
      question: 'How do you typically structure an engagement?',
      answer:
        'Most engagements run in three phases: a short discovery to understand the environment and decision context, a design-and-plan phase with clear deliverables, and a delivery phase with defined checkpoints. We prefer fixed-scope blocks over open-ended time and materials - it keeps both sides honest about what is actually being delivered and when. Scope changes happen explicitly, not by drift.',
    },
    {
      question: 'Do you work remotely, on-site, or both?',
      answer:
        'Primarily remote, with on-site presence where it adds real value - workshops, security clearances, critical incidents, or new-client kickoffs. Remote delivery is not a compromise; it is how senior engineers stay focused and how we keep engagement costs proportionate. If a client requires full on-site delivery, we will discuss it openly rather than pretending it is our default.',
    },
    {
      question: 'How do you handle handover so our team is not left stranded?',
      answer:
        'Handover is built into every engagement, not a last-phase afterthought. We document everything as we go (runbooks, decision records, architecture-as-code in Git), work alongside your team during delivery where possible, and run explicit knowledge-transfer sessions before closeout. If we are disappearing on the last day and your team does not understand what we built, something has gone wrong with the engagement shape.',
    },
    {
      question: 'What does your delivery approach actually look like day-to-day?',
      answer:
        'Weekly written progress updates, decision logs for anything architectural, infrastructure-as-code in the client repository from day one, and regular working sessions with the client team. We do not work behind a black curtain and surface finished artefacts - clients see the work taking shape, challenge it, and course-correct early. Surprises at the end are cheap to prevent and expensive to recover from.',
    },
    {
      question: 'How do you measure whether an engagement has been successful?',
      answer:
        'Success criteria are defined at the start of each engagement - specific, measurable, and agreed with the client. For a landing zone, that is typically deployment completeness, policy compliance, and documented handover. For [cloud optimisation](/services/cloud-optimisation), it is measurable cost reduction with no reliability regression. We report against those criteria rather than self-assessing subjectively at the end.',
    },
    {
      question: 'Will we be working with a sales team or with the engineers?',
      answer:
        'Directly with the engineers from the first technical conversation onwards. We do not have a dedicated sales function; initial calls are with the people who will actually lead your engagement. This means conversations are technically honest from the start - if your problem is not a good fit, you will hear that directly, not a polished proposal. It also means pricing conversations happen with people who understand the delivery effort.',
    },
  ],
  managedCloud: [
    {
      question: 'What does your managed cloud service actually cover?',
      answer:
        'It covers ongoing operations of your Azure environment: 24/7 monitoring, incident response, patching, backup and recovery, [security posture management](/services/cloud-security), [cost oversight](/services/cloud-optimisation), and regular platform improvements. The goal is a stable, continuously-improving platform without your team having to carry the operational weight in-house. Scope is defined per client so you pay for what you actually need.',
    },
    {
      question: 'How is this different from a traditional managed service provider?',
      answer:
        'Traditional MSPs often operate a ticket-and-fix model - incident happens, someone reacts. Our approach is engineering-led: we improve the platform continuously so incidents happen less often, automate remediation where it is safe, and treat each incident as a signal to make the environment more resilient. You get operations support plus platform evolution, not just break-fix.',
    },
    {
      question: 'What SLAs do you offer?',
      answer:
        "Response-time SLAs are tiered by severity: critical production incidents within 15 minutes, major within one hour, and routine within one business day. Resolution targets depend on the nature of the issue and the client's environment, so we set them explicitly per engagement rather than making generic promises. SLAs are reported monthly and tied to service credits where appropriate.",
    },
    {
      question: 'Do you replace our internal team or work alongside them?',
      answer:
        'Either model works. Some clients use us to run the whole platform; others keep an internal team and use us for out-of-hours cover, specialist input, or capacity during busy periods. The engagement model is set up explicitly at the start so ownership, escalation paths, and decision rights are clear - there is no ambiguity about who does what.',
    },
    {
      question: 'Can you manage an environment you didn\u2019t build?',
      answer:
        'Yes - most managed engagements start with an environment that already exists. We begin with a discovery and onboarding phase to map the platform, identify risks, document runbooks, and align monitoring to our standards. Where we find significant issues, they are surfaced transparently with a remediation plan rather than absorbed silently into the service.',
    },
    {
      question: 'How do you handle incident response out of hours?',
      answer:
        'A dedicated on-call rota covers 24/7, with tiered escalation so the right engineer is paged for the right issue. Incidents are logged, investigated, and remediated with a written post-incident review for anything above routine severity. We do not use a generic service desk as the frontline; incidents go to engineers who know your environment from the start.',
    },
  ],
  securityCheck: [
    {
      question: 'What is DMARC and why does my business need it?',
      answer:
        'DMARC (Domain-based Message Authentication, Reporting and Conformance) tells receiving mail servers what to do when an email claims to come from your domain but fails authentication. Without an enforced DMARC policy, criminals can send convincing phishing emails to your customers, suppliers, and staff that appear to come from you. The NCSC recommends DMARC as a baseline control for UK organisations.',
    },
    {
      question: 'What is the difference between SPF, DKIM and DMARC?',
      answer:
        'SPF lists which mail servers are allowed to send email for your domain. DKIM adds a cryptographic signature to outgoing messages so recipients can verify they have not been tampered with. DMARC ties the two together and sets a policy telling receiving servers to quarantine or reject messages that fail. All three working together is the standard the NCSC recommends.',
    },
    {
      question: 'Will running this scan affect my website or email?',
      answer:
        'No. The scan is passive and external. It reads publicly available DNS records and checks your public-facing web services, the same information anyone on the internet can already see. It does not send test emails, log in to anything, or touch your internal systems.',
    },
    {
      question: 'What happens to the information I enter?',
      answer:
        'The scan uses only publicly available DNS and web data. We keep the scan results so we can generate your report, and if you request the full report by email we store your address to send it and to follow up once. We never sell or share your details with third parties. See our [privacy policy](/privacy) for full detail.',
    },
    {
      question: 'What do I get in the full report?',
      answer:
        'The instant result shows your overall score, rating, and how many issues were found. The full report, sent to your email as a private link, breaks down every finding with a severity rating, explains what each one means in plain English, and covers your email authentication, web and TLS configuration, and externally visible footprint.',
    },
  ],
} as const;
