// store.js - Centralized State Management
class BITA_Store {
    constructor() {
        this.state = {
            theme: 'light',
            currentTemplate: null,
            incidentData: {},
            history: [],
            settings: {}
        };
        
        this.listeners = [];
    }
    
    // Get state value
    get(key) {
        return this.state[key];
    }
    
    // Set state value
    set(key, value) {
        this.state[key] = value;
        this.notifyListeners(key, value);
    }
    
    // Update state with object
    update(obj) {
        Object.assign(this.state, obj);
        this.notifyListeners(null, obj);
    }
    
    // Subscribe to state changes
    subscribe(listener) {
        this.listeners.push(listener);
    }
    
    // Notify listeners of state changes
    notifyListeners(key, value) {
        for (const listener of this.listeners) {
            try {
                listener(key, value);
            } catch (error) {
                console.warn('Error in state listener:', error);
            }
        }
    }
    
    // Get entire state
    getState() {
        return {...this.state};
    }
}