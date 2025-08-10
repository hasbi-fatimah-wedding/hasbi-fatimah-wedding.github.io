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

// ===== COUNTDOWN TIMER FUNCTIONALITY =====

/**
 * Countdown Timer Controller
 * Handles countdown timer functionality with smooth animations
 */
class CountdownTimer {
    constructor() {
        // Wedding date - October 5, 2025 at 08:00 AM
        this.targetDate = new Date("2025-10-05T08:00:00").getTime();

        // DOM elements
        this.daysElement = document.getElementById("days");
        this.hoursElement = document.getElementById("hours");
        this.minutesElement = document.getElementById("minutes");
        this.secondsElement = document.getElementById("seconds");
        this.messageElement = document.getElementById("countdown-message");
        this.timerContainer = document.querySelector(".countdown-timer");

        // Timer state
        this.intervalId = null;
        this.isEventReached = false;

        // Previous values for animation detection
        this.previousValues = {
            days: null,
            hours: null,
            minutes: null,
            seconds: null,
        };

        this.init();
    }

    init() {
        // Check if all required elements exist
        if (
            !this.daysElement ||
            !this.hoursElement ||
            !this.minutesElement ||
            !this.secondsElement
        ) {
            console.warn("Countdown timer elements not found");
            return;
        }

        // Start the countdown
        this.startCountdown();

        // Update immediately
        this.updateCountdown();
    }

    /**
     * Start the countdown timer with 1-second intervals
     */
    startCountdown() {
        this.intervalId = setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }

    /**
     * Stop the countdown timer
     */
    stopCountdown() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    /**
     * Calculate time difference and update display
     */
    updateCountdown() {
        const now = new Date().getTime();
        const timeDifference = this.targetDate - now;

        // Check if event date has been reached
        if (timeDifference <= 0) {
            this.handleEventReached();
            return;
        }

        // Calculate time units
        const timeUnits = this.calculateTimeUnits(timeDifference);

        // Update display with animations
        this.updateDisplay(timeUnits);
    }

