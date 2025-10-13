// linter.js - Template Validation
class BITA_Linter {
    constructor() {
        this.rules = {
            requiredFields: ['title', 'description', 'severity', 'type'],
            validTypes: ['outage', 'degradation', 'maintenance', 'security'],
            validSeverities: ['critical', 'high', 'medium', 'low']
        };
    }
    
    // Validate template
    validateTemplate(template) {
        const errors = [];
        
        // Check required fields
        for (const field of this.rules.requiredFields) {
            if (!template[field] || template[field].trim() === '') {
                errors.push(`Missing required field: ${field}`);
            }
        }
        
        // Validate type
        if (template.type && !this.rules.validTypes.includes(template.type)) {
            errors.push(`Invalid type: ${template.type}. Valid types: ${this.rules.validTypes.join(', ')}`);
        }
        
        // Validate severity
        if (template.severity && !this.rules.validSeverities.includes(template.severity)) {
            errors.push(`Invalid severity: ${template.severity}. Valid severities: ${this.rules.validSeverities.join(', ')}`);
        }
        
        // Validate title length
        if (template.title && template.title.length > BITA_CONFIG.maxTitleLength) {
            errors.push(`Title exceeds maximum length of ${BITA_CONFIG.maxTitleLength} characters`);
        }
        
        // Validate description length
        if (template.description && template.description.length > BITA_CONFIG.maxDescriptionLength) {
            errors.push(`Description exceeds maximum length of ${BITA_CONFIG.maxDescriptionLength} characters`);
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    }
    
    // Validate all templates
    validateAllTemplates(templates) {
        const results = [];
        
        for (const [id, template] of Object.entries(templates)) {
            const result = this.validateTemplate(template);
            results.push({
                id: id,
                ...result
            });
        }
        
        return results;
    }
}