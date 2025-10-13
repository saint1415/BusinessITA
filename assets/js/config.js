// config.js - Configuration Management
const BITA_CONFIG = {
    // Application settings
    appName: "Business Incident Template Assistant",
    version: "1.0.0",
    
    // Default settings
    defaultTheme: "light",
    defaultTemplatePack: "core",
    
    // Validation rules
    incidentIdPattern: /^[A-Z]{2,5}-\d{4,8}$/,
    maxTitleLength: 100,
    maxDescriptionLength: 5000,
    
    // Template settings
    templatePacks: {
        core: "Core Templates",
        extended: "Extended Templates",
        custom: "Custom Templates"
    },
    
    // History settings
    maxHistoryItems: 50,
    
    // UI settings
    toastDuration: 3000,
    animationDuration: 300
};