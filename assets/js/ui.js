// ui.js - UI Interaction Handlers
class BITA_UI {
    constructor() {
        this.theme = 'light';
        this.toastContainer = null;
    }
    
    // Initialize UI components
    init() {
        this.createToastContainer();
        this.bindEvents();
        this.populateTemplateList();
        this.setupThemeToggle();
    }
    
    // Create toast container
    createToastContainer() {
        this.toastContainer = document.createElement('div');
        this.toastContainer.id = 'toast-container';
        document.body.appendChild(this.toastContainer);
    }
    
    // Bind UI events
    bindEvents() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Template selection
        const templateSelect = document.getElementById('templateSelect');
        if (templateSelect) {
            templateSelect.addEventListener('change', (e) => this.onTemplateChange(e.target.value));
        }
        
        // Generate communications
        const generateBtn = document.getElementById('generateBtn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generateCommunications());
        }
        
        // Download incident data
        const downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadIncidentData());
        }
        
        // Incident ID generation
        const generateIdBtn = document.getElementById('generateIdBtn');
        if (generateIdBtn) {
            generateIdBtn.addEventListener('click', () => this.generateIncidentId());
        }
        
        // Preview template
        const previewBtn = document.getElementById('previewBtn');
        if (previewBtn) {
            previewBtn.addEventListener('click', () => this.previewTemplate());
        }
    }
    
    // Set theme
    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('bita_theme', theme);
        
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.textContent = theme === 'light' ? '🌓' : '☀️';
        }
        
        // Update store
        if (window.BITA && window.BITA.store) {
            window.BITA.store.set('theme', theme);
        }
    }
    
    // Initialize theme
    initTheme() {
        const saved = localStorage.getItem('bita_theme');
        if (saved) {
            this.setTheme(saved);
        } else {
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.setTheme(prefersDark ? 'dark' : 'light');
        }
    }
    
    // Toggle theme
    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
    
    // Setup theme toggle
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.textContent = this.theme === 'light' ? '🌓' : '☀️';
        }
    }
    
    // Populate template list
    populateTemplateList() {
        const templateSelect = document.getElementById('templateSelect');
        if (!templateSelect || !window.BITA || !window.BITA.templates) return;
        
        // Clear existing options
        templateSelect.innerHTML = '';
        
        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select a template';
        templateSelect.appendChild(defaultOption);
        
        // Add templates
        const templates = window.BITA.templates.getTemplates();
        for (const [id, template] of Object.entries(templates)) {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = `${template.title} (${template.type})`;
            templateSelect.appendChild(option);
        }
    }
    
    // Handle template change
    onTemplateChange(templateId) {
        if (!templateId || !window.BITA || !window.BITA.templates) return;
        
        const template = window.BITA.templates.getTemplate(templateId);
        if (!template) return;
        
        // Update store
        if (window.BITA.store) {
            window.BITA.store.set('currentTemplate', template);
        }
        
        // Update UI
        this.updateTemplateFields(template);
    }
    
    // Update template fields
    updateTemplateFields(template) {
        // Update title
        const titleInput = document.getElementById('incidentTitle');
        if (titleInput) {
            titleInput.value = template.title;
        }
        
        // Update description
        const descriptionInput = document.getElementById('incidentDescription');
        if (descriptionInput) {
            descriptionInput.value = template.description;
        }
        
        // Update type
        const typeInput = document.getElementById('incidentType');
        if (typeInput) {
            typeInput.value = template.type;
        }
        
        // Update severity
        const severityInput = document.getElementById('incidentSeverity');
        if (severityInput) {
            severityInput.value = template.severity;
        }
    }
    
    // Generate incident ID
    generateIncidentId() {
        const serviceInput = document.getElementById('serviceName');
        const service = serviceInput ? serviceInput.value : 'GEN';
        
        // Get service prefix (first 3 chars, uppercase)
        const servicePrefix = service.substring(0, 3).toUpperCase();
        
        // Generate random number
        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        
        // Get date
        const date = new Date();
        const year = date.getFullYear().toString().substr(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        
        // Create ID
        const incidentId = `${servicePrefix}-${year}${month}${day}-${randomNumber}`;
        
        // Update input
        const idInput = document.getElementById('incidentId');
        if (idInput) {
            idInput.value = incidentId;
        }
        
        // Show toast
        this.showToast(`Generated Incident ID: ${incidentId}`, 'success');
    }
    
    // Validate incident ID
    validateIncidentId(id) {
        const pattern = BITA_CONFIG.incidentIdPattern || /^[A-Z]{2,5}-\d{4,8}$/;
        return pattern.test(id);
    }
    
    // Generate communications
    generateCommunications() {
        if (!window.BITA || !window.BITA.render || !window.BITA.store) {
            this.showToast('Application not fully initialized', 'error');
            return;
        }
        
        // Get current template
        const template = window.BITA.store.get('currentTemplate');
        if (!template) {
            this.showToast('Please select a template first', 'error');
            return;
        }
        
        // Get incident data
        const incidentData = this.getIncidentData();
        
        // Validate incident ID
        if (incidentData.incident_id && !this.validateIncidentId(incidentData.incident_id)) {
            this.showToast('Invalid Incident ID format. Expected: XXX-XXXX', 'error');
            return;
        }
        
        try {
            // Render communications
            const communications = window.BITA.render.renderAll(template, incidentData);
            
            // Update UI
            this.updateCommunicationsDisplay(communications);
            
            // Add to history
            if (window.BITA.history) {
                window.BITA.history.addItem({
                    templateId: template.id,
                    incidentId: incidentData.incident_id,
                    title: incidentData.title,
                    type: template.type,
                    severity: template.severity
                });
            }
            
            // Show success message
            this.showToast('Communications generated successfully', 'success');
        } catch (error) {
            console.error('Failed to generate communications:', error);
            this.showToast('Failed to generate communications', 'error');
        }
    }
    
    // Get incident data from form
    getIncidentData() {
        const data = {};
        
        // Get all input fields
        const fields = document.querySelectorAll('input, textarea, select');
        for (const field of fields) {
            if (field.name || field.id) {
                const key = field.name || field.id;
                data[key] = field.value;
            }
        }
        
        return data;
    }
    
    // Update communications display
    updateCommunicationsDisplay(communications) {
        const container = document.getElementById('communicationsContainer');
        if (!container) return;
        
        // Clear container
        container.innerHTML = '';
        
        // Add each communication
        for (const [type, content] of Object.entries(communications)) {
            const section = document.createElement('div');
            section.className = 'communication-section';
            
            const title = document.createElement('h3');
            title.textContent = this.getCommunicationTitle(type);
            section.appendChild(title);
            
            const pre = document.createElement('pre');
            pre.className = 'communication-content';
            pre.textContent = content;
            section.appendChild(pre);
            
            container.appendChild(section);
        }
    }
    
    // Get communication title
    getCommunicationTitle(type) {
        const titles = {
            internal: 'Internal Communication',
            customer: 'Customer Communication',
            pre_maintenance: 'Pre-Maintenance Notification',
            post_maintenance: 'Post-Maintenance Notification'
        };
        
        return titles[type] || type;
    }
    
    // Preview template
    previewTemplate() {
        if (!window.BITA || !window.BITA.render || !window.BITA.store) {
            this.showToast('Application not fully initialized', 'error');
            return;
        }
        
        // Get current template
        const template = window.BITA.store.get('currentTemplate');
        if (!template) {
            this.showToast('Please select a template first', 'error');
            return;
        }
        
        // Get incident data
        const incidentData = this.getIncidentData();
        
        try {
            // Render preview
            const preview = window.BITA.render.previewTemplate(template, incidentData);
            
            // Show in modal or alert
            alert(preview);
        } catch (error) {
            console.error('Failed to preview template:', error);
            this.showToast('Failed to preview template', 'error');
        }
    }
    
    // Download incident data
    downloadIncidentData() {
        // Get incident data
        const incidentData = this.getIncidentData();
        
        // Validate incident ID
        if (incidentData.incident_id && !this.validateIncidentId(incidentData.incident_id)) {
            this.showToast('Invalid Incident ID format. Expected: XXX-XXXX', 'error');
            return;
        }
        
        // Create filename
        const filename = incidentData.incident_id ? 
            `${incidentData.incident_id}_incident_data.json` : 
            'incident_data.json';
        
        // Create data blob
        const dataStr = JSON.stringify(incidentData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        // Create download link
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = filename;
        link.click();
        
        // Show success message
        this.showToast(`Downloaded: ${filename}`, 'success');
    }
    
    // Show toast message
    showToast(message, type = 'info') {
        if (!this.toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        this.toastContainer.appendChild(toast);
        
        // Remove after duration
        setTimeout(() => {
            toast.classList.add('toast-fadeout');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, BITA_CONFIG.toastDuration || 3000);
    }
}

// Theme helper functions
(function(){
    const THEME_KEY = "bita_theme";

    function setTheme(theme){
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem(THEME_KEY, theme);
        const btn = document.getElementById("themeToggle");
        if(btn) btn.textContent = theme === "light" ? "🌓" : "☀️";
        // reflect into global store if present
        if(window.BITA_STORE) window.BITA_STORE.theme = theme;
    }

    function initTheme(){
        const saved = localStorage.getItem(THEME_KEY);
        if(saved) return setTheme(saved);
        const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        setTheme(prefersDark ? "dark" : "light");
    }

    document.addEventListener("DOMContentLoaded", function(){
        initTheme();
        const btn = document.getElementById("themeToggle");
        if(btn){
            btn.addEventListener("click", function(){
                const cur = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
                setTheme(cur);
            });
        } else {
            console.warn("themeToggle element not found");
        }
    });

    // expose for other modules
    window.BITA_THEME = { setTheme, initTheme };
})();