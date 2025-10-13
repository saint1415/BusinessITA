// settings.js - Complete Settings Modal Implementation

function initSettingsModal() {
  const modal = document.getElementById('settingsModal');
  const openBtn = document.getElementById('openSettings');
  const closeBtn = document.getElementById('closeSettings');
  const saveBtn = document.getElementById('saveSettings');
  const resetBtn = document.getElementById('resetSettings');
  const idFormatSelect = document.getElementById('id-format');
  const customIdField = document.getElementById('custom-id-format-field');

  // Open modal
  openBtn?.addEventListener('click', () => {
    loadSettingsIntoForm();
    modal.style.display = 'flex';
  });

  // Close modal
  closeBtn?.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Close on background click
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Show/hide custom ID format field
  idFormatSelect?.addEventListener('change', () => {
    if (customIdField) {
      customIdField.style.display = 
        idFormatSelect.value === 'custom' ? 'block' : 'none';
    }
  });

  // Save settings
  saveBtn?.addEventListener('click', () => {
    saveSettingsFromForm();
    modal.style.display = 'none';
    showToast('Settings saved successfully', 'success');
  });

  // Reset to defaults
  resetBtn?.addEventListener('click', () => {
    if (confirm('Reset all settings to defaults? This cannot be undone.')) {
      window.BITA_CONFIG.reset();
      loadSettingsIntoForm();
      showToast('Settings reset to defaults', 'info');
    }
  });
}

function loadSettingsIntoForm() {
  const config = window.BITA_CONFIG.config;

  // SLA settings
  document.getElementById('sla-S0').value = config.slas.S0;
  document.getElementById('sla-S1').value = config.slas.S1;
  document.getElementById('sla-S2').value = config.slas.S2;
  document.getElementById('sla-S3').value = config.slas.S3;

  // Jurisdiction settings
  document.getElementById('gdpr-enabled').checked = config.jurisdictions.gdpr.enabled;
  document.getElementById('gdpr-notification').value = config.jurisdictions.gdpr.notificationWindowHours;
  document.getElementById('sec-enabled').checked = config.jurisdictions.sec.enabled;
  document.getElementById('sec-notification').value = config.jurisdictions.sec.notificationWindowDays;

  // Field constraints
  document.getElementById('impact-min-length').value = config.fields.impactSummary.minLength;
  document.getElementById('impact-max-length').value = config.fields.impactSummary.maxLength;
  document.getElementById('id-format').value = config.fields.incidentId.format;
  
  if (config.fields.incidentId.customRegex) {
    document.getElementById('custom-id-regex').value = config.fields.incidentId.customRegex;
    document.getElementById('custom-id-format-field').style.display = 'block';
  }

  // Communication settings
  document.getElementById('require-approval').checked = config.communications.requireApproval;
  document.getElementById('tone-preference').value = config.communications.defaultTone;
}

function saveSettingsFromForm() {
  const config = window.BITA_CONFIG;

  // SLA settings
  config.set('slas.S0', parseInt(document.getElementById('sla-S0').value));
  config.set('slas.S1', parseInt(document.getElementById('sla-S1').value));
  config.set('slas.S2', parseInt(document.getElementById('sla-S2').value));
  config.set('slas.S3', parseInt(document.getElementById('sla-S3').value));

  // Jurisdiction settings
  config.set('jurisdictions.gdpr.enabled', document.getElementById('gdpr-enabled').checked);
  config.set('jurisdictions.gdpr.notificationWindowHours', 
    parseInt(document.getElementById('gdpr-notification').value));
  config.set('jurisdictions.sec.enabled', document.getElementById('sec-enabled').checked);
  config.set('jurisdictions.sec.notificationWindowDays', 
    parseInt(document.getElementById('sec-notification').value));

  // Field constraints
  config.set('fields.impactSummary.minLength', 
    parseInt(document.getElementById('impact-min-length').value));
  config.set('fields.impactSummary.maxLength', 
    parseInt(document.getElementById('impact-max-length').value));
  config.set('fields.incidentId.format', document.getElementById('id-format').value);
  
  if (document.getElementById('id-format').value === 'custom') {
    config.set('fields.incidentId.customRegex', 
      document.getElementById('custom-id-regex').value);
  }

  // Communication settings
  config.set('communications.requireApproval', 
    document.getElementById('require-approval').checked);
  config.set('communications.defaultTone', 
    document.getElementById('tone-preference').value);

  // Update validation rules based on new settings
  updateValidationRules();
}

function updateValidationRules() {
  const config = window.BITA_CONFIG.config;
  
  // Update VALIDATION_RULES if validation.js is loaded
  if (window.BITA_VALIDATION) {
    window.VALIDATION_RULES.impactSummary.minLength = config.fields.impactSummary.minLength;
    window.VALIDATION_RULES.impactSummary.maxLength = config.fields.impactSummary.maxLength;
    
    // Update incident ID pattern based on format
    if (config.fields.incidentId.format === 'custom' && config.fields.incidentId.customRegex) {
      try {
        window.VALIDATION_RULES.incidentId.pattern = new RegExp(config.fields.incidentId.customRegex);
      } catch (e) {
        console.error('Invalid custom regex:', e);
      }
    } else if (config.fields.incidentId.format === 'YYYY-MM-NN') {
      window.VALIDATION_RULES.incidentId.pattern = /^\d{4}-\d{2}-\d{2}$/;
    }
  }
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  container.appendChild(toast);

  // Animate in
  setTimeout(() => toast.classList.add('show'), 10);

  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initSettingsModal);

window.BITA_SETTINGS = {
  loadSettingsIntoForm,
  saveSettingsFromForm,
  updateValidationRules,
  showToast
};
