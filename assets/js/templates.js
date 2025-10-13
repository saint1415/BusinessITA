// templates.js - Core Templates
class BITA_Templates {
    constructor() {
        this.templates = {};
        this.currentPack = 'core';
    }
    
    // Load all templates
    loadTemplates() {
        // Core templates
        this.templates = {
            // Service Outage Template
            'service-outage': {
                id: 'service-outage',
                title: 'Service Outage',
                description: 'Template for service outage incidents',
                type: 'outage',
                severity: 'high',
                body: `<!-- META: {"type": "outage", "severity": "high"} -->
# Service Outage - {{incident_id}}

## Summary
At {{time}} UTC, we experienced an outage affecting {{service_name}}. Our engineering team is actively working to resolve the issue.

## Impact
- Services affected: {{affected_services}}
- Estimated customer impact: {{customer_impact}}
- Regions affected: {{regions_affected}}

## Current Status
{{current_status}}

## Next Updates
We will provide updates every {{update_frequency}} minutes or sooner if there are significant developments.

## Contact
For urgent inquiries, contact {{contact_info}}`,
                communications: {
                    internal: `INTERNAL COMMUNICATION - SERVICE OUTAGE

Incident ID: {{incident_id}}
Service: {{service_name}}
Time: {{time}} UTC
Status: {{current_status}}

Please monitor the incident channel for updates.`,
                    customer: `CUSTOMER COMMUNICATION - SERVICE OUTAGE

Dear Valued Customer,

We are currently experiencing an outage with {{service_name}}. Our team is working diligently to resolve this issue as quickly as possible.

Impact: {{customer_impact_description}}
Estimated Resolution: {{estimated_resolution}}

We apologize for any inconvenience this may cause and will provide updates as they become available.

Thank you for your patience.`
                }
            },
            
            // Performance Degradation Template
            'performance-degradation': {
                id: 'performance-degradation',
                title: 'Performance Degradation',
                description: 'Template for performance degradation incidents',
                type: 'degradation',
                severity: 'medium',
                body: `<!-- META: {"type": "degradation", "severity": "medium"} -->
# Performance Degradation - {{incident_id}}

## Summary
At {{time}} UTC, we observed degraded performance for {{service_name}}. Our engineering team is investigating the issue.

## Impact
- Services affected: {{affected_services}}
- Performance metrics: {{performance_metrics}}
- Regions affected: {{regions_affected}}

## Current Status
{{current_status}}

## Next Updates
We will provide updates every {{update_frequency}} minutes or sooner if there are significant developments.

## Contact
For urgent inquiries, contact {{contact_info}}`,
                communications: {
                    internal: `INTERNAL COMMUNICATION - PERFORMANCE DEGRADATION

Incident ID: {{incident_id}}
Service: {{service_name}}
Time: {{time}} UTC
Status: {{current_status}}

Please monitor the incident channel for updates.`,
                    customer: `CUSTOMER COMMUNICATION - PERFORMANCE DEGRADATION

Dear Valued Customer,

We are currently experiencing degraded performance with {{service_name}}. Our team is working to identify and resolve the issue as quickly as possible.

Impact: {{customer_impact_description}}
Current Status: {{current_status}}

We apologize for any inconvenience this may cause and will provide updates as they become available.

Thank you for your patience.`
                }
            },
            
            // Scheduled Maintenance Template
            'scheduled-maintenance': {
                id: 'scheduled-maintenance',
                title: 'Scheduled Maintenance',
                description: 'Template for scheduled maintenance events',
                type: 'maintenance',
                severity: 'low',
                body: `<!-- META: {"type": "maintenance", "severity": "low"} -->
# Scheduled Maintenance - {{incident_id}}

## Summary
At {{start_time}} UTC, we will perform scheduled maintenance on {{service_name}}. This maintenance is expected to complete by {{end_time}} UTC.

## Impact
- Services affected: {{affected_services}}
- Expected downtime: {{expected_downtime}}
- Regions affected: {{regions_affected}}

## Maintenance Details
{{maintenance_details}}

## Contact
For urgent inquiries, contact {{contact_info}}`,
                communications: {
                    pre_maintenance: `PRE-MAINTENANCE NOTIFICATION

Dear Valued Customer,

This is a notification that we will be performing scheduled maintenance on {{service_name}}.

Maintenance Window: {{start_time}} - {{end_time}} UTC
Services Affected: {{affected_services}}
Expected Impact: {{expected_impact}}

We recommend planning accordingly during this maintenance window.

Thank you for your understanding.`,
                    post_maintenance: `POST-MAINTENANCE NOTIFICATION

Dear Valued Customer,

The scheduled maintenance on {{service_name}} has been completed successfully at {{end_time}} UTC.

Services are now operating normally. No further action is required on your part.

We apologize for any inconvenience this may have caused and thank you for your patience.

Best regards,
{{company_name}} Team`
                }
            }
        };
        
        return this.templates;
    }
    
    // Get template by ID
    getTemplate(id) {
        return this.templates[id] || null;
    }
    
    // Get all templates
    getTemplates() {
        return {...this.templates};
    }
    
    // Get templates by type
    getTemplatesByType(type) {
        const filtered = {};
        for (const [id, template] of Object.entries(this.templates)) {
            if (template.type === type) {
                filtered[id] = template;
            }
        }
        return filtered;
    }
    
    // Add custom template
    addTemplate(id, template) {
        this.templates[id] = template;
    }
    
    // Remove template
    removeTemplate(id) {
        delete this.templates[id];
    }
}