    /**
     * Calculate days, hours, minutes, and seconds from milliseconds
     * @param {number} timeDifference - Time difference in milliseconds
     * @returns {Object} Object containing days, hours, minutes, seconds
     */
    calculateTimeUnits(timeDifference) {
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
            (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
    }

    /**
     * Update the display with new time values and animations
     * @param {Object} timeUnits - Object containing time values
     */
    updateDisplay(timeUnits) {
        const { days, hours, minutes, seconds } = timeUnits;

        // Update each time unit with animation
        this.updateTimeUnit(this.daysElement, days, "days");
        this.updateTimeUnit(this.hoursElement, hours, "hours");
        this.updateTimeUnit(this.minutesElement, minutes, "minutes");
        this.updateTimeUnit(this.secondsElement, seconds, "seconds");

        // Store current values for next comparison
        this.previousValues = { days, hours, minutes, seconds };
    }

    /**
     * Update individual time unit with animation
     * @param {Element} element - DOM element to update
     * @param {number} value - New value to display
     * @param {string} unit - Time unit name (for previous value tracking)
     */
    updateTimeUnit(element, value, unit) {
        if (!element) return;

        const formattedValue = this.formatTimeValue(value);
        const previousValue = this.previousValues[unit];

        // Only animate if value has changed
        if (previousValue !== null && previousValue !== value) {
            this.animateValueChange(element, formattedValue);
        } else {
            element.textContent = formattedValue;
        }
    }

    /**
     * Format time value with leading zero if needed
     * @param {number} value - Time value to format
     * @returns {string} Formatted time value
     */
    formatTimeValue(value) {
        return value.toString().padStart(2, "0");
    }

    /**
     * Animate value change with smooth transition
     * @param {Element} element - DOM element to animate
     * @param {string} newValue - New value to display
     */
    animateValueChange(element, newValue) {
        // Add updating class for animation
        element.classList.add("updating");

        // Update the value
        element.textContent = newValue;

        // Remove animation class after animation completes
        setTimeout(() => {
            element.classList.remove("updating");
        }, 300);
    }

    /**
     * Handle when the event date is reached
     */
    handleEventReached() {
        if (this.isEventReached) return;

        this.isEventReached = true;
        this.stopCountdown();

        // Hide countdown display
        const countdownGrid = document.querySelector(".countdown-grid");
        if (countdownGrid) {
            countdownGrid.style.display = "none";
        }

        // Show event message
        if (this.messageElement) {
            this.messageElement.style.display = "block";
            this.messageElement.setAttribute("aria-live", "assertive");
        }

        // Update countdown title
        const countdownTitle = document.querySelector(".countdown-title");
        if (countdownTitle) {
            countdownTitle.textContent = "Hari Bahagia Telah Tiba!";
        }

        // Optional: Trigger celebration animation
        this.triggerCelebration();
    }

    /**
     * Trigger celebration effects when event is reached
     */
    triggerCelebration() {
        // Add celebration class to timer container
        if (this.timerContainer) {
            this.timerContainer.classList.add("celebration");
        }

        // You can add more celebration effects here
        // For example: confetti animation, sound effects, etc.
        console.log("🎉 Wedding day has arrived! 🎉");
    }

    /**
     * Update target date (useful for testing or dynamic events)
     * @param {Date|string} newDate - New target date
     */
    updateTargetDate(newDate) {
        this.targetDate = new Date(newDate).getTime();
        this.isEventReached = false;

        // Show countdown elements if they were hidden
        const countdownGrid = document.querySelector(".countdown-grid");
        if (countdownGrid) {
            countdownGrid.style.display = "grid";
        }

        if (this.messageElement) {
            this.messageElement.style.display = "none";
        }

        // Restart countdown if not already running
        if (!this.intervalId) {
            this.startCountdown();
        }

        // Update immediately
        this.updateCountdown();
    }

    /**
     * Get remaining time as object
     * @returns {Object|null} Remaining time object or null if event reached
     */
    getRemainingTime() {
        if (this.isEventReached) return null;

        const now = new Date().getTime();
        const timeDifference = this.targetDate - now;

        if (timeDifference <= 0) return null;

        return this.calculateTimeUnits(timeDifference);
    }

    /**
     * Destroy the countdown timer and clean up
     */
    destroy() {
        this.stopCountdown();

        // Remove any added classes
        if (this.timerContainer) {
            this.timerContainer.classList.remove("celebration");
        }

        // Reset display elements
        if (this.daysElement) this.daysElement.textContent = "00";
        if (this.hoursElement) this.hoursElement.textContent = "00";
        if (this.minutesElement) this.minutesElement.textContent = "00";
        if (this.secondsElement) this.secondsElement.textContent = "00";

        if (this.messageElement) {
            this.messageElement.style.display = "none";
        }
    }
}
// ===== LOCATION MAP FUNCTIONALITY =====

/**
 * Location Map Controller
 * Handles Google Maps integration and location-related functionality
 */
class LocationMapController {
    constructor() {
        // Venue coordinates (Yogyakarta example coordinates)
        this.venueCoordinates = {
            lat: -7.7956,
            lng: 110.3695,
        };

        // Venue address for directions
        this.venueAddress =
            "Gedung Serbaguna Desa, Jl. Raya Desa No. 123, Yogyakarta, DIY 55281, Indonesia";

        this.init();
    }

    init() {
        // Make map functions globally accessible
        window.openInMaps = this.openInMaps.bind(this);
        window.getDirections = this.getDirections.bind(this);
    }

    /**
     * Open venue location in default maps application
     * Detects user's device and opens appropriate maps app
     */
    openInMaps() {
        const { lat, lng } = this.venueCoordinates;

        // Detect user's device/browser
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);

        let mapsUrl;

