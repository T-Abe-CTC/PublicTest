/**
 * Storage handling for the Roulette application
 * Manages saving and retrieving names and history from localStorage
 */

class RouletteStorage {
    constructor() {
        this.NAMES_KEY = 'roulette_names';
        this.HISTORY_KEY = 'roulette_history';
        this.MAX_HISTORY = 10;
    }

    /**
     * Save names to localStorage
     * @param {Array} names - Array of names to save
     */
    saveNames(names) {
        localStorage.setItem(this.NAMES_KEY, JSON.stringify(names));
    }

    /**
     * Get names from localStorage
     * @returns {Array} - Array of saved names or empty array if none
     */
    getNames() {
        const names = localStorage.getItem(this.NAMES_KEY);
        return names ? JSON.parse(names) : [];
    }

    /**
     * Add a new history entry
     * @param {Object} entry - History entry with name and timestamp
     */
    addHistoryEntry(entry) {
        const history = this.getHistory();
        
        // Add new entry at the beginning
        history.unshift(entry);
        
        // Keep only the most recent MAX_HISTORY entries
        if (history.length > this.MAX_HISTORY) {
            history.length = this.MAX_HISTORY;
        }
        
        localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
        
        // Also log to console for debugging/record keeping
        console.log(`Roulette result: ${entry.name} at ${entry.timestamp}`);
    }

    /**
     * Get history entries from localStorage
     * @returns {Array} - Array of history entries or empty array if none
     */
    getHistory() {
        const history = localStorage.getItem(this.HISTORY_KEY);
        return history ? JSON.parse(history) : [];
    }

    /**
     * Clear all history entries
     */
    clearHistory() {
        localStorage.removeItem(this.HISTORY_KEY);
    }

    /**
     * Clear all saved names
     */
    clearNames() {
        localStorage.removeItem(this.NAMES_KEY);
    }
}

// Create a global instance of RouletteStorage
const storage = new RouletteStorage();