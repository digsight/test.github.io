class BookmarkManager {
    constructor() {
        this.bookmarks = JSON.parse(localStorage.getItem('browser-bookmarks')) || [];
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('bookmark-btn').addEventListener('click', () => {
            this.toggleBookmark();
        });
    }

    toggleBookmark() {
        const webview = window.browser.getCurrentWebview();
        const url = webview.src;
        const title = webview.contentDocument?.title || url;
        
        if (!url || url === 'about:blank') return;
        
        const existingIndex = this.bookmarks.findIndex(bm => bm.url === url);
        
        if (existingIndex > -1) {
            this.removeBookmark(url);
        } else {
            this.addBookmark(url, title);
        }
    }

    addBookmark(url, title) {
        this.bookmarks.unshift({
            url,
            title: title || new URL(url).hostname,
            date: new Date().toISOString()
        });
        this.save();
        this.updateBookmarkButton(true);
    }

    removeBookmark(url) {
        this.bookmarks = this.bookmarks.filter(bm => bm.url !== url);
        this.save();
        this.updateBookmarkButton(false);
    }

    updateBookmarkButton(isBookmarked) {
        const btn = document.getElementById('bookmark-btn');
        const icon = btn.querySelector('i');
        
        if (isBookmarked) {
            icon.className = 'fas fa-star';
            btn.title = 'Remove bookmark';
        } else {
            icon.className = 'far fa-star';
            btn.title = 'Add bookmark';
        }
    }

    save() {
        localStorage.setItem('browser-bookmarks', JSON.stringify(this.bookmarks));
    }

    renderBookmarks() {
        if (this.bookmarks.length === 0) {
            return '<p class="no-items">No bookmarks yet</p>';
        }
        
        return this.bookmarks.map(bookmark => `
            <div class="bookmark-item" data-url="${bookmark.url}">
                <div class="bookmark-icon">
                    <i class="fas fa-bookmark"></i>
                </div>
                <div class="bookmark-info">
                    <div class="bookmark-title">${bookmark.title}</div>
                    <div class="bookmark-url">${bookmark.url}</div>
                </div>
                <button class="bookmark-remove" onclick="window.browser.bookmarkManager.removeBookmark('${bookmark.url}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }
}