        if (isIOS) {
            // iOS - Try Apple Maps first, fallback to Google Maps
            mapsUrl = `maps://maps.google.com/maps?daddr=${lat},${lng}&amp;ll=`;

            // Fallback for devices without Apple Maps
            const fallbackUrl = `https://maps.google.com/maps?daddr=${lat},${lng}`;

            // Try to open Apple Maps
            const link = document.createElement("a");
            link.href = mapsUrl;
            link.click();

            // Fallback after a short delay
            setTimeout(() => {
                window.open(fallbackUrl, "_blank");
            }, 500);
        } else if (isAndroid) {
            // Android - Use Google Maps intent
            mapsUrl = `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(
                "Gedung Serbaguna Desa"
            )})`;

            // Fallback to web version
            const fallbackUrl = `https://maps.google.com/maps?daddr=${lat},${lng}`;

            try {
                window.location.href = mapsUrl;
            } catch (error) {
                window.open(fallbackUrl, "_blank");
            }
        } else {
            // Desktop or other devices - Open Google Maps in new tab
            mapsUrl = `https://maps.google.com/maps?daddr=${lat},${lng}&amp;ll=`;
            window.open(mapsUrl, "_blank");
        }

        // Analytics tracking (optional)
        this.trackMapInteraction("open_in_maps");
    }

    /**
     * Get directions to venue location
     * Opens directions in appropriate maps application
     */
    getDirections() {
        const { lat, lng } = this.venueCoordinates;

        // Detect user's device/browser
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);

        let directionsUrl;

        if (isIOS) {
            // iOS - Apple Maps directions
            directionsUrl = `maps://maps.google.com/maps?saddr=Current%20Location&daddr=${lat},${lng}`;

            // Fallback to Google Maps web
            const fallbackUrl = `https://maps.google.com/maps/dir/Current%20Location/${lat},${lng}`;

            const link = document.createElement("a");
            link.href = directionsUrl;
            link.click();

            setTimeout(() => {
                window.open(fallbackUrl, "_blank");
            }, 500);
        } else if (isAndroid) {
            // Android - Google Maps directions
            directionsUrl = `google.navigation:q=${lat},${lng}`;

            // Fallback to web version
            const fallbackUrl = `https://maps.google.com/maps/dir/Current%20Location/${lat},${lng}`;

            try {
                window.location.href = directionsUrl;
            } catch (error) {
                window.open(fallbackUrl, "_blank");
            }
        } else {
            // Desktop - Google Maps directions in new tab
            directionsUrl = `https://maps.google.com/maps/dir/Current%20Location/${lat},${lng}`;
            window.open(directionsUrl, "_blank");
        }

        // Analytics tracking (optional)
        this.trackMapInteraction("get_directions");
    }

    /**
     * Copy venue address to clipboard
     * @returns {Promise<boolean>} Success status
     */
    async copyAddressToClipboard() {
        try {
            await navigator.clipboard.writeText(this.venueAddress);

            // Show success feedback
            this.showCopyFeedback(true);

            // Analytics tracking
            this.trackMapInteraction("copy_address");

            return true;
        } catch (error) {
            console.warn("Failed to copy address to clipboard:", error);

            // Fallback for older browsers
            this.fallbackCopyToClipboard(this.venueAddress);

            return false;
        }
    }

    /**
     * Fallback method to copy text to clipboard for older browsers
     * @param {string} text - Text to copy
     */
    fallbackCopyToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand("copy");
            this.showCopyFeedback(true);
        } catch (error) {
            console.error("Fallback copy failed:", error);
            this.showCopyFeedback(false);
        }

        document.body.removeChild(textArea);
    }

    /**
     * Show visual feedback for copy operation
     * @param {boolean} success - Whether copy was successful
     */
    showCopyFeedback(success) {
        // Create temporary feedback element
        const feedback = document.createElement("div");
        feedback.className = "copy-feedback";
        feedback.textContent = success
            ? "Alamat disalin!"
            : "Gagal menyalin alamat";
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${success ? "var(--accent)" : "#e74c3c"};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-family: var(--font-secondary);
            font-weight: 600;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: fadeInOut 2s ease-in-out forwards;
        `;

        // Add animation keyframes if not already added
        if (!document.querySelector("#copy-feedback-styles")) {
            const style = document.createElement("style");
            style.id = "copy-feedback-styles";
            style.textContent = `
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                    20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(feedback);

        // Remove feedback element after animation
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 2000);
    }

    /**
     * Track map interactions for analytics (optional)
     * @param {string} action - Action type
     */
    trackMapInteraction(action) {
        // This is where you would integrate with your analytics service
        // For example: Google Analytics, Facebook Pixel, etc.

        console.log(`Map interaction: ${action}`);

        // Example Google Analytics tracking (if gtag is available)
        if (typeof gtag !== "undefined") {
            gtag("event", "map_interaction", {
                event_category: "location",
                event_label: action,
                value: 1,
            });
        }
    }

    /**
     * Get distance between two coordinates (Haversine formula)
     * @param {number} lat1 - Latitude of first point
     * @param {number} lon1 - Longitude of first point
     * @param {number} lat2 - Latitude of second point
     * @param {number} lon2 - Longitude of second point
     * @returns {number} Distance in kilometers
     */
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) *
                Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in kilometers
        return distance;
    }

    /**
     * Convert degrees to radians
     * @param {number} deg - Degrees
     * @returns {number} Radians
     */
    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    /**
     * Get user's current location and calculate distance to venue
     * @returns {Promise<Object>} Location and distance information
     */
    async getUserLocationAndDistance() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(
                    new Error("Geolocation is not supported by this browser")
                );
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;

                    const distance = this.calculateDistance(
                        userLat,
                        userLng,
                        this.venueCoordinates.lat,
                        this.venueCoordinates.lng
                    );

                    resolve({
                        userLocation: { lat: userLat, lng: userLng },
                        venueLocation: this.venueCoordinates,
                        distance: Math.round(distance * 10) / 10, // Round to 1 decimal place
                    });
                },
                (error) => {
                    reject(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000, // 5 minutes
                }
            );
        });
    }
}

