class WebBrowser {
    constructor() {
        this.webview = document.getElementById('webview');
        this.urlBar = document.getElementById('url-bar');
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('back-btn').addEventListener('click', () => {
            this.webview.contentWindow.history.back();
        });

        document.getElementById('forward-btn').addEventListener('click', () => {
            this.webview.contentWindow.history.forward();
        });

        document.getElementById('refresh-btn').addEventListener('click', () => {
            this.webview.contentWindow.location.reload();
        });

        document.getElementById('go-btn').addEventListener('click', () => {
            this.navigateTo(this.urlBar.value);
        });

        this.urlBar.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.navigateTo(this.urlBar.value);
            }
        });

        // Update URL bar when iframe navigates
        this.webview.addEventListener('load', () => {
            this.urlBar.value = this.webview.contentWindow.location.href;
        });
    }

    navigateTo(url) {
        if (!url) return;
        
        // Add protocol if missing
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        
        try {
            this.webview.src = url;
            this.urlBar.value = url;
        } catch (error) {
            console.error('Navigation error:', error);
        }
    }
}

// Initialize the browser when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new WebBrowser();
});