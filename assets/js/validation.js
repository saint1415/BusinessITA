// validation.js - Field Validation
class BITA_Validation {
    constructor() {
        this.rules = {
            incidentId: {
                pattern: BITA_CONFIG.incidentIdPattern || /^[A-Z]{2,5}-\d{4,8}$/,
                message: 'Invalid Incident ID format. Expected: XXX-XXXX'
            },
            title: {
                maxLength: BITA_CONFIG.maxTitleLength || 100,
                message: `Title exceeds maximum length of ${BITA_CONFIG.maxTitleLength || 100} characters`
            },
            description: {
                maxLength: BITA_CONFIG.maxDescriptionLength || 5000,
                message: `Description exceeds maximum length of ${BITA_CONFIG.maxDescriptionLength || 5000} characters`
            }
        };
    }
    
    // Validate field
    validateField(fieldName, value) {
        const rule = this.rules[fieldName];
        if (!rule) return { valid: true };
        
        // Pattern validation
        if (rule.pattern && value && !rule.pattern.test(value)) {
            return { valid: false, message: rule.message };
        }
        
        // Max length validation
        if (rule.maxLength && value && value.length > rule.maxLength) {
            return { valid: false, message: rule.message };
        }
        
        return { valid: true };
    }
    
    // Validate all fields
    validateAll(data) {
        const results = {};
        let allValid = true;
        
        for (const [fieldName, value] of Object.entries(data)) {
            const result = this.validateField(fieldName, value);
            results[fieldName] = result;
            if (!result.valid) {
                allValid = false;
            }
        }
        
        return {
            valid: allValid,
            fields: results
        };
    }
    
    // Validate incident data
    validateIncidentData(data) {
        return this.validateAll(data);
    }
}