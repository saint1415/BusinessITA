// render.js - Communication Rendering
class BITA_Render {
    constructor() {
        this.parser = new BITA_Parser();
    }
    
    // Render template with data
    renderTemplate(template, data) {
        if (!template || !template.body) {
            throw new Error('Invalid template');
        }
        
        // Parse template
        const parsed = this.parser.parseTemplate(template.body);
        
        // Replace tokens
        let rendered = parsed.content;
        
        // Replace each token with data
        for (const token of parsed.tokens) {
            const value = data[token.key] || '';
            rendered = rendered.replace(token.full, value);
        }
        
        return rendered;
    }
    
    // Render all communications
    renderAll(template, data) {
        const communications = {};
        
        // Render each communication type
        for (const [key, commTemplate] of Object.entries(template.communications || {})) {
            communications[key] = this.renderTemplate({ body: commTemplate }, data);
        }
        
        return communications;
    }
    
    // Preview template
    previewTemplate(template, data) {
        try {
            return this.renderTemplate(template, data);
        } catch (error) {
            console.error('Failed to preview template:', error);
            return 'Failed to render template preview';
        }
    }
}