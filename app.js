// Theme Management
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-color-scheme', theme);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.hamburgerMenu = document.getElementById('hamburgerMenu');
        this.navSidebar = document.getElementById('navSidebar');
        this.navClose = document.getElementById('navClose');
        this.navOverlay = document.getElementById('navOverlay');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.pages = document.querySelectorAll('.page');
        this.currentPage = 'about';
        this.init();
    }

    init() {
        // Menu toggle events
        this.hamburgerMenu.addEventListener('click', () => this.openNav());
        this.navClose.addEventListener('click', () => this.closeNav());
        this.navOverlay.addEventListener('click', () => this.closeNav());

        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.navigateToPage(page);
                this.closeNav();
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navSidebar.classList.contains('active')) {
                this.closeNav();
            }
        });
    }

    openNav() {
        this.navSidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeNav() {
        this.navSidebar.classList.remove('active');
        document.body.style.overflow = '';
    }

    navigateToPage(pageId) {
        // Hide all pages
        this.pages.forEach(page => page.classList.remove('active'));
        
        // Show target page
        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update active nav link
        this.navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`[data-page="${pageId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        this.currentPage = pageId;

        // Initialize slideshow if navigating to conferences page
        if (pageId === 'conferences') {
            setTimeout(() => {
                if (window.slideshow) {
                    window.slideshow.init();
                }
            }, 100);
        }
    }
}

// Slideshow Management
class SlideshowManager {
    constructor() {
        this.totalImages = 55;
        this.currentIndex = 0;
        this.isPlaying = false;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 3000;
        this.imageLoadErrors = new Set();
        
        this.mainImage = document.getElementById('mainSlideImage');
        this.currentSlideSpan = document.getElementById('currentSlide');
        this.totalSlidesSpan = document.getElementById('totalSlides');
        this.prevBtn = document.getElementById('prevSlide');
        this.nextBtn = document.getElementById('nextSlide');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.thumbnailContainer = document.getElementById('thumbnailScroll');
        
        this.touchStartX = 0;
        this.touchEndX = 0;
    }

    init() {
        if (!this.mainImage) return;
        
        this.setupEventListeners();
        this.generateThumbnails();
        this.updateDisplay();
        this.preloadImages();
    }

    setupEventListeners() {
        // Navigation buttons
        this.prevBtn?.addEventListener('click', () => this.previousImage());
        this.nextBtn?.addEventListener('click', () => this.nextImage());
        this.playPauseBtn?.addEventListener('click', () => this.toggleAutoPlay());

        // Touch/swipe support
        this.mainImage.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.mainImage.addEventListener('touchend', (e) => this.handleTouchEnd(e));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (document.getElementById('conferences-page').classList.contains('active')) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.previousImage();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextImage();
                } else if (e.key === ' ') {
                    e.preventDefault();
                    this.toggleAutoPlay();
                }
            }
        });

        // Image error handling
        this.mainImage.addEventListener('error', () => this.handleImageError());
        this.mainImage.addEventListener('load', () => this.handleImageLoad());
    }

    generateThumbnails() {
        if (!this.thumbnailContainer) return;
        
        this.thumbnailContainer.innerHTML = '';
        
        for (let i = 1; i <= this.totalImages; i++) {
            const thumbnail = document.createElement('img');
            thumbnail.src = `img${i}.jpg`;
            thumbnail.alt = `Gallery thumbnail ${i}`;
            thumbnail.className = 'thumbnail';
            thumbnail.dataset.index = i - 1;
            
            if (i === 1) {
                thumbnail.classList.add('active');
            }
            
            thumbnail.addEventListener('click', () => {
                this.currentIndex = i - 1;
                this.updateDisplay();
                this.updateThumbnails();
            });
            
            thumbnail.addEventListener('error', () => {
                thumbnail.style.display = 'none';
            });
            
            this.thumbnailContainer.appendChild(thumbnail);
        }
    }

    updateDisplay() {
        const imageNumber = this.currentIndex + 1;
        this.mainImage.src = `img${imageNumber}.jpg`;
        this.mainImage.alt = `Gallery image ${imageNumber}`;
        this.currentSlideSpan.textContent = imageNumber;
        this.totalSlidesSpan.textContent = this.totalImages;
    }

    updateThumbnails() {
        const thumbnails = this.thumbnailContainer.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.currentIndex);
        });

        // Scroll active thumbnail into view
        const activeThumbnail = thumbnails[this.currentIndex];
        if (activeThumbnail) {
            activeThumbnail.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }

    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.totalImages;
        this.updateDisplay();
        this.updateThumbnails();
    }

    previousImage() {
        this.currentIndex = (this.currentIndex - 1 + this.totalImages) % this.totalImages;
        this.updateDisplay();
        this.updateThumbnails();
    }

    toggleAutoPlay() {
        if (this.isPlaying) {
            this.stopAutoPlay();
        } else {
            this.startAutoPlay();
        }
    }

    startAutoPlay() {
        this.isPlaying = true;
        this.playPauseBtn.classList.add('playing');
        this.autoPlayInterval = setInterval(() => {
            this.nextImage();
        }, this.autoPlayDelay);
    }

    stopAutoPlay() {
        this.isPlaying = false;
        this.playPauseBtn.classList.remove('playing');
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
    }

    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next image
                this.nextImage();
            } else {
                // Swipe right - previous image
                this.previousImage();
            }
        }
    }

    handleImageError() {
        const imageNumber = this.currentIndex + 1;
        this.imageLoadErrors.add(imageNumber);
        
        // Try to find next available image
        let nextIndex = (this.currentIndex + 1) % this.totalImages;
        let attempts = 0;
        
        while (this.imageLoadErrors.has(nextIndex + 1) && attempts < this.totalImages) {
            nextIndex = (nextIndex + 1) % this.totalImages;
            attempts++;
        }
        
        if (attempts < this.totalImages) {
            this.currentIndex = nextIndex;
            this.updateDisplay();
            this.updateThumbnails();
        } else {
            // All images failed, show placeholder
            this.showImagePlaceholder();
        }
    }

    handleImageLoad() {
        // Image loaded successfully, remove from error set if it was there
        const imageNumber = this.currentIndex + 1;
        this.imageLoadErrors.delete(imageNumber);
    }

    showImagePlaceholder() {
        this.mainImage.alt = 'Image not available';
        // You could set a placeholder image here
        // this.mainImage.src = 'placeholder.jpg';
    }

    preloadImages() {
        // Preload first few images for better user experience
        const preloadCount = Math.min(5, this.totalImages);
        
        for (let i = 1; i <= preloadCount; i++) {
            const img = new Image();
            img.src = `img${i}.jpg`;
            img.onerror = () => {
                this.imageLoadErrors.add(i);
            };
        }
    }

    destroy() {
        this.stopAutoPlay();
        // Remove event listeners if needed
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme manager
    const themeManager = new ThemeManager();
    
    // Initialize navigation
    const navigationManager = new NavigationManager();
    
    // Initialize slideshow (will be called when conferences page is loaded)
    window.slideshow = new SlideshowManager();
    
    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Handle window resize for responsive behavior
    const handleResize = debounce(() => {
        // Close navigation on resize to prevent layout issues
        if (window.innerWidth > 768 && navigationManager.navSidebar.classList.contains('active')) {
            navigationManager.closeNav();
        }
    }, 250);
    
    window.addEventListener('resize', handleResize);
    
    // Initialize slideshow if already on conferences page
    if (document.getElementById('conferences-page').classList.contains('active')) {
        setTimeout(() => {
            window.slideshow.init();
        }, 100);
    }
    
    // Add loading states for better UX
    document.body.classList.add('loaded');
    
    console.log('English Teacher Forum website initialized successfully');
});

// Handle page visibility change to pause/resume slideshow
document.addEventListener('visibilitychange', function() {
    if (window.slideshow && window.slideshow.isPlaying) {
        if (document.hidden) {
            window.slideshow.stopAutoPlay();
        }
    }
});

// Export for potential external use
window.ETFWebsite = {
    themeManager: null,
    navigationManager: null,
    slideshow: null
};