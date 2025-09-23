// Theme Management
class ThemeManager {
    constructor() {
        this.themeToggle = null;
        this.currentTheme = localStorage.getItem('etf-theme') || 'light';
    }

    init() {
        this.themeToggle = document.getElementById('themeToggle');
        if (!this.themeToggle) {
            console.error('Theme toggle button not found');
            return;
        }

        this.applyTheme(this.currentTheme);
        
        // Add click event listener
        this.themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Theme toggle clicked');
            this.toggleTheme();
        });

        console.log('Theme manager initialized');
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-color-scheme', theme);
        this.currentTheme = theme;
        localStorage.setItem('etf-theme', theme);
        console.log(`Applied theme: ${theme}`);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.hamburgerMenu = null;
        this.navSidebar = null;
        this.navClose = null;
        this.navOverlay = null;
        this.navLinks = [];
        this.pages = [];
        this.currentPage = 'about';
        this.isNavOpen = false;
    }

    init() {
        // Get all elements
        this.hamburgerMenu = document.getElementById('hamburgerMenu');
        this.navSidebar = document.getElementById('navSidebar');
        this.navClose = document.getElementById('navClose');
        this.navOverlay = document.getElementById('navOverlay');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.pages = document.querySelectorAll('.page');

        if (!this.hamburgerMenu || !this.navSidebar) {
            console.error('Navigation elements not found');
            return;
        }

        // Ensure sidebar is closed initially
        this.closeNav();
        
        // Hamburger menu click
        this.hamburgerMenu.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Hamburger menu clicked, isNavOpen:', this.isNavOpen);
            
            if (this.isNavOpen) {
                this.closeNav();
            } else {
                this.openNav();
            }
        });

        // Close button click
        if (this.navClose) {
            this.navClose.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Nav close clicked');
                this.closeNav();
            });
        }

        // Overlay click
        if (this.navOverlay) {
            this.navOverlay.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Nav overlay clicked');
                this.closeNav();
            });
        }

        // Navigation links
        this.navLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const page = link.dataset.page;
                console.log(`Nav link clicked: ${page}`);
                if (page) {
                    this.navigateToPage(page);
                    this.closeNav();
                }
            });

            // Keyboard support
            link.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    const page = link.dataset.page;
                    console.log(`Nav link keyboard: ${page}`);
                    if (page) {
                        this.navigateToPage(page);
                        this.closeNav();
                    }
                }
            });
        });

        // Escape key to close navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isNavOpen) {
                console.log('Escape key pressed');
                this.closeNav();
            }
        });

        // Initialize with about page
        this.navigateToPage('about');
        
        console.log('Navigation manager initialized');
    }

    openNav() {
        if (!this.navSidebar) return;
        
        console.log('Opening navigation');
        this.navSidebar.classList.remove('hidden');
        this.isNavOpen = true;
        document.body.style.overflow = 'hidden';
        
        if (this.hamburgerMenu) {
            this.hamburgerMenu.setAttribute('aria-expanded', 'true');
        }
    }

    closeNav() {
        if (!this.navSidebar) return;
        
        console.log('Closing navigation');
        this.navSidebar.classList.add('hidden');
        this.isNavOpen = false;
        document.body.style.overflow = '';
        
        if (this.hamburgerMenu) {
            this.hamburgerMenu.setAttribute('aria-expanded', 'false');
        }
    }

    navigateToPage(pageId) {
        console.log(`Navigating to: ${pageId}`);
        
        // Hide all pages
        this.pages.forEach(page => {
            page.classList.remove('active');
        });
        
        // Show target page
        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            console.log(`Activated page: ${pageId}`);
        } else {
            console.error(`Page not found: ${pageId}-page`);
        }

        // Update active nav link
        this.navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-page="${pageId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        this.currentPage = pageId;

        // Initialize components for specific pages
        if (pageId === 'conferences' && window.slideshow) {
            setTimeout(() => window.slideshow.init(), 200);
        }

        if (pageId === 'membership' && window.membershipManager) {
            setTimeout(() => window.membershipManager.init(), 200);
        }

        // Update page title
        const pageTitle = activeLink ? activeLink.textContent.trim() : 'About ETF - Bharat';
        document.title = `${pageTitle} - English Teacher Forum`;
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
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;

        const mainImage = document.getElementById('mainSlideImage');
        if (!mainImage) {
            console.log('Slideshow elements not available');
            return;
        }

        this.initialized = true;
        console.log('Initializing slideshow');

        this.setupEventListeners();
        this.generateThumbnails();
        this.updateDisplay();
        this.preloadImages();
    }

    setupEventListeners() {
        const prevBtn = document.getElementById('prevSlide');
        const nextBtn = document.getElementById('nextSlide');
        const playPauseBtn = document.getElementById('playPauseBtn');
        const mainImage = document.getElementById('mainSlideImage');

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.previousImage();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextImage();
            });
        }
        
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleAutoPlay();
            });
        }

        if (mainImage) {
            mainImage.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
            mainImage.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
            mainImage.addEventListener('error', () => this.handleImageError());
            mainImage.addEventListener('load', () => this.handleImageLoad());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const conferencePage = document.getElementById('conferences-page');
            if (conferencePage && conferencePage.classList.contains('active')) {
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
    }

    generateThumbnails() {
        const thumbnailContainer = document.getElementById('thumbnailScroll');
        if (!thumbnailContainer) return;
        
        thumbnailContainer.innerHTML = '';
        
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
            
            thumbnail.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.currentIndex = i - 1;
                    this.updateDisplay();
                    this.updateThumbnails();
                }
            });
            
            thumbnail.tabIndex = 0;
            thumbnailContainer.appendChild(thumbnail);
        }
    }

    updateDisplay() {
        const mainImage = document.getElementById('mainSlideImage');
        const currentSlideSpan = document.getElementById('currentSlide');
        const totalSlidesSpan = document.getElementById('totalSlides');

        if (!mainImage) return;
        
        const imageNumber = this.currentIndex + 1;
        mainImage.src = `img${imageNumber}.jpg`;
        mainImage.alt = `Gallery image ${imageNumber}`;
        
        if (currentSlideSpan) {
            currentSlideSpan.textContent = imageNumber;
        }
        if (totalSlidesSpan) {
            totalSlidesSpan.textContent = this.totalImages;
        }
    }

    updateThumbnails() {
        const thumbnails = document.querySelectorAll('#thumbnailScroll .thumbnail');
        
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.currentIndex);
        });

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
        const playPauseBtn = document.getElementById('playPauseBtn');
        if (playPauseBtn) {
            playPauseBtn.classList.add('playing');
        }
        this.autoPlayInterval = setInterval(() => {
            this.nextImage();
        }, this.autoPlayDelay);
    }

    stopAutoPlay() {
        this.isPlaying = false;
        const playPauseBtn = document.getElementById('playPauseBtn');
        if (playPauseBtn) {
            playPauseBtn.classList.remove('playing');
        }
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
                this.nextImage();
            } else {
                this.previousImage();
            }
        }
    }

    handleImageError() {
        const imageNumber = this.currentIndex + 1;
        this.imageLoadErrors.add(imageNumber);
        console.warn(`Failed to load image: img${imageNumber}.jpg`);
    }

    handleImageLoad() {
        const imageNumber = this.currentIndex + 1;
        this.imageLoadErrors.delete(imageNumber);
    }

    preloadImages() {
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
        this.initialized = false;
    }
}

