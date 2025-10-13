// app.js - Main Application Entry Point
(function() {
    'use strict';
    
    // Central application state
    window.BITA = {
        store: null,
        templates: null,
        ui: null,
        render: null,
        parser: null,
        validation: null,
        history: null,
        settings: null,
        linter: null,
        config: null
    };

    // Initialize all modules
    function initApp() {
        try {
            // Initialize configuration first
            window.BITA.config = BITA_CONFIG || {};
            
            // Initialize store
            window.BITA.store = new BITA_Store();
            
            // Initialize templates
            window.BITA.templates = new BITA_Templates();
            
            // Initialize UI
            window.BITA.ui = new BITA_UI();
            
            // Initialize other modules
            window.BITA.render = new BITA_Render();
            window.BITA.parser = new BITA_Parser();
            window.BITA.validation = new BITA_Validation();
            window.BITA.history = new BITA_History();
            window.BITA.settings = new BITA_Settings();
            window.BITA.linter = new BITA_Linter();
            
            // Initialize UI components
            window.BITA.ui.init();
            
            // Load templates
            window.BITA.templates.loadTemplates();
            
            // Initialize theme
            window.BITA_THEME.initTheme();
            
            // Show success message
            console.log('BusinessITA initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize BusinessITA:', error);
            alert('Failed to initialize BusinessITA. Please check the console for details.');
        }
    }

    // Wait for DOM to be loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
})();