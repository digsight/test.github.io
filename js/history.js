class HistoryManager {
    constructor() {
        this.history = JSON.parse(localStorage.getItem('browser-history')) || [];
        this.maxHistoryItems = 100;
    }

    addToHistory(url, title) {
        this.history.unshift({
            url,
            title: title || 'Loading...',
            timestamp: new Date().toISOString(),
            visitCount: 1
        });
        
        // Remove duplicates and limit size
        this.cleanHistory();
        this.save();
    }

    updateLastHistoryItem(url, title) {
        const item = this.history.find(item => item.url === url);
        if (item) {
            item.title = title;
            item.visitCount = (item.visitCount || 1) + 1;
            this.save();
        }
    }

    cleanHistory() {
        const seen = new Set();
        this.history = this.history.filter(item => {
            if (seen.has(item.url) || this.history.length > this.maxHistoryItems) {
                return false;
            }
            seen.add(item.url);
            return true;
        });
    }

    save() {
        localStorage.setItem('browser-history', JSON.stringify(this.history));
    }

    renderHistory() {
        if (this.history.length === 0) {
            return '<p class="no-items">No history yet</p>';
        }
        
        return this.history.map(item => `
            <div class="history-item" data-url="${item.url}">
                <div class="history-icon">
                    <i class="fas fa-globe"></i>
                </div>
                <div class="history-info">
                    <div class="history-title">${item.title}</div>
                    <div class="history-url">${item.url}</div>
                    <div class="history-time">${new Date(item.timestamp).toLocaleString()}</div>
                </div>
            </div>
        `).join('');
    }
}