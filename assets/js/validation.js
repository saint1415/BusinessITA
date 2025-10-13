// validation.js - Field Validation System
const VALIDATION_RULES = {
  incidentId: {
    required: true,
    pattern: /^\d{6}_\d{2}(\.\d{2})?$/,
    message: "Must be YYYYMM_NN or YYYYMM_NN.RR format"
  },
  incidentName: {
    required: true,
    minLength: 5,
    maxLength: 100,
    message: "Name must be 5-100 characters"
  },
  incidentSeverity: {
    required: true,
    message: "Severity is required"
  },
  startTime: {
    required: true,
    message: "Start time is required"
  },
  impactSummary: {
    required: true,
    minLength: 20,
    maxLength: 500,
    message: "Impact summary must be 20-500 characters"
  },
  icName: {
    required: true,
    minLength: 2,
    message: "IC name is required"
  },
  contact: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Valid email required"
  },
  currentStatus: {
    required: true,
    message: "Current status is required"
  },
  jurisdiction: {
    required: true,
    message: "Jurisdiction is required"
  },
  dollarImpactPerHour: {
    min: 0,
    pattern: /^\d*$/,
    message: "Must be a positive number"
  },
  linkStatusPage: {
    pattern: /^https?:\/\/.+/,
    message: "Must be a valid URL"
  }
};