// Initialize all controllers when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    // Initialize existing controllers
    const navigation = new NavigationController();
    const mobileNavigation = new MobileNavigationController();
    const countdownTimer = new CountdownTimer();
    const locationMap = new LocationMapController();

    // Initialize timeline controllers
    const timelineAnimation = new TimelineAnimationController();
    const timelineInteraction = new TimelineInteractionController();
    const timelineImages = new TimelineImageController();

    // Make controllers globally accessible for debugging/testing
    window.countdownTimer = countdownTimer;
    window.locationMap = locationMap;
    window.timelineAnimation = timelineAnimation;
    window.timelineInteraction = timelineInteraction;
    window.timelineImages = timelineImages;

    // Handle window resize for mobile menu
    window.addEventListener("resize", () => {
        mobileNavigation.handleResize();
    });

    // Optional: Add keyboard shortcuts for testing
    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === "T") {
            // Set target date to 10 seconds from now for testing
            const testDate = new Date(Date.now() + 10000);
            countdownTimer.updateTargetDate(testDate);
            console.log("Countdown set to 10 seconds for testing");
        }

        if (e.ctrlKey && e.shiftKey && e.key === "L") {
            // Test timeline animations
            timelineAnimation.triggerAllAnimations();
            console.log("Timeline animations triggered for testing");
        }

        if (e.ctrlKey && e.shiftKey && e.key === "R") {
            // Reset timeline animations
            timelineAnimation.resetAnimations();
            console.log("Timeline animations reset");
        }

        if (e.ctrlKey && e.shiftKey && e.key === "I") {
            // Show image loading statistics
            const stats = timelineImages.getLoadingStats();
            console.log("Image loading statistics:", stats);
        }

        if (e.ctrlKey && e.shiftKey && e.key === "F") {
            // Refresh failed images
            timelineImages.refreshImages();
            console.log("Refreshing failed images");
        }
    });
});

// ===== LOVE STORY TIMELINE FUNCTIONALITY =====

/**
 * Timeline Animation Controller
 * Handles scroll-triggered animations for timeline items
 */
class TimelineAnimationController {
    constructor() {
        this.timelineItems = document.querySelectorAll(".timeline-item");
        this.observerOptions = {
            root: null,
            rootMargin: "-10% 0px -10% 0px",
            threshold: 0.1,
        };

        this.observer = null;
        this.animatedItems = new Set();

        this.init();
    }

