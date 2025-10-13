// settings.js - User Preferences
class BITA_Settings {
    constructor() {
        this.settingsKey = 'bita_settings';
        this.defaults = {
            theme: BITA_CONFIG.defaultTheme || 'light',
            templatePack: BITA_CONFIG.defaultTemplatePack || 'core',
            autoSave: true,
            notifications: true
        };
        this.settings = this.loadSettings();
    }
    
    // Load settings from localStorage
    loadSettings() {
        try {
            const settings = localStorage.getItem(this.settingsKey);
            return settings ? {...this.defaults, ...JSON.parse(settings)} : {...this.defaults};
        } catch (error) {
            console.warn('Failed to load settings:', error);
            return {...this.defaults};
        }
    }
    
    // Save settings to localStorage
    saveSettings() {
        try {
            localStorage.setItem(this.settingsKey, JSON.stringify(this.settings));
        } catch (error) {
            console.warn('Failed to save settings:', error);
        }
    }
    
    // Get setting value
    get(key) {
        return this.settings[key] !== undefined ? this.settings[key] : this.defaults[key];
    }
    
    // Set setting value
    set(key, value) {
        this.settings[key] = value;
        this.saveSettings();
    }
    
    // Reset to defaults
    reset() {
        this.settings = {...this.defaults};
        this.saveSettings();
    }
    
    // Get all settings
    getAll() {
        return {...this.settings};
    }
}