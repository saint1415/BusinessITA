// templates_extended.js - Extended Templates
class BITA_Templates_Extended {
    constructor() {
        this.templates = {};
    }
    
    // Load extended templates
    loadTemplates() {
        this.templates = {
            // Security Incident Template
            'security-incident': {
                id: 'security-incident',
                title: 'Security Incident',
                description: 'Template for security incidents',
                type: 'security',
                severity: 'critical',
                body: `<!-- META: {"type": "security", "severity": "critical"} -->
# Security Incident - {{incident_id}}

## Summary
At {{time}} UTC, we detected a potential security incident affecting {{service_name}}. Our security team is actively investigating.

## Impact Assessment
- Services affected: {{affected_services}}
- Data potentially compromised: {{data_impact}}
- Regions affected: {{regions_affected}}

## Current Status
{{current_status}}

## Containment Actions
{{containment_actions}}

## Next Updates
We will provide updates every {{update_frequency}} minutes or sooner if there are significant developments.

## Contact
For urgent inquiries, contact {{contact_info}}`,
                communications: {
                    internal: `INTERNAL SECURITY NOTIFICATION

INCIDENT ID: {{incident_id}}
SERVICE: {{service_name}}
TIME: {{time}} UTC
STATUS: {{current_status}}

This is a security incident. Please follow security protocols and monitor the incident channel for updates.`,
                    customer: `CUSTOMER SECURITY NOTIFICATION

Dear Valued Customer,

We are currently investigating a potential security incident that may affect {{service_name}}. We take security very seriously and are working diligently to assess and address the situation.

At this time, we have no evidence of customer data being compromised. We will provide updates as more information becomes available.

What We're Doing:
- Investigating the incident
- Implementing additional security measures
- Working with security experts

We will continue to monitor the situation closely and will notify you immediately if any customer data is affected.

Thank you for your patience and understanding.`
                }
            },
            
            // Data Breach Template
            'data-breach': {
                id: 'data-breach',
                title: 'Data Breach',
                description: 'Template for data breach incidents',
                type: 'security',
                severity: 'critical',
                body: `<!-- META: {"type": "security", "severity": "critical"} -->
# Data Breach - {{incident_id}}

## Summary
At {{time}} UTC, we confirmed a data breach affecting {{service_name}}. Our security team is actively working to contain the breach.

## Impact Assessment
- Services affected: {{affected_services}}
- Data compromised: {{data_compromised}}
- Number of affected accounts: {{affected_accounts}}
- Regions affected: {{regions_affected}}

## Containment Actions
{{containment_actions}}

## Remediation Steps
{{remediation_steps}}

## Next Updates
We will provide updates every {{update_frequency}} minutes or sooner if there are significant developments.

## Contact
For urgent inquiries, contact {{contact_info}}`,
                communications: {
                    internal: `INTERNAL DATA BREACH NOTIFICATION

CRITICAL INCIDENT ID: {{incident_id}}
SERVICE: {{service_name}}
TIME: {{time}} UTC
STATUS: {{current_status}}

This is a confirmed data breach. Follow security protocols immediately and monitor the incident channel for updates.`,
                    customer: `CONFIRMED DATA BREACH NOTIFICATION

Dear Valued Customer,

We are writing to inform you of a confirmed data breach that occurred on {{date}} affecting {{service_name}}.

What Happened:
{{breach_details}}

What Information Was Involved:
{{data_compromised}}

What We're Doing:
- Containing the breach
- Investigating the full scope
- Implementing additional security measures
- Notifying law enforcement as required

What You Can Do:
{{customer_recommendations}}

We deeply regret any inconvenience this may cause and are committed to protecting your information. We have enhanced our security measures to prevent future incidents.

For questions, contact {{contact_info}}`
                }
            }
        };
        
        return this.templates;
    }
    
    // Get extended template by ID
    getTemplate(id) {
        return this.templates[id] || null;
    }
    
    // Get all extended templates
    getTemplates() {
        return {...this.templates};
    }
}