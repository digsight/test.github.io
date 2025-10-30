class EnhancedBrowser {
    constructor() {
        this.currentTab = 'tab-1';
        this.homePage = 'https://www.google.com';
        this.init();
    }

    init() {
        this.tabManager = new TabManager();
        this.bookmarkManager = new BookmarkManager();
        this.historyManager = new HistoryManager();
        this.settingsManager = new SettingsManager();
        
        this.setupEventListeners();
        this.loadHomePage();
    }

    setupEventListeners() {
        // Navigation
        document.getElementById('back-btn').addEventListener('click', () => this.goBack());
        document.getElementById('forward-btn').addEventListener('click', () => this.goForward());
        document.getElementById('refresh-btn').addEventListener('click', () => this.refresh());
        document.getElementById('home-btn').addEventListener('click', () => this.goHome());
        
        // URL bar
        document.getElementById('url-bar').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.navigate();
        });
        document.getElementById('go-btn').addEventListener('click', () => this.navigate());
        
        // Controls
        document.getElementById('bookmark-btn').addEventListener('click', () => this.showBookmarks());
        document.getElementById('history-btn').addEventListener('click', () => this.showHistory());
        document.getElementById('settings-btn').addEventListener('click', () => this.showSettings());
        
        // Sidebar
        document.getElementById('close-sidebar').addEventListener('click', () => this.hideSidebar());
        
        // Modals
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => this.hideModals());
        });
    }

    navigate() {
        const url = document.getElementById('url-bar').value;
        const webview = this.getCurrentWebview();
        
        if (!url) return;
        
        let finalUrl = url;
        if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('about:')) {
            if (url.includes('.') && !url.includes(' ')) {
                finalUrl = 'https://' + url;
            } else {
                finalUrl = 'https://www.google.com/search?q=' + encodeURIComponent(url);
            }
        }
        
        try {
            webview.src = finalUrl;
            this.historyManager.addToHistory(finalUrl, 'Loading...');
            
            // Update title when page loads
            webview.addEventListener('load', () => {
                try {
                    const title = webview.contentDocument?.title || finalUrl;
                    this.tabManager.updateTabTitle(this.currentTab, title);
                    this.historyManager.updateLastHistoryItem(finalUrl, title);
                } catch (e) {
                    // Cross-origin restriction
                    this.tabManager.updateTabTitle(this.currentTab, new URL(finalUrl).hostname);
                }
            });
            
        } catch (error) {
            console.error('Navigation error:', error);
        }
    }

    getCurrentWebview() {
        return document.getElementById(`webview-${this.currentTab.split('-')[1]}`);
    }

    goBack() {
        const webview = this.getCurrentWebview();
        webview.contentWindow.history.back();
    }

    goForward() {
        const webview = this.getCurrentWebview();
        webview.contentWindow.history.forward();
    }

    refresh() {
        const webview = this.getCurrentWebview();
        webview.contentWindow.location.reload();
    }

    goHome() {
        document.getElementById('url-bar').value = this.homePage;
        this.navigate();
    }

    loadHomePage() {
        document.getElementById('url-bar').value = this.homePage;
        this.navigate();
    }

    showBookmarks() {
        const sidebar = document.getElementById('sidebar');
        const sidebarTitle = document.getElementById('sidebar-title');
        const sidebarContent = document.getElementById('sidebar-content');
        
        sidebarTitle.textContent = 'Bookmarks';
        sidebarContent.innerHTML = this.bookmarkManager.renderBookmarks();
        sidebar.classList.add('open');
    }

    showHistory() {
        const sidebar = document.getElementById('sidebar');
        const sidebarTitle = document.getElementById('sidebar-title');
        const sidebarContent = document.getElementById('sidebar-content');
        
        sidebarTitle.textContent = 'History';
        sidebarContent.innerHTML = this.historyManager.renderHistory();
        sidebar.classList.add('open');
    }

    showSettings() {
        document.getElementById('settings-modal').classList.add('active');
    }

    hideSidebar() {
        document.getElementById('sidebar').classList.remove('open');
    }

    hideModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }
}

// Initialize the browser when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.browser = new EnhancedBrowser();
});