// Membership Management
class MembershipManager {
    constructor() {
        this.membershipTypes = {
            annual: { price: 500, validity: '1 year', prefix: 'YM' },
            long_term: { price: 3000, validity: '7 years', prefix: 'LTM' }
        };
        
        this.generatedId = null;
        this.initialized = false;
        this.membershipCounter = {
            YM: parseInt(localStorage.getItem('YM-counter') || '100'),
            LTM: parseInt(localStorage.getItem('LTM-counter') || '100')
        };
    }

    init() {
        if (this.initialized) return;

        const membershipForm = document.getElementById('membershipForm');
        if (!membershipForm) {
            console.log('Membership form not available');
            return;
        }

        this.initialized = true;
        console.log('Initializing membership manager');

        this.setupEventListeners();
        this.updateAmount();
    }

    setupEventListeners() {
        const membershipType = document.getElementById('membershipType');
        const generateIdBtn = document.getElementById('generateIdBtn');
        const membershipForm = document.getElementById('membershipForm');
        const modal = document.getElementById('successModal');
        const modalClose = document.getElementById('modalClose');
        const modalOkBtn = document.getElementById('modalOkBtn');
        const modalOverlay = document.getElementById('modalOverlay');

        if (membershipType) {
            membershipType.addEventListener('change', () => this.updateAmount());
        }
        
        if (generateIdBtn) {
            generateIdBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.generateMembershipId();
            });
        }
        
        if (membershipForm) {
            membershipForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }
        
        // Modal events
        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeModal());
        }
        if (modalOkBtn) {
            modalOkBtn.addEventListener('click', () => this.closeModal());
        }
        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => this.closeModal());
        }
        
        // Keyboard support for modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
                this.closeModal();
            }
        });
    }

    updateAmount() {
        const membershipType = document.getElementById('membershipType');
        const amountDisplay = document.getElementById('amountDisplay');
        const generateIdBtn = document.getElementById('generateIdBtn');
        const submitBtn = document.getElementById('submitBtn');
        const membershipIdDisplay = document.getElementById('membershipIdDisplay');

        if (!membershipType || !amountDisplay) return;
        
        const selectedType = membershipType.value;
        if (selectedType && this.membershipTypes[selectedType]) {
            const amount = this.membershipTypes[selectedType].price;
            amountDisplay.textContent = `Rs ${amount}`;
            if (generateIdBtn) {
                generateIdBtn.disabled = false;
            }
        } else {
            amountDisplay.textContent = 'Rs 0';
            if (generateIdBtn) {
                generateIdBtn.disabled = true;
            }
        }
        
        // Reset generated ID when membership type changes
        this.generatedId = null;
        if (membershipIdDisplay) {
            membershipIdDisplay.classList.add('hidden');
        }
        if (submitBtn) {
            submitBtn.disabled = true;
        }
    }

    generateMembershipId() {
        const membershipType = document.getElementById('membershipType');
        const membershipIdDisplay = document.getElementById('membershipIdDisplay');
        const submitBtn = document.getElementById('submitBtn');

        if (!membershipType) return;
        
        const selectedType = membershipType.value;
        if (!selectedType || !this.membershipTypes[selectedType]) {
            alert('Please select a membership type first.');
            return;
        }

        const typeConfig = this.membershipTypes[selectedType];
        const prefix = typeConfig.prefix;
        
        // Generate sequential number
        const currentCount = this.membershipCounter[prefix];
        this.generatedId = `${prefix}${currentCount.toString().padStart(7, '0')}`;
        this.membershipCounter[prefix]++;
        
        // Save counter to localStorage
        localStorage.setItem(`${prefix}-counter`, this.membershipCounter[prefix].toString());
        
        // Display the generated ID
        if (membershipIdDisplay) {
            membershipIdDisplay.innerHTML = `
                <h4>Generated Membership ID:</h4>
                <p>${this.generatedId}</p>
                <small>Please save this ID for your records</small>
            `;
            membershipIdDisplay.classList.remove('hidden');
        }
        
        // Enable submit button
        if (submitBtn) {
            submitBtn.disabled = false;
        }
        
        console.log(`Generated membership ID: ${this.generatedId}`);
    }

    validateForm() {
        const requiredFields = ['memberName', 'memberEmail', 'membershipType'];
        const errors = [];
        
        requiredFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (!field || !field.value.trim()) {
                const label = field?.previousElementSibling?.textContent || fieldName;
                errors.push(`${label.replace('*', '').trim()} is required`);
            }
        });
        
        // Validate email format
        const emailField = document.getElementById('memberEmail');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailField && emailField.value && !emailPattern.test(emailField.value)) {
            errors.push('Please enter a valid email address');
        }
        
        // Check if ID is generated
        if (!this.generatedId) {
            errors.push('Please generate a membership ID first');
        }
        
        return errors;
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log('Membership form submitted');
        
        const errors = this.validateForm();
        if (errors.length > 0) {
            alert('Please fix the following errors:\n' + errors.join('\n'));
            return;
        }
        
        // Get form data
        const membershipForm = document.getElementById('membershipForm');
        const formData = new FormData(membershipForm);
        const memberData = {
            name: formData.get('memberName'),
            email: formData.get('memberEmail'),
            phone: formData.get('memberPhone') || 'Not provided',
            membershipType: formData.get('membershipType'),
            paymentReference: formData.get('paymentRef') || 'Not provided',
            membershipId: this.generatedId,
            submittedAt: new Date().toLocaleString()
        };
        
        this.showSuccessModal(memberData);
    }

    showSuccessModal(memberData) {
        const modal = document.getElementById('successModal');
        const modalBody = document.getElementById('modalBody');

        if (!modal || !modalBody) return;
        
        const selectedType = this.membershipTypes[memberData.membershipType];
        
        modalBody.innerHTML = `
            <div style="text-align: center;">
                <p><strong>Thank you, ${memberData.name}!</strong></p>
                <p>Your membership application has been submitted successfully.</p>
                <div style="background: var(--color-bg-3); padding: var(--space-16); border-radius: var(--radius-base); margin: var(--space-16) 0;">
                    <p><strong>Membership ID:</strong> ${memberData.membershipId}</p>
                    <p><strong>Type:</strong> ${selectedType.validity} membership</p>
                    <p><strong>Amount:</strong> Rs ${selectedType.price}</p>
                </div>
                <p><small>Please make the payment to the provided bank account and keep your membership ID for future reference.</small></p>
            </div>
        `;
        
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Focus the OK button for accessibility
        setTimeout(() => {
            const modalOkBtn = document.getElementById('modalOkBtn');
            if (modalOkBtn) {
                modalOkBtn.focus();
            }
        }, 100);
    }

    closeModal() {
        const modal = document.getElementById('successModal');
        const membershipForm = document.getElementById('membershipForm');
        const membershipIdDisplay = document.getElementById('membershipIdDisplay');
        const submitBtn = document.getElementById('submitBtn');

        if (modal) {
            modal.classList.add('hidden');
        }
        document.body.style.overflow = '';
        
        // Reset form after successful submission
        if (membershipForm) {
            membershipForm.reset();
            this.updateAmount();
            this.generatedId = null;
            if (membershipIdDisplay) {
                membershipIdDisplay.classList.add('hidden');
            }
            if (submitBtn) {
                submitBtn.disabled = true;
            }
        }
        
        console.log('Modal closed and form reset');
    }
}

// Global instances
let themeManager, navigationManager, slideshow, membershipManager;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('English Teacher Forum initializing...');
    
    // Initialize theme manager
    themeManager = new ThemeManager();
    themeManager.init();
    
    // Initialize navigation
    navigationManager = new NavigationManager();
    navigationManager.init();
    
    // Initialize slideshow
    slideshow = new SlideshowManager();
    window.slideshow = slideshow;
    
    // Initialize membership manager
    membershipManager = new MembershipManager();
    window.membershipManager = membershipManager;
    
    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navigationManager && navigationManager.isNavOpen) {
            navigationManager.closeNav();
        }
    });
    
    // Handle page visibility change
    document.addEventListener('visibilitychange', function() {
        if (slideshow && slideshow.isPlaying && document.hidden) {
            slideshow.stopAutoPlay();
        }
    });
    
    // Mark as loaded
    document.body.classList.add('loaded');
    
    // Export to window
    window.ETFWebsite = {
        themeManager,
        navigationManager,
        slideshow,
        membershipManager
    };
    
    console.log('English Teacher Forum initialized successfully');
});