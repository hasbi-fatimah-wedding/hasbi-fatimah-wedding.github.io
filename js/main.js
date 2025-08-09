// Main JavaScript file for Javanese Wedding Invitation
// Core functionality will be implemented here

// ===== NAVIGATION FUNCTIONALITY =====

/**
 * Navigation Controller
 * Handles sticky navbar behavior, smooth scrolling, and active link highlighting
 */
class NavigationController {
    constructor() {
        this.navbar = document.querySelector(".navbar");
        this.navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        this.sections = document.querySelectorAll("section[id]");
        this.scrollThreshold = 50;

        this.init();
    }

    init() {
        this.setupSmoothScrolling();
        this.setupScrollEffects();
        this.setupActiveNavigation();

        // Initial check for navbar state
        this.handleScroll();
    }

    /**
     * Setup smooth scrolling for navigation links
     */
    setupSmoothScrolling() {
        this.navLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault();

                const targetId = link.getAttribute("href").substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    const navbarHeight = this.navbar.offsetHeight;
                    const targetPosition =
                        targetSection.offsetTop - navbarHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: "smooth",
                    });

                    // Update active link immediately for better UX
                    this.updateActiveLink(link);
                }
            });
        });
    }

    /**
     * Setup scroll effects for navbar styling
     */
    setupScrollEffects() {
        let ticking = false;

        window.addEventListener("scroll", () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    /**
     * Handle scroll events for navbar styling and active navigation
     */
    handleScroll() {
        const scrollY = window.scrollY;

        // Add/remove scrolled class for navbar styling
        if (scrollY > this.scrollThreshold) {
            this.navbar.classList.add("scrolled");
        } else {
            this.navbar.classList.remove("scrolled");
        }

        // Update active navigation based on scroll position
        this.updateActiveNavigation();
    }

    /**
     * Setup intersection observer for active navigation highlighting
     */
    setupActiveNavigation() {
        const observerOptions = {
            root: null,
            rootMargin: "-20% 0px -70% 0px",
            threshold: 0,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const activeLink = document.querySelector(
                        `.nav-menu a[href="#${entry.target.id}"]`
                    );
                    if (activeLink) {
                        this.updateActiveLink(activeLink);
                    }
                }
            });
        }, observerOptions);

        this.sections.forEach((section) => {
            observer.observe(section);
        });
    }

    /**
     * Update active navigation based on current scroll position
     */
    updateActiveNavigation() {
        const scrollY = window.scrollY;
        const navbarHeight = this.navbar.offsetHeight;

        let currentSection = "";

        this.sections.forEach((section) => {
            const sectionTop = section.offsetTop - navbarHeight - 50;
            const sectionHeight = section.offsetHeight;

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute("id");
            }
        });

        // Handle case when at the very top of the page
        if (scrollY < 100) {
            currentSection = "home";
        }

        if (currentSection) {
            const activeLink = document.querySelector(
                `.nav-menu a[href="#${currentSection}"]`
            );
            if (activeLink) {
                this.updateActiveLink(activeLink);
            }
        }
    }

    /**
     * Update active link styling
     * @param {Element} activeLink - The link element to make active
     */
    updateActiveLink(activeLink) {
        // Remove active class from all links
        this.navLinks.forEach((link) => {
            link.classList.remove("active");
        });

        // Add active class to current link
        if (activeLink) {
            activeLink.classList.add("active");
        }
    }
}

/**
 * Mobile Navigation Controller
 * Handles hamburger menu toggle functionality for mobile devices
 */
class MobileNavigationController {
    constructor() {
        this.navToggle = document.querySelector(".nav-toggle");
        this.navMenu = document.querySelector(".nav-menu");
        this.navLinks = document.querySelectorAll(".nav-menu a");
        this.body = document.body;

        this.isMenuOpen = false;

        this.init();
    }

    init() {
        this.setupToggleButton();
        this.setupMenuLinks();
        this.setupKeyboardNavigation();
        this.setupOutsideClick();
    }

    /**
     * Setup hamburger toggle button functionality
     */
    setupToggleButton() {
        if (this.navToggle) {
            this.navToggle.addEventListener("click", (e) => {
                e.preventDefault();
                this.toggleMenu();
            });
        }
    }

    /**
     * Setup menu link click handlers to close menu on mobile
     */
    setupMenuLinks() {
        this.navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                // Close menu when a link is clicked on mobile
                if (window.innerWidth <= 767) {
                    this.closeMenu();
                }
            });
        });
    }

    /**
     * Setup keyboard navigation for accessibility
     */
    setupKeyboardNavigation() {
        document.addEventListener("keydown", (e) => {
            // Close menu on Escape key
            if (e.key === "Escape" && this.isMenuOpen) {
                this.closeMenu();
                this.navToggle.focus();
            }
        });
    }

    /**
     * Setup outside click to close menu
     */
    setupOutsideClick() {
        document.addEventListener("click", (e) => {
            if (
                this.isMenuOpen &&
                !this.navMenu.contains(e.target) &&
                !this.navToggle.contains(e.target)
            ) {
                this.closeMenu();
            }
        });
    }

    /**
     * Toggle mobile menu open/closed
     */
    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    /**
     * Open mobile menu
     */
    openMenu() {
        this.isMenuOpen = true;
        this.navMenu.classList.add("active");
        this.navToggle.setAttribute("aria-expanded", "true");
        this.body.classList.add("menu-open"); // Prevent background scrolling

        // Focus first menu item for accessibility
        const firstLink = this.navMenu.querySelector("a");
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 100);
        }
    }

    /**
     * Close mobile menu
     */
    closeMenu() {
        this.isMenuOpen = false;
        this.navMenu.classList.remove("active");
        this.navToggle.setAttribute("aria-expanded", "false");
        this.body.classList.remove("menu-open"); // Restore scrolling
    }

    /**
     * Handle window resize to close menu if switching to desktop
     */
    handleResize() {
        if (window.innerWidth > 767 && this.isMenuOpen) {
            this.closeMenu();
        }
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    const navigation = new NavigationController();
    const mobileNavigation = new MobileNavigationController();

    // Handle window resize for mobile menu
    window.addEventListener("resize", () => {
        mobileNavigation.handleResize();
    });
});