    init() {
        if (this.timelineItems.length === 0) {
            console.warn("No timeline items found");
            return;
        }

        this.setupIntersectionObserver();
        this.setupInitialState();
    }

    /**
     * Setup intersection observer for scroll-triggered animations
     */
    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (
                    entry.isIntersecting &&
                    !this.animatedItems.has(entry.target)
                ) {
                    this.animateTimelineItem(entry.target);
                    this.animatedItems.add(entry.target);
                }
            });
        }, this.observerOptions);

        // Observe all timeline items
        this.timelineItems.forEach((item) => {
            this.observer.observe(item);
        });
    }

    /**
     * Setup initial state for timeline items
     */
    setupInitialState() {
        this.timelineItems.forEach((item, index) => {
            // Add data attributes for animation
            item.setAttribute("data-timeline-index", index);

            // Set initial state
            item.style.opacity = "0";
            item.style.transform = "translateY(30px)";
        });
    }

    /**
     * Animate timeline item when it comes into view
     * @param {Element} item - Timeline item to animate
     */
    animateTimelineItem(item) {
        const index = parseInt(item.getAttribute("data-timeline-index"));
        const delay = index * 150; // Staggered animation delay

        setTimeout(() => {
            item.classList.add("animate");
            item.style.opacity = "1";
            item.style.transform = "translateY(0)";

            // Add pulse effect to timeline icon
            const icon = item.querySelector(".timeline-icon");
            if (icon) {
                this.addPulseEffect(icon);
            }

            // Trigger card entrance animation
            const card = item.querySelector(".timeline-card");
            if (card) {
                this.animateCard(card, index);
            }
        }, delay);
    }

    /**
     * Add pulse effect to timeline icon
     * @param {Element} icon - Timeline icon element
     */
    addPulseEffect(icon) {
        icon.style.animation = "timelinePulse 0.6s ease-out";

        // Remove animation after completion
        setTimeout(() => {
            icon.style.animation = "";
        }, 600);
    }

    /**
     * Animate timeline card with enhanced effects
     * @param {Element} card - Timeline card element
     * @param {number} index - Item index for alternating animations
     */
    animateCard(card) {
        // Add entrance animation class
        card.classList.add("card-entrance");

        // Remove animation class after completion
        setTimeout(() => {
            card.classList.remove("card-entrance");
        }, 800);
    }

    /**
     * Reset all animations (useful for testing or re-triggering)
     */
    resetAnimations() {
        this.animatedItems.clear();

        this.timelineItems.forEach((item) => {
            item.classList.remove("animate");
            item.style.opacity = "0";
            item.style.transform = "translateY(30px)";

            const card = item.querySelector(".timeline-card");
            if (card) {
                card.classList.remove("card-entrance");
            }

            const icon = item.querySelector(".timeline-icon");
            if (icon) {
                icon.style.animation = "";
            }
        });
    }

    /**
     * Trigger all animations immediately (for testing)
     */
    triggerAllAnimations() {
        this.timelineItems.forEach((item, index) => {
            setTimeout(() => {
                this.animateTimelineItem(item);
            }, index * 200);
        });
    }

    /**
     * Destroy the timeline controller and clean up
     */
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }

        this.animatedItems.clear();

        // Reset all items to initial state
        this.timelineItems.forEach((item) => {
            item.style.opacity = "";
            item.style.transform = "";
            item.classList.remove("animate");
        });
    }
}

/**
 * Timeline Interaction Controller
 * Handles interactive features for timeline items
 */
class TimelineInteractionController {
    constructor() {
        this.timelineItems = document.querySelectorAll(".timeline-item");
        this.timelineCards = document.querySelectorAll(".timeline-card");

        this.init();
    }

    init() {
        this.setupCardInteractions();
        this.setupKeyboardNavigation();
        this.setupAccessibilityFeatures();
    }

