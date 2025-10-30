class TabManager {
    constructor() {
        this.tabCounter = 1;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('new-tab-btn').addEventListener('click', () => this.createTab());
    }

    createTab(url = 'about:blank') {
        this.tabCounter++;
        const tabId = `tab-${this.tabCounter}`;
        
        // Create tab element
        const tab = document.createElement('div');
        tab.className = 'tab';
        tab.dataset.tabId = tabId;
        tab.innerHTML = `
            <span class="tab-title">New Tab</span>
            <button class="tab-close">&times;</button>
        `;
        
        // Insert before new tab button
        const tabsContainer = document.getElementById('tabs-container');
        const newTabBtn = document.getElementById('new-tab-btn');
        tabsContainer.insertBefore(tab, newTabBtn);
        
        // Create tab content
        const tabContent = document.createElement('div');
        tabContent.className = 'tab-content';
        tabContent.id = tabId;
        tabContent.innerHTML = `<iframe id="webview-${this.tabCounter}" src="${url}"></iframe>`;
        
        document.querySelector('.browser-content').appendChild(tabContent);
        
        // Add event listeners
        tab.addEventListener('click', (e) => {
            if (!e.target.classList.contains('tab-close')) {
                this.switchTab(tabId);
            }
        });
        
        tab.querySelector('.tab-close').addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeTab(tabId);
        });
        
        this.switchTab(tabId);
        return tabId;
    }

    switchTab(tabId) {
        // Deactivate all tabs
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Activate selected tab
        const selectedTab = document.querySelector(`[data-tab-id="${tabId}"]`);
        const selectedContent = document.getElementById(tabId);
        
        if (selectedTab && selectedContent) {
            selectedTab.classList.add('active');
            selectedContent.classList.add('active');
            
            // Update URL bar
            const webview = selectedContent.querySelector('iframe');
            try {
                document.getElementById('url-bar').value = webview.src;
            } catch (e) {
                document.getElementById('url-bar').value = '';
            }
            
            window.browser.currentTab = tabId;
        }
    }

    closeTab(tabId) {
        if (document.querySelectorAll('.tab').length <= 1) return;
        
        const tab = document.querySelector(`[data-tab-id="${tabId}"]`);
        const content = document.getElementById(tabId);
        
        if (tab && content) {
            tab.remove();
            content.remove();
            
            // Switch to another tab if closing active tab
            if (tab.classList.contains('active')) {
                const remainingTabs = document.querySelectorAll('.tab');
                if (remainingTabs.length > 0) {
                    this.switchTab(remainingTabs[0].dataset.tabId);
                }
            }
        }
    }

    updateTabTitle(tabId, title) {
        const tab = document.querySelector(`[data-tab-id="${tabId}"] .tab-title`);
        if (tab) {
            tab.textContent = title || 'New Tab';
        }
    }
}