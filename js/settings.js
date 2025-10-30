class SettingsManager {
    constructor() {
        this.settings = JSON.parse(localStorage.getItem('browser-settings')) || {
            theme: 'light',
            homepage: 'https://www.google.com',
            saveHistory: true
        };
        this.applySettings();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('theme-selector').addEventListener('change', (e) => {
            this.setTheme(e.target.value);
        });
        
        document.getElementById('homepage-input').addEventListener('change', (e) => {
            this.setHomepage(e.target.value);
        });
        
        document.getElementById('save-history').addEventListener('change', (e) => {
            this.setSaveHistory(e.target.checked);
        });
    }

    applySettings() {
        this.setTheme(this.settings.theme);
        document.getElementById('theme-selector').value = this.settings.theme;
        document.getElementById('homepage-input').value = this.settings.homepage;
        document.getElementById('save-history').checked = this.settings.saveHistory;
        
        if (window.browser) {
            window.browser.homePage = this.settings.homepage;
        }
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.settings.theme = theme;
        this.save();
    }

    setHomepage(homepage) {
        this.settings.homepage = homepage;
        if (window.browser) {
            window.browser.homePage = homepage;
        }
        this.save();
    }

    setSaveHistory(saveHistory) {
        this.settings.saveHistory = saveHistory;
        this.save();
    }

    save() {
        localStorage.setItem('browser-settings', JSON.stringify(this.settings));
    }
}