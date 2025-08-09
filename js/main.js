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

// Initialize location map controller when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    // Initialize existing controllers
    const navigation = new NavigationController();
    const mobileNavigation = new MobileNavigationController();
    const countdownTimer = new CountdownTimer();
    const locationMap = new LocationMapController();

    // Make controllers globally accessible for debugging/testing
    window.countdownTimer = countdownTimer;
    window.locationMap = locationMap;

    // Handle window resize for mobile menu
    window.addEventListener("resize", () => {
        mobileNavigation.handleResize();
    });

    // Optional: Add keyboard shortcut for testing countdown (Ctrl+Shift+T)
    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === "T") {
            // Set target date to 10 seconds from now for testing
            const testDate = new Date(Date.now() + 10000);
            countdownTimer.updateTargetDate(testDate);
            console.log("Countdown set to 10 seconds for testing");
        }
    });
});
