// history.js - Incident History Management
class BITA_History {
    constructor() {
        this.historyKey = 'bita_history';
        this.maxItems = BITA_CONFIG.maxHistoryItems || 50;
        this.history = this.loadHistory();
    }
    
    // Load history from localStorage
    loadHistory() {
        try {
            const history = localStorage.getItem(this.historyKey);
            return history ? JSON.parse(history) : [];
        } catch (error) {
            console.warn('Failed to load history:', error);
            return [];
        }
    }
    
    // Save history to localStorage
    saveHistory() {
        try {
            localStorage.setItem(this.historyKey, JSON.stringify(this.history));
        } catch (error) {
            console.warn('Failed to save history:', error);
        }
    }
    
    // Add item to history
    addItem(item) {
        // Add timestamp
        item.timestamp = new Date().toISOString();
        
        // Add to beginning of array
        this.history.unshift(item);
        
        // Limit to max items
        if (this.history.length > this.maxItems) {
            this.history = this.history.slice(0, this.maxItems);
        }
        
        // Save to localStorage
        this.saveHistory();
    }
    
    // Get history items
    getItems() {
        return this.history;
    }
    
    // Clear history
    clear() {
        this.history = [];
        this.saveHistory();
    }
    
    // Get recent items
    getRecent(count = 5) {
        return this.history.slice(0, count);
    }
}