    /**
     * Setup interactive features for timeline cards
     */
    setupCardInteractions() {
        this.timelineCards.forEach((card, index) => {
            // Add hover sound effect (optional)
            card.addEventListener("mouseenter", () => {
                this.handleCardHover(card, index);
            });

            // Add click interaction for mobile
            card.addEventListener("click", (e) => {
                this.handleCardClick(card, e);
            });

            // Add focus handling for accessibility
            card.addEventListener("focus", () => {
                this.handleCardFocus(card);
            });
        });
    }

    /**
     * Handle card hover effects
     * @param {Element} card - Timeline card element
     * @param {number} index - Card index
     */
    handleCardHover(card, index) {
        // Add subtle animation to the corresponding timeline icon
        const item = card.closest(".timeline-item");
        const icon = item?.querySelector(".timeline-icon");

        if (icon) {
            icon.style.transform = "scale(1.05)";
            icon.style.transition = "transform 0.2s ease";
        }

        // Optional: Add sound effect or haptic feedback
        // this.playHoverSound(index);
    }

    /**
     * Handle card click interactions
     * @param {Element} card - Timeline card element
     * @param {Event} e - Click event
     */
    handleCardClick(card, e) {
        // Add click ripple effect
        this.createRippleEffect(card, e);

        // Optional: Expand card or show more details
        // this.expandCard(card);
    }

    /**
     * Handle card focus for accessibility
     * @param {Element} card - Timeline card element
     */
    handleCardFocus(card) {
        // Ensure card is visible when focused
        card.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    }

    /**
     * Create ripple effect on card click
     * @param {Element} card - Timeline card element
     * @param {Event} e - Click event
     */
    createRippleEffect(card, e) {
        const ripple = document.createElement("div");
        const rect = card.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(218, 165, 32, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;

        // Add ripple animation keyframes if not already added
        if (!document.querySelector("#ripple-animation-styles")) {
            const style = document.createElement("style");
            style.id = "ripple-animation-styles";
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        card.style.position = "relative";
        card.style.overflow = "hidden";
        card.appendChild(ripple);

        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    /**
     * Setup keyboard navigation for timeline
     */
    setupKeyboardNavigation() {
        this.timelineCards.forEach((card, index) => {
            // Make cards focusable
            card.setAttribute("tabindex", "0");
            card.setAttribute("role", "button");
            card.setAttribute("aria-label", `Timeline item ${index + 1}`);

            // Handle keyboard interactions
            card.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    this.handleCardClick(card, e);
                }
            });
        });
    }

    /**
     * Setup accessibility features
     */
    setupAccessibilityFeatures() {
        // Add ARIA labels and descriptions
        this.timelineItems.forEach((item, index) => {
            const title = item.querySelector(".timeline-title")?.textContent;
            const date = item.querySelector(".timeline-date time")?.textContent;

            if (title && date) {
                item.setAttribute("aria-label", `${title} - ${date}`);
            }
        });

        // Add live region for screen readers when animations trigger
        const liveRegion = document.createElement("div");
        liveRegion.setAttribute("aria-live", "polite");
        liveRegion.setAttribute("aria-atomic", "true");
        liveRegion.className = "sr-only";
        liveRegion.id = "timeline-live-region";
        document.body.appendChild(liveRegion);
    }

    /**
     * Announce timeline item to screen readers
     * @param {Element} item - Timeline item element
     */
    announceTimelineItem(item) {
        const liveRegion = document.getElementById("timeline-live-region");
        const title = item.querySelector(".timeline-title")?.textContent;
        const date = item.querySelector(".timeline-date time")?.textContent;

        if (liveRegion && title && date) {
            liveRegion.textContent = `Timeline item revealed: ${title} from ${date}`;
        }
    }
}

// Add timeline animation keyframes to CSS
if (!document.querySelector("#timeline-animation-styles")) {
    const style = document.createElement("style");
    style.id = "timeline-animation-styles";
    style.textContent = `
        @keyframes timelinePulse {
            0% {
                transform: scale(1);
                box-shadow: 0 4px 15px rgba(218, 165, 32, 0.4);
            }
            50% {
                transform: scale(1.1);
                box-shadow: 0 6px 25px rgba(218, 165, 32, 0.7);
            }
            100% {
                transform: scale(1);
                box-shadow: 0 4px 15px rgba(218, 165, 32, 0.4);
            }
        }

        .card-entrance {
            animation: cardSlideIn 0.8s ease-out;
        }

        @keyframes cardSlideIn {
            0% {
                opacity: 0;
                transform: translateX(-20px);
            }
            100% {
                opacity: 1;
                transform: translateX(0);
            }
        }

        /* Alternate animation for even items */
        .timeline-item:nth-child(even) .card-entrance {
            animation: cardSlideInRight 0.8s ease-out;
        }

        @keyframes cardSlideInRight {
            0% {
                opacity: 0;
                transform: translateX(20px);
            }
            100% {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);
}
// ===== TIMELINE IMAGE FUNCTIONALITY =====

/**
 * Timeline Image Controller
 * Handles image loading, error handling, and interactive features
 */
class TimelineImageController {
    constructor() {
        this.storyImages = document.querySelectorAll(".story-photo");
        this.imageOverlays = document.querySelectorAll(".image-overlay");

        this.init();
    }

    init() {
        this.setupImageLoading();
        this.setupImageErrorHandling();
        this.setupImageInteractions();
        this.setupLazyLoading();
    }

    /**
     * Setup image loading animations
     */
    setupImageLoading() {
        this.storyImages.forEach((img) => {
            // Add loading class initially
            img.classList.add("loading");

            // Handle successful image load
            img.addEventListener("load", () => {
                img.classList.remove("loading");
                img.classList.add("loaded");
                this.animateImageEntry(img);
            });

            // Handle image load error
            img.addEventListener("error", () => {
                this.handleImageError(img);
            });
        });
    }

    /**
     * Setup image error handling
     */
    setupImageErrorHandling() {
        this.storyImages.forEach((img) => {
            img.addEventListener("error", () => {
                this.handleImageError(img);
            });
        });
    }

    /**
     * Handle image loading errors
     * @param {Element} img - Image element that failed to load
     */
    handleImageError(img) {
        img.classList.add("error");
        img.classList.remove("loading");

        // Create fallback placeholder
        const placeholder = this.createImagePlaceholder(img);
        img.parentNode.insertBefore(placeholder, img);
        img.style.display = "none";

        console.warn(`Failed to load timeline image: ${img.src}`);
    }

    /**
     * Create placeholder for failed images
     * @param {Element} originalImg - Original image element
     * @returns {Element} Placeholder element
     */
    createImagePlaceholder(originalImg) {
        const placeholder = document.createElement("div");
        placeholder.className = "story-photo-placeholder";
        placeholder.style.cssText = `
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, var(--cream) 0%, var(--light-cream) 50%, var(--cream) 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-radius: var(--radius-md);
            color: var(--dark-text);
            font-family: var(--font-secondary);
        `;

        const icon = document.createElement("div");
        icon.innerHTML = "📷";
        icon.style.cssText = `
            font-size: 3rem;
            margin-bottom: 1rem;
            opacity: 0.6;
        `;

        const text = document.createElement("div");
        text.textContent = "Gambar tidak dapat dimuat";
        text.style.cssText = `
            font-size: var(--font-size-sm);
            font-weight: 500;
            text-align: center;
            opacity: 0.8;
        `;

        placeholder.appendChild(icon);
        placeholder.appendChild(text);

        return placeholder;
    }

    /**
     * Animate image entry when loaded
     * @param {Element} img - Image element to animate
     */
    animateImageEntry(img) {
        img.style.opacity = "0";
        img.style.transform = "scale(0.9)";

        // Trigger animation after a short delay
        setTimeout(() => {
            img.style.transition =
                "opacity 0.6s ease-out, transform 0.6s ease-out";
            img.style.opacity = "1";
            img.style.transform = "scale(1)";
        }, 100);
    }

    /**
     * Setup interactive features for images
     */
    setupImageInteractions() {
        this.storyImages.forEach((img, index) => {
            const container = img.closest(".timeline-image");
            if (!container) return;

            // Add click handler for image expansion (optional)
            container.addEventListener("click", (e) => {
                this.handleImageClick(img, e);
            });

            // Add keyboard support
            container.setAttribute("tabindex", "0");
            container.setAttribute("role", "button");
            container.setAttribute(
                "aria-label",
                `View story image ${index + 1}`
            );

            container.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    this.handleImageClick(img, e);
                }
            });
        });
    }

    /**
     * Handle image click interactions
     * @param {Element} img - Clicked image element
     * @param {Event} e - Click event
     */
    handleImageClick(img, e) {
        // Add click effect
        const container = img.closest(".timeline-image");
        if (container) {
            container.style.transform = "scale(0.98)";
            setTimeout(() => {
                container.style.transform = "";
            }, 150);
        }

        // Optional: Open image in modal or lightbox
        // this.openImageModal(img);

        // For now, just log the interaction
        console.log("Timeline image clicked:", img.alt);
    }

    /**
     * Setup lazy loading for images
     */
    setupLazyLoading() {
        // Use Intersection Observer for lazy loading if supported
        if ("IntersectionObserver" in window) {
            const imageObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            this.loadImage(img);
                            imageObserver.unobserve(img);
                        }
                    });
                },
                {
                    rootMargin: "50px 0px",
                    threshold: 0.1,
                }
            );

            this.storyImages.forEach((img) => {
                if (img.getAttribute("loading") === "lazy") {
                    imageObserver.observe(img);
                }
            });
        }
    }

    /**
     * Load image with proper handling
     * @param {Element} img - Image element to load
     */
    loadImage(img) {
        if (img.src && !img.classList.contains("loaded")) {
            // Image will load automatically, just add loading class
            img.classList.add("loading");
        }
    }

    /**
     * Preload all timeline images for better performance
     */
    preloadImages() {
        const imageUrls = Array.from(this.storyImages).map((img) => img.src);

        imageUrls.forEach((url) => {
            if (url) {
                const preloadImg = new Image();
                preloadImg.src = url;
            }
        });
    }

    /**
     * Get image loading statistics
     * @returns {Object} Loading statistics
     */
    getLoadingStats() {
        const total = this.storyImages.length;
        const loaded = document.querySelectorAll(".story-photo.loaded").length;
        const errors = document.querySelectorAll(".story-photo.error").length;
        const loading = document.querySelectorAll(
            ".story-photo.loading"
        ).length;

        return {
            total,
            loaded,
            errors,
            loading,
            percentage: total > 0 ? Math.round((loaded / total) * 100) : 0,
        };
    }

    /**
     * Refresh all images (useful for retrying failed loads)
     */
    refreshImages() {
        this.storyImages.forEach((img) => {
            if (img.classList.contains("error")) {
                img.classList.remove("error");
                img.classList.add("loading");
                img.style.display = "";

                // Remove placeholder if exists
                const placeholder = img.parentNode.querySelector(
                    ".story-photo-placeholder"
                );
                if (placeholder) {
                    placeholder.remove();
                }

                // Reload image
                const src = img.src;
                img.src = "";
                img.src = src;
            }
        });
    }
}

// Add image loading styles
if (!document.querySelector("#timeline-image-styles")) {
    const style = document.createElement("style");
    style.id = "timeline-image-styles";
    style.textContent = `
        .story-photo.loading {
            opacity: 0.7;
            background: linear-gradient(90deg, var(--cream) 25%, var(--light-cream) 50%, var(--cream) 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
            0% {
                background-position: -200% 0;
            }
            100% {
                background-position: 200% 0;
            }
        }

        .story-photo.loaded {
            opacity: 1;
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        .story-photo.error {
            display: none;
        }

        .story-photo-placeholder {
            animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        /* Enhanced hover effects for loaded images */
        .timeline-image:hover .story-photo.loaded {
            transform: scale(1.05);
        }

        /* Focus styles for keyboard navigation */
        .timeline-image:focus {
            outline: 2px solid var(--accent);
            outline-offset: 2px;
            border-radius: var(--radius-md);
        }
    `;
    document.head.appendChild(style);
}
