// parser.js - Template Metadata Parsing
class BITA_Parser {
    constructor() {
        this.metadataRegex = /<!--\s*META\s*:\s*({.*?})\s*-->/s;
    }
    
    // Parse template metadata
    parseMetadata(templateString) {
        try {
            const match = templateString.match(this.metadataRegex);
            if (match) {
                return JSON.parse(match[1]);
            }
            return {};
        } catch (error) {
            console.warn('Failed to parse template metadata:', error);
            return {};
        }
    }
    
    // Extract tokens from template
    extractTokens(templateString) {
        const tokenRegex = /{{(.*?)}}/g;
        const tokens = [];
        let match;
        
        while ((match = tokenRegex.exec(templateString)) !== null) {
            tokens.push({
                full: match[0],
                key: match[1].trim()
            });
        }
        
        return tokens;
    }
    
    // Parse template content
    parseTemplate(templateString) {
        // Extract metadata
        const metadata = this.parseMetadata(templateString);
        
        // Extract tokens
        const tokens = this.extractTokens(templateString);
        
        // Get content without metadata
        const content = templateString.replace(this.metadataRegex, '').trim();
        
        return {
            metadata: metadata,
            tokens: tokens,
            content: content
        };
    }
}