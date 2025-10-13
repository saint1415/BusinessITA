// config.js - Configurable System Settings
const DEFAULT_CONFIG = {
  version: "0.3.0",
  
  // Severity SLAs (minutes)
  slas: {
    S0: 15,
    S1: 30,
    S2: 60,
    S3: 120
  },
  
  // Field constraints
  fields: {
    incidentId: {
      format: "YYYYMM_NN",
      customRegex: null,
      autoGenerate: true
    },
    impactSummary: {
      minLength: 20,
      maxLength: 500
    },
    incidentName: {
      minLength: 5,
      maxLength: 100
    }
  },
  
  // Jurisdiction requirements
  jurisdictions: {
    gdpr: {
      enabled: true,
      notificationWindowHours: 72,
      requiresDataProtectionOfficer: true
    },
    ccpa: {
      enabled: false,
      notificationWindowDays: 0
    },
    sec: {
      enabled: false,
      notificationWindowDays: 4,
      materialityThreshold: 100000
    }
  },
  
  // Communication settings
  communications: {
    requireApproval: false,
    defaultTone: "professional",
    autoSave: true,
    autoSaveIntervalMs: 30000
  },
  
  // UI preferences
  ui: {
    theme: "auto",
    compactMode: false,
    showTemplatePreview: true
  },
  
  // Notification settings
  notifications: {
    emailEnabled: false,
    slackEnabled: false,
    webhookUrl: null
  }
};

class ConfigManager {
  constructor() {
    this.config = this.loadConfig();
    this.listeners = [];
  }
  
  loadConfig() {
    const stored = localStorage.getItem('bita_config');
    if (stored) {
      try {
        return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
      } catch (e) {
        console.error("Failed to load config", e);
      }
    }
    return { ...DEFAULT_CONFIG };
  }
  
  saveConfig() {
    localStorage.setItem('bita_config', JSON.stringify(this.config));
    this.notifyListeners();
  }
  
  get(path) {
    const parts = path.split('.');
    let value = this.config;
    for (const part of parts) {
      value = value?.[part];
      if (value === undefined) break;
    }
    return value;
  }
  
  set(path, value) {
    const parts = path.split('.');
    let obj = this.config;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!obj[parts[i]]) obj[parts[i]] = {};
      obj = obj[parts[i]];
    }
    obj[parts[parts.length - 1]] = value;
    this.saveConfig();
  }
  
  reset() {
    this.config = { ...DEFAULT_CONFIG };
    this.saveConfig();
  }
  
  onChange(callback) {
    this.listeners.push(callback);
  }
  
  notifyListeners() {
    this.listeners.forEach(cb => cb(this.config));
  }
  
  // Export config as JSON
  export() {
    return JSON.stringify(this.config, null, 2);
  }
  
  // Import config from JSON
  import(jsonString) {
    try {
      const imported = JSON.parse(jsonString);
      this.config = { ...DEFAULT_CONFIG, ...imported };
      this.saveConfig();
      return true;
    } catch (e) {
      console.error("Failed to import config", e);
      return false;
    }
  }
}

// Initialize global config manager
window.BITA_CONFIG = new ConfigManager();

// Apply SLA hints based on severity
function updateSeverityHints() {
  const severityEl = document.getElementById('incidentSeverity');
  const hintEl = document.getElementById('severityHint');
  
  if (!severityEl || !hintEl) return;
  
  const updateHint = () => {
    const sev = severityEl.value;
    const config = window.BITA_CONFIG.config;
    if (sev && config.slas[sev]) {
      hintEl.textContent = `Update frequency: every ${config.slas[sev]} minutes`;
    } else {
      hintEl.textContent = '';
    }
  };
  
  severityEl.addEventListener('change', updateHint);
  updateHint(); // Initial update
}

// Apply jurisdiction hints
function updateJurisdictionHints() {
  const jurisdictionEl = document.getElementById('jurisdiction');
  const hintEl = document.getElementById('jurisdictionHint');
  
  if (!jurisdictionEl || !hintEl) return;
  
  const updateHint = () => {
    const jur = jurisdictionEl.value;
    const config = window.BITA_CONFIG.config;
    
    const hints = {
      'EU': config.jurisdictions.gdpr.enabled ? 
        `GDPR: ${config.jurisdictions.gdpr.notificationWindowHours}h notification window` : '',
      'SEC': config.jurisdictions.sec.enabled ? 
        `SEC: ${config.jurisdictions.sec.notificationWindowDays} day disclosure window` : '',
      'US': 'US: CCPA may apply for California residents',
      'global': 'No specific regulatory requirements'
    };
    
    hintEl.textContent = hints[jur] || '';
  };
  
  jurisdictionEl.addEventListener('change', updateHint);
  updateHint(); // Initial update
}

// Auto-save functionality
function initAutoSave() {
  const config = window.BITA_CONFIG.config;
  
  if (!config.communications.autoSave) return;
  
  let autoSaveTimer;
  const interval = config.communications.autoSaveIntervalMs || 30000;
  
  const performAutoSave = () => {
    if (window.BITA_STORE.incident.incident_id) {
      // Save to history
      if (window.BITA_HISTORY) {
        window.BITA_HISTORY.save(window.BITA_STORE.incident);
      }
      
      // Show subtle notification
      const statusEl = document.getElementById('validationStatus');
      if (statusEl) {
        const oldText = statusEl.textContent;
        statusEl.textContent = 'Auto-saved';
        setTimeout(() => {
          statusEl.textContent = oldText;
        }, 2000);
      }
    }
  };
  
  // Start auto-save timer
  autoSaveTimer = setInterval(performAutoSave, interval);
  
  // Save when user leaves page
  window.addEventListener('beforeunload', performAutoSave);
}

// Apply next update time based on SLA
function calculateNextUpdateTime() {
  const startTimeEl = document.getElementById('startTime');
  const severityEl = document.getElementById('incidentSeverity');
  const nextUpdateEl = document.getElementById('nextUpdateTime');
  const nextUpdateHintEl = document.getElementById('nextUpdateHint');
  
  if (!startTimeEl || !severityEl || !nextUpdateEl) return;
  
  const updateCalculation = () => {
    const startTime = startTimeEl.value;
    const severity = severityEl.value;
    
    if (!startTime || !severity) return;
    
    const config = window.BITA_CONFIG.config;
    const slaMinutes = config.slas[severity];
    
    if (!slaMinutes) return;
    
    // Parse start time and add SLA minutes
    const start = new Date(startTime);
    const nextUpdate = new Date(start.getTime() + slaMinutes * 60000);
    
    // Format as time for time input
    const timeString = nextUpdate.toTimeString().slice(0, 5);
    nextUpdateEl.value = timeString;
    
    // Show hint
    if (nextUpdateHintEl) {
      nextUpdateHintEl.textContent = `Based on ${severity} SLA (${slaMinutes} min)`;
    }
  };
  
  startTimeEl.addEventListener('change', updateCalculation);
  severityEl.addEventListener('change', updateCalculation);
}

// Initialize all config-based features
document.addEventListener('DOMContentLoaded', () => {
  updateSeverityHints();
  updateJurisdictionHints();
  calculateNextUpdateTime();
  initAutoSave();
  
  // Listen for config changes
  window.BITA_CONFIG.onChange((newConfig) => {
    // Reinitialize features that depend on config
    updateSeverityHints();
    updateJurisdictionHints();
  });
});