function validateField(fieldId, value) {
  const rules = VALIDATION_RULES[fieldId];
  if (!rules) return { valid: true };

  const errors = [];

  // Check required fields
  if (rules.required && (!value || value.trim() === '')) {
    errors.push(rules.message || "This field is required");
    return { valid: false, errors };
  }

  // Only validate format if field has a value
  if (value && value.trim() !== '') {
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(`Minimum ${rules.minLength} characters required`);
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(`Maximum ${rules.maxLength} characters allowed`);
    }
    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push(rules.message || "Invalid format");
    }
    if (rules.min !== undefined && value !== '') {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < rules.min) {
        errors.push(`Must be at least ${rules.min}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function validateAllFields() {
  const errors = {};
  let isValid = true;

  Object.keys(VALIDATION_RULES).forEach(fieldId => {
    const el = document.getElementById(fieldId);
    if (!el) return;

    const result = validateField(fieldId, el.value);
    if (!result.valid) {
      errors[fieldId] = result.errors;
      isValid = false;
      
      // Show error in UI
      const errorEl = document.getElementById(`${fieldId}-error`);
      if (errorEl) {
        errorEl.textContent = result.errors[0];
        errorEl.style.display = 'block';
      }
      el.classList.add('error');
    } else {
      // Clear error
      const errorEl = document.getElementById(`${fieldId}-error`);
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
      }
      el.classList.remove('error');
    }
  });

  return { isValid, errors };
}

function showValidationSummary(errors) {
  const summary = document.getElementById('validationSummary');
  if (!summary) return;

  if (Object.keys(errors).length === 0) {
    summary.style.display = 'none';
    return;
  }

  const errorList = Object.entries(errors)
    .map(([field, errs]) => `<li><strong>${field}:</strong> ${errs.join(', ')}</li>`)
    .join('');

  summary.innerHTML = `
    <h4>⚠️ Please fix these errors:</h4>
    <ul>${errorList}</ul>
  `;
  summary.style.display = 'block';
}

function clearValidationSummary() {
  const summary = document.getElementById('validationSummary');
  if (summary) {
    summary.style.display = 'none';
    summary.innerHTML = '';
  }
}

function attachValidationListeners() {
  Object.keys(VALIDATION_RULES).forEach(fieldId => {
    const el = document.getElementById(fieldId);
    if (!el) return;

    // Validate on blur
    el.addEventListener('blur', () => {
      const result = validateField(fieldId, el.value);
      const errorEl = document.getElementById(`${fieldId}-error`);
      
      if (!result.valid && errorEl) {
        errorEl.textContent = result.errors[0];
        errorEl.style.display = 'block';
        el.classList.add('error');
      } else if (errorEl) {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
        el.classList.remove('error');
      }
    });

    // Clear error on input (when user starts typing)
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) {
        const result = validateField(fieldId, el.value);
        if (result.valid) {
          const errorEl = document.getElementById(`${fieldId}-error`);
          if (errorEl) {
            errorEl.textContent = '';
            errorEl.style.display = 'none';
          }
          el.classList.remove('error');
        }
      }
    });

    // Real-time character count for text areas
    if (el.tagName === 'TEXTAREA') {
      const countEl = document.getElementById(`${fieldId}-count`);
      if (countEl) {
        // Initialize counter
        countEl.textContent = el.value.length;
        
        el.addEventListener('input', () => {
          countEl.textContent = el.value.length;
          const rules = VALIDATION_RULES[fieldId];
          if (rules.maxLength) {
            if (el.value.length > rules.maxLength) {
              countEl.style.color = 'var(--danger)';
              countEl.style.fontWeight = 'bold';
            } else if (el.value.length > rules.maxLength * 0.9) {
              countEl.style.color = 'var(--warning)';
              countEl.style.fontWeight = 'normal';
            } else {
              countEl.style.color = '';
              countEl.style.fontWeight = 'normal';
            }
          }
        });
      }
    }
  });
}

// Validate before form actions
function validateBeforeAction(action) {
  const validation = validateAllFields();
  
  if (!validation.isValid) {
    showValidationSummary(validation.errors);
    
    // Scroll to first error
    const firstErrorField = Object.keys(validation.errors)[0];
    const firstErrorEl = document.getElementById(firstErrorField);
    if (firstErrorEl) {
      firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstErrorEl.focus();
    }
    
    // Show toast notification
    if (window.BITA_SETTINGS?.showToast) {
      window.BITA_SETTINGS.showToast(
        `Please fix ${Object.keys(validation.errors).length} validation error(s)`,
        'error'
      );
    }
    
    return false;
  }
  
  clearValidationSummary();
  return true;
}

// Attach to Generate Communications button
function attachGenerateValidation() {
  const generateBtn = document.getElementById('generateComms');
  if (!generateBtn) return;

  generateBtn.addEventListener('click', (e) => {
    // Only validate if we're going to generate
    const selectedAud = Array.from(
      document.getElementById('audienceSelect')?.selectedOptions || []
    ).map(o => o.value);
    
    if (selectedAud.length === 0) {
      e.preventDefault();
      if (window.BITA_SETTINGS?.showToast) {
        window.BITA_SETTINGS.showToast('Please select at least one audience', 'warning');
      }
      return;
    }

    // Validate required fields before generating
    const requiredFields = [
      'incidentId', 'incidentName', 'incidentSeverity', 
      'startTime', 'impactSummary', 'icName', 'contact', 'currentStatus'
    ];
    
    const hasErrors = requiredFields.some(fieldId => {
      const el = document.getElementById(fieldId);
      if (!el) return false;
      const result = validateField(fieldId, el.value);
      return !result.valid;
    });

    if (hasErrors) {
      e.preventDefault();
      validateAllFields();
      showValidationSummary(
        Object.fromEntries(
          requiredFields
            .map(id => [id, validateField(id, document.getElementById(id)?.value)])
            .filter(([_, result]) => !result.valid)
            .map(([id, result]) => [id, result.errors])
        )
      );
      
      if (window.BITA_SETTINGS?.showToast) {
        window.BITA_SETTINGS.showToast(
          'Please complete required fields before generating communications',
          'error'
        );
      }
    }
  });
}

// Export validation state
function getValidationState() {
  const state = {};
  Object.keys(VALIDATION_RULES).forEach(fieldId => {
    const el = document.getElementById(fieldId);
    if (el) {
      state[fieldId] = validateField(fieldId, el.value);
    }
  });
  return state;
}

// Check if form is valid
function isFormValid() {
  const validation = validateAllFields();
  return validation.isValid;
}

// Initialize validation system
function initValidation() {
  attachValidationListeners();
  attachGenerateValidation();
  
  // Initialize character counters
  Object.keys(VALIDATION_RULES).forEach(fieldId => {
    const el = document.getElementById(fieldId);
    if (el && el.tagName === 'TEXTAREA') {
      const countEl = document.getElementById(`${fieldId}-count`);
      if (countEl) {
        countEl.textContent = el.value.length;
      }
    }
  });
}

// Global API
window.BITA_VALIDATION = {
  validateField,
  validateAllFields,
  showValidationSummary,
  clearValidationSummary,
  attachValidationListeners,
  validateBeforeAction,
  getValidationState,
  isFormValid,
  VALIDATION_RULES
};

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initValidation();
});