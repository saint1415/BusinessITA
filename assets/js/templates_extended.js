// templates-extended.js - Extended Template Library
window.BITA_TEMPLATES_EXTENDED = {
  
  // ========================================
  // SECURITY PACK
  // ========================================
  security: [
    {
      id: "security_breach_initial",
      title: "Security – Data Breach (Initial)",
      audience: "executive",
      category: "security",
      severity: ["S0", "S1"],
      version: "1.0.0",
      tokens_required: [
        "INCIDENT_NAME", "START_TIME", "DATA_TYPES_AFFECTED",
        "RECORDS_COUNT", "BREACH_VECTOR", "CONTAINMENT_STATUS",
        "IC_NAME", "CONTACT"
      ],
      body: `Subject: [URGENT] Security Incident – [INCIDENT_NAME]

We have identified a potential data breach affecting [DATA_TYPES_AFFECTED].

Timeline: Detected at [START_TIME]
Scope: Approximately [RECORDS_COUNT] records potentially affected
Vector: [BREACH_VECTOR]
Containment: [CONTAINMENT_STATUS]

Immediate actions:
- Security team engaged
- Affected systems isolated
- Forensic investigation initiated
- Legal and compliance notified

Next steps: Full impact assessment, notification planning per regulatory requirements.

IC: [IC_NAME] | Contact: [CONTACT]`
    },
    {
      id: "security_ransomware",
      title: "Security – Ransomware Attack",
      audience: "internal",
      category: "security",
      severity: ["S0", "S1"],
      version: "1.0.0",
      tokens_required: [
        "AFFECTED_SYSTEMS", "ENCRYPTION_STATUS", "BACKUP_STATUS",
        "CONTAINMENT_ACTIONS", "LAW_ENFORCEMENT_NOTIFIED", "IC_NAME"
      ],
      body: `RANSOMWARE INCIDENT – IMMEDIATE ACTION REQUIRED

Affected Systems: [AFFECTED_SYSTEMS]
Encryption Status: [ENCRYPTION_STATUS]
Backup Status: [BACKUP_STATUS]

Containment Actions Taken:
[CONTAINMENT_ACTIONS]

DO NOT:
- Pay ransom without executive approval
- Attempt to decrypt files manually
- Remove infected systems from network before forensics

Law Enforcement: [LAW_ENFORCEMENT_NOTIFIED]
Cyber Insurance: Policy activated, adjuster notified

War Room: #security-incident | IC: [IC_NAME]`
    },
    {
      id: "security_unauthorized_access",
      title: "Security – Unauthorized Access",
      audience: "internal",
      category: "security",
      severity: ["S1", "S2"],
      version: "1.0.0",
      tokens_required: [
        "ACCESS_TYPE", "COMPROMISED_ACCOUNTS", "DATA_ACCESSED",
        "THREAT_ACTOR_INFO", "REMEDIATION_STEPS", "CURRENT_STATUS", "ETA"
      ],
      body: `Unauthorized Access Detected

Access Type: [ACCESS_TYPE]
Compromised Accounts: [COMPROMISED_ACCOUNTS]
Data Potentially Accessed: [DATA_ACCESSED]
Threat Actor Info: [THREAT_ACTOR_INFO]

Immediate Remediation:
[REMEDIATION_STEPS]

All affected accounts have been disabled. Password resets required.
MFA enforcement increased. Monitoring enhanced.

Status: [CURRENT_STATUS] | ETA: [ETA]`
    }
  ],

  // ========================================
  // THIRD-PARTY PACK
  // ========================================
  thirdParty: [
    {
      id: "vendor_outage",
      title: "Third-Party – Vendor Outage",
      audience: "internal",
      category: "third-party",
      severity: ["S1", "S2"],
      version: "1.0.0",
      tokens_required: [
        "VENDOR_NAME", "SERVICE_AFFECTED", "WORKAROUND",
        "VENDOR_ETA", "ALTERNATIVE_VENDOR", "IMPACT_SUMMARY", "NEXT_UPDATE_TIME"
      ],
      body: `Third-Party Service Disruption

Vendor: [VENDOR_NAME]
Affected Service: [SERVICE_AFFECTED]
Impact: [IMPACT_SUMMARY]

Workaround: [WORKAROUND]
Vendor ETA: [VENDOR_ETA]
Alternative: [ALTERNATIVE_VENDOR]

We are in direct contact with [VENDOR_NAME] and monitoring their status page.
Internal teams are implementing fallback procedures.

Next update: [NEXT_UPDATE_TIME]`
    },
    {
      id: "supply_chain_compromise",
      title: "Third-Party – Supply Chain Security",
      audience: "executive",
      category: "third-party",
      severity: ["S0", "S1"],
      version: "1.0.0",
      tokens_required: [
        "VENDOR_NAME", "VULNERABILITY_DESCRIPTION", "OUR_EXPOSURE",
        "MITIGATION_PLAN", "VENDOR_RESPONSE", "IC_NAME", "CONTACT"
      ],
      body: `Supply Chain Security Incident

Vendor: [VENDOR_NAME]
Issue: [VULNERABILITY_DESCRIPTION]
Our Exposure: [OUR_EXPOSURE]

Mitigation Plan:
[MITIGATION_PLAN]

Vendor Response: [VENDOR_RESPONSE]

Security team is conducting full impact assessment.
All vendor access under review. Contracts and SLAs being evaluated.

IC: [IC_NAME] | Legal: [CONTACT]`
    },
    {
      id: "vendor_data_breach",
      title: "Third-Party – Vendor Data Breach",
      audience: "executive",
      category: "third-party",
      severity: ["S0", "S1"],
      version: "1.0.0",
      tokens_required: [
        "VENDOR_NAME", "BREACH_DESCRIPTION", "OUR_DATA_AFFECTED",
        "CUSTOMER_IMPACT", "VENDOR_ACTIONS", "OUR_ACTIONS", "IC_NAME"
      ],
      body: `Vendor Data Breach Notification

Vendor: [VENDOR_NAME]
Breach: [BREACH_DESCRIPTION]
Our Data Affected: [OUR_DATA_AFFECTED]
Customer Impact: [CUSTOMER_IMPACT]

Vendor Actions: [VENDOR_ACTIONS]
Our Actions: [OUR_ACTIONS]

Legal and compliance teams are assessing notification requirements.
Customer communications plan being developed.

IC: [IC_NAME]`
    }
  ],

  // ========================================
  // POST-INCIDENT PACK
  // ========================================
  postIncident: [
    {
      id: "pir_template",
      title: "Post-Incident Review (PIR)",
      audience: "internal",
      category: "post-incident",
      severity: ["S0", "S1", "S2", "S3"],
      version: "1.0.0",
      tokens_required: [
        "INCIDENT_NAME", "START_TIME", "RESOLUTION_TIME",
        "ROOT_CAUSE", "TIMELINE", "IMPACT_FINAL",
        "LESSONS_LEARNED", "ACTION_ITEMS", "INCIDENT_ID", "SEVERITY", "IC_NAME"
      ],
      body: `POST-INCIDENT REVIEW: [INCIDENT_NAME]

Incident ID: [INCIDENT_ID]
Severity: [SEVERITY]
Timeline: [START_TIME] to [RESOLUTION_TIME]

ROOT CAUSE:
[ROOT_CAUSE]

DETAILED TIMELINE:
[TIMELINE]

FINAL IMPACT:
[IMPACT_FINAL]

WHAT WENT WELL:
- Rapid incident detection and declaration
- Clear communication channels established
- [Add specific positives]

WHAT WENT WRONG:
- [List issues and gaps]

LESSONS LEARNED:
[LESSONS_LEARNED]

ACTION ITEMS (with owners and due dates):
[ACTION_ITEMS]

IC: [IC_NAME] | PIR Date: [current date]`
    },
    {
      id: "lessons_learned_brief",
      title: "Lessons Learned – Executive Brief",
      audience: "executive",
      category: "post-incident",
      severity: ["S0", "S1"],
      version: "1.0.0",
      tokens_required: [
        "INCIDENT_NAME", "COST_IMPACT", "CUSTOMER_IMPACT",
        "KEY_LESSONS", "PREVENTION_INVESTMENTS", "INCIDENT_ID"
      ],
      body: `Lessons Learned: [INCIDENT_NAME]

Incident ID: [INCIDENT_ID]

Business Impact:
- Financial: [COST_IMPACT]
- Customer: [CUSTOMER_IMPACT]
- Reputation: [describe impact]

Key Lessons:
[KEY_LESSONS]

Recommended Investments for Prevention:
[PREVENTION_INVESTMENTS]

This brief is for leadership review. Full PIR available at [LINK].`
    },
    {
      id: "action_items_tracking",
      title: "Post-Incident – Action Items Tracking",
      audience: "internal",
      category: "post-incident",
      severity: ["S0", "S1", "S2", "S3"],
      version: "1.0.0",
      tokens_required: [
        "INCIDENT_ID", "INCIDENT_NAME", "ACTION_ITEMS", "OWNERS", "DUE_DATES"
      ],
      body: `Action Items Tracker: [INCIDENT_NAME] ([INCIDENT_ID])

Following our post-incident review, the following action items have been identified:

[ACTION_ITEMS]

Owners: [OWNERS]
Due Dates: [DUE_DATES]

Status updates will be tracked in [tracking system].
Weekly reviews scheduled until all items are complete.`
    }
  ],

  // ========================================
  // COMPLIANCE & REGULATORY PACK
  // ========================================
  compliance: [
    {
      id: "gdpr_breach_notification",
      title: "GDPR – Data Breach Notification",
      audience: "regulators",
      category: "compliance",
      severity: ["S0", "S1"],
      version: "1.0.0",
      jurisdiction: "EU",
      tokens_required: [
        "INCIDENT_NAME", "BREACH_DATE", "BREACH_DESCRIPTION",
        "DATA_CATEGORIES", "DATA_SUBJECTS_COUNT", "CONSEQUENCES",
        "MEASURES_TAKEN", "DPO_CONTACT", "INCIDENT_ID"
      ],
      body: `Data Breach Notification pursuant to GDPR Article 33

Controller: [COMPANY_NAME]
DPO Contact: [DPO_CONTACT]
Breach Reference: [INCIDENT_ID]

Nature of Breach:
Date/Time: [BREACH_DATE]
Description: [BREACH_DESCRIPTION]

Categories of Personal Data: [DATA_CATEGORIES]
Approximate number of data subjects: [DATA_SUBJECTS_COUNT]

Likely Consequences: [CONSEQUENCES]

Measures Taken: [MEASURES_TAKEN]

Communication to data subjects: [planned/not required because...]

This notification is made within 72 hours of breach awareness.
Further updates will be provided as investigation continues.`
    },
    {
      id: "sec_material_incident",
      title: "SEC – Material Cybersecurity Incident",
      audience: "regulators",
      category: "compliance",
      severity: ["S0"],
      version: "1.0.0",
      jurisdiction: "SEC",
      tokens_required: [
        "INCIDENT_NAME", "DISCOVERY_DATE", "INCIDENT_NATURE",
        "MATERIALITY_ASSESSMENT", "BUSINESS_OPERATIONS_IMPACT",
        "REMEDIATION_STATUS"
      ],
      body: `Form 8-K Item 1.05 – Material Cybersecurity Incident

Incident Overview:
Discovery Date: [DISCOVERY_DATE]
Nature: [INCIDENT_NATURE]

Materiality Assessment:
[MATERIALITY_ASSESSMENT]

Impact on Business Operations:
[BUSINESS_OPERATIONS_IMPACT]

Current Status and Remediation:
[REMEDIATION_STATUS]

The Company will continue to assess the incident and provide updates as material information becomes available.

This disclosure is made pursuant to SEC cybersecurity disclosure rules.`
    },
    {
      id: "ccpa_notice",
      title: "CCPA – Consumer Notification",
      audience: "customers",
      category: "compliance",
      severity: ["S0", "S1"],
      version: "1.0.0",
      jurisdiction: "US",
      tokens_required: [
        "INCIDENT_NAME", "BREACH_DATE", "PERSONAL_INFO_TYPES",
        "CONSUMER_ACTIONS", "CONTACT_INFO", "INCIDENT_ID"
      ],
      body: `Notice of Data Security Incident

Reference: [INCIDENT_ID]

We are writing to inform you of a data security incident that may have affected your personal information.

What Happened: [INCIDENT_NAME] occurred on [BREACH_DATE]

What Information Was Involved: [PERSONAL_INFO_TYPES]

What We Are Doing: We have taken immediate steps to secure our systems and are conducting a thorough investigation.

What You Can Do: [CONSUMER_ACTIONS]

For More Information: Please contact us at [CONTACT_INFO]

We take the security of your personal information seriously and sincerely apologize for any inconvenience.`
    }
  ],

  // ========================================
  // OPERATIONAL PACK
  // ========================================
  operational: [
    {
      id: "infrastructure_outage",
      title: "Operational – Infrastructure Outage",
      audience: "internal",
      category: "operational",
      severity: ["S1", "S2"],
      version: "1.0.0",
      tokens_required: [
        "INFRASTRUCTURE_COMPONENT", "OUTAGE_CAUSE", "AFFECTED_SERVICES",
        "FAILOVER_STATUS", "RESTORATION_PLAN", "ETA", "IC_NAME"
      ],
      body: `Infrastructure Outage

Component: [INFRASTRUCTURE_COMPONENT]
Cause: [OUTAGE_CAUSE]
Affected Services: [AFFECTED_SERVICES]

Failover Status: [FAILOVER_STATUS]

Restoration Plan:
[RESTORATION_PLAN]

SRE team engaged. Monitoring dashboards: [links]
ETA for full restoration: [ETA]

War Room: #infra-incident | IC: [IC_NAME]`
    },
    {
      id: "deployment_rollback",
      title: "Operational – Failed Deployment",
      audience: "internal",
      category: "operational",
      severity: ["S2", "S3"],
      version: "1.0.0",
      tokens_required: [
        "DEPLOYMENT_VERSION", "FAILURE_SYMPTOMS", "ROLLBACK_STATUS",
        "DEPLOYMENT_GATE_FAILURE", "CURRENT_STATUS", "NEXT_UPDATE_TIME"
      ],
      body: `Deployment Incident – Rollback Initiated

Version: [DEPLOYMENT_VERSION]
Symptoms: [FAILURE_SYMPTOMS]

Rollback Status: [ROLLBACK_STATUS]

Root Cause (preliminary): [DEPLOYMENT_GATE_FAILURE]

Post-mortem will review deployment pipeline and testing coverage.
Change freeze enacted until investigation complete.

Status: [CURRENT_STATUS] | Next update: [NEXT_UPDATE_TIME]`
    },
    {
      id: "database_performance",
      title: "Operational – Database Performance Issue",
      audience: "internal",
      category: "operational",
      severity: ["S2", "S3"],
      version: "1.0.0",
      tokens_required: [
        "DATABASE_NAME", "PERFORMANCE_ISSUE", "IMPACT_SUMMARY",
        "MITIGATION_ACTIONS", "ROOT_CAUSE_STATUS", "ETA"
      ],
      body: `Database Performance Degradation

Database: [DATABASE_NAME]
Issue: [PERFORMANCE_ISSUE]
Impact: [IMPACT_SUMMARY]

Mitigation Actions:
[MITIGATION_ACTIONS]

Root Cause Investigation: [ROOT_CAUSE_STATUS]

Query optimization in progress. Monitoring query execution times.
ETA for resolution: [ETA]`
    }
  ]
};

// Helper function to load all packs at once
window.BITA_TEMPLATES_EXTENDED.loadAllPacks = function() {
  const allTemplates = [
    ...this.security,
    ...this.thirdParty,
    ...this.postIncident,
    ...this.compliance,
    ...this.operational
  ];
  
  const existingIds = new Set(window.BITA_TEMPLATES.communications.map(t => t.id));
  const newTemplates = allTemplates.filter(t => !existingIds.has(t.id));
  
  window.BITA_TEMPLATES.communications.push(...newTemplates);
  
  return newTemplates.length;
};

console.log("Extended templates loaded:", {
  security: window.BITA_TEMPLATES_EXTENDED.security.length,
  thirdParty: window.BITA_TEMPLATES_EXTENDED.thirdParty.length,
  postIncident: window.BITA_TEMPLATES_EXTENDED.postIncident.length,
  compliance: window.BITA_TEMPLATES_EXTENDED.compliance.length,
  operational: window.BITA_TEMPLATES_EXTENDED.operational.length
});