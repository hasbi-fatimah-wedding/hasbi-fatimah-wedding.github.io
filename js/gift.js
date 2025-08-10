/**
 * Gift Information Section JavaScript
 * Handles copy-to-clipboard functionality for bank account numbers
 */

/**
 * Copy text to clipboard with visual feedback
 * @param {string} elementId - ID of the element containing text to copy
 * @param {HTMLElement} button - The copy button element
 */
function copyToClipboard(elementId, button) {
    const element = document.getElementById(elementId);
    const text = element.textContent.trim();

    // Use modern Clipboard API if available
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                showCopySuccess(button, text);
            })
            .catch((err) => {
                console.error("Failed to copy text: ", err);
                fallbackCopyTextToClipboard(text, button);
            });
    } else {
        // Fallback for older browsers or non-secure contexts
        fallbackCopyTextToClipboard(text, button);
    }
}

/**
 * Fallback copy method for older browsers
 * @param {string} text - Text to copy
 * @param {HTMLElement} button - The copy button element
 */
function fallbackCopyTextToClipboard(text, button) {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand("copy");
        if (successful) {
            showCopySuccess(button, text);
        } else {
            showCopyError(button);
        }
    } catch (err) {
        console.error("Fallback: Oops, unable to copy", err);
        showCopyError(button);
    }

    document.body.removeChild(textArea);
}

/**
 * Show success feedback when copy is successful
 * @param {HTMLElement} button - The copy button element
 * @param {string} text - The copied text
 */
function showCopySuccess(button, text) {
    const originalText = button.querySelector(".copy-text").textContent;
    const copyText = button.querySelector(".copy-text");

    // Add success class and change text
    button.classList.add("copied");
    copyText.textContent = "Tersalin!";

    // Create and show toast notification
    showToast(`Nomor rekening berhasil disalin: ${text}`, "success");

    // Reset button after 2 seconds
    setTimeout(() => {
        button.classList.remove("copied");
        copyText.textContent = originalText;
    }, 2000);
}

/**
 * Show error feedback when copy fails
 * @param {HTMLElement} button - The copy button element
 */
function showCopyError(button) {
    const originalText = button.querySelector(".copy-text").textContent;
    const copyText = button.querySelector(".copy-text");

    // Add error styling and change text
    button.style.background = "#dc3545";
    copyText.textContent = "Gagal!";

    // Show error toast
    showToast(
        "Gagal menyalin nomor rekening. Silakan salin secara manual.",
        "error"
    );

    // Reset button after 2 seconds
    setTimeout(() => {
        button.style.background = "";
        copyText.textContent = originalText;
    }, 2000);
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of toast (success, error, info)
 */
function showToast(message, type = "info") {
    // Remove existing toast if any
    const existingToast = document.querySelector(".toast-notification");
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement("div");
    toast.className = `toast-notification toast-${type}`;
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "polite");

    // Toast content
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-icon">
                ${getToastIcon(type)}
            </div>
            <div class="toast-message">${message}</div>
            <button class="toast-close" onclick="closeToast(this)" aria-label="Tutup notifikasi">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
    `;

    // Add toast to page
    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
        toast.classList.add("show");
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        closeToast(toast);
    }, 5000);
}

/**
 * Get icon for toast notification
 * @param {string} type - Type of toast
 * @returns {string} SVG icon HTML
 */
function getToastIcon(type) {
    const icons = {
        success: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        error: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        info: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
    };

    return icons[type] || icons.info;
}

/**
 * Close toast notification
 * @param {HTMLElement} element - Toast element or close button
 */
function closeToast(element) {
    const toast = element.classList.contains("toast-notification")
        ? element
        : element.closest(".toast-notification");
    if (toast) {
        toast.classList.add("hide");
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }
}

/**
 * Initialize gift section functionality
 */
function initGiftSection() {
    // Add keyboard support for copy buttons
    const copyButtons = document.querySelectorAll(".copy-btn");
    copyButtons.forEach((button) => {
        button.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                button.click();
            }
        });
    });

    // Add focus styles for accessibility
    copyButtons.forEach((button) => {
        button.addEventListener("focus", () => {
            button.style.outline = "2px solid var(--gold)";
            button.style.outlineOffset = "2px";
        });

        button.addEventListener("blur", () => {
            button.style.outline = "";
            button.style.outlineOffset = "";
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initGiftSection);
