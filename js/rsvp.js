// RSVP Form Validation and Handling
// Implements real-time validation, form submission, and localStorage persistence

/**
 * RSVP Form Controller
 * Handles form validation, submission, and data persistence
 */
class RSVPFormController {
    constructor() {
        this.form = document.getElementById("rsvp-form");
        this.successMessage = document.getElementById("rsvp-success");
        this.submitButton = document.getElementById("rsvp-submit");
        this.guestCountGroup = document.getElementById("guest-count-group");

        // Form fields
        this.fields = {
            name: document.getElementById("rsvp-name"),
            email: document.getElementById("rsvp-email"),
            attendance: document.getElementsByName("attendance"),
            guestCount: document.getElementById("rsvp-guests"),
            message: document.getElementById("rsvp-message"),
        };

        // Error containers
        this.errorContainers = {
            name: document.getElementById("name-error"),
            email: document.getElementById("email-error"),
            attendance: document.getElementById("attendance-error"),
            guests: document.getElementById("guests-error"),
            message: document.getElementById("message-error"),
        };

        // Validation rules
        this.validationRules = {
            name: {
                required: true,
                minLength: 2,
                maxLength: 100,
                pattern: /^[a-zA-Z\s\u00C0-\u017F\u0100-\u024F\u1E00-\u1EFF]+$/,
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            },
            attendance: {
                required: true,
            },
        };

        this.init();
    }

    init() {
        if (!this.form) return;

        this.setupEventListeners();
        this.setupCharacterCounter();
        this.loadSavedData();
    }

    /**
     * Setup all event listeners for form validation and interaction
     */
    setupEventListeners() {
        // Real-time validation on input
        this.fields.name.addEventListener("input", () =>
            this.validateField("name")
        );
        this.fields.name.addEventListener("blur", () =>
            this.validateField("name")
        );

        this.fields.email.addEventListener("input", () =>
            this.validateField("email")
        );
        this.fields.email.addEventListener("blur", () =>
            this.validateField("email")
        );

        // Attendance radio buttons
        this.fields.attendance.forEach((radio) => {
            radio.addEventListener("change", () => {
                this.validateField("attendance");
                this.toggleGuestCountVisibility();
            });
        });

        // Guest count validation
        this.fields.guestCount.addEventListener("change", () =>
            this.validateField("guests")
        );

        // Message field character counter
        this.fields.message.addEventListener("input", () => {
            this.updateCharacterCounter();
            this.validateField("message");
        });

        // Form submission
        this.form.addEventListener("submit", (e) => this.handleSubmit(e));

        // Auto-save form data
        this.form.addEventListener("input", () => this.autoSaveFormData());
        this.form.addEventListener("change", () => this.autoSaveFormData());
    }

    /**
     * Setup character counter for message field
     */
    setupCharacterCounter() {
        const counter = document.getElementById("message-count");
        const maxLength = this.fields.message.getAttribute("maxlength") || 500;

        this.updateCharacterCounter = () => {
            const currentLength = this.fields.message.value.length;
            counter.textContent = currentLength;

            // Visual feedback for character limit
            if (currentLength > maxLength * 0.9) {
                counter.style.color = "#dc2626";
            } else if (currentLength > maxLength * 0.7) {
                counter.style.color = "#f59e0b";
            } else {
                counter.style.color = "#6b7280";
            }
        };
    }

    /**
     * Validate individual form field
     * @param {string} fieldName - Name of the field to validate
     * @returns {boolean} - Validation result
     */
    validateField(fieldName) {
        const field = this.fields[fieldName];
        const errorContainer = this.errorContainers[fieldName];
        const rules = this.validationRules[fieldName];

        if (!field || !errorContainer) return true;

        let isValid = true;
        let errorMessage = "";

        // Handle radio button group validation
        if (fieldName === "attendance") {
            const selectedValue = this.getSelectedRadioValue("attendance");
            if (rules.required && !selectedValue) {
                isValid = false;
                errorMessage = "Mohon pilih konfirmasi kehadiran Anda";
            }
        } else {
            const value = field.value.trim();

            // Required field validation
            if (rules.required && !value) {
                isValid = false;
                errorMessage = `${this.getFieldLabel(fieldName)} wajib diisi`;
            }
            // Length validation
            else if (
                value &&
                rules.minLength &&
                value.length < rules.minLength
            ) {
                isValid = false;
                errorMessage = `${this.getFieldLabel(fieldName)} minimal ${
                    rules.minLength
                } karakter`;
            } else if (
                value &&
                rules.maxLength &&
                value.length > rules.maxLength
            ) {
                isValid = false;
                errorMessage = `${this.getFieldLabel(fieldName)} maksimal ${
                    rules.maxLength
                } karakter`;
            }
            // Pattern validation
            else if (value && rules.pattern && !rules.pattern.test(value)) {
                isValid = false;
                if (fieldName === "email") {
                    errorMessage = "Format email tidak valid";
                } else if (fieldName === "name") {
                    errorMessage =
                        "Nama hanya boleh mengandung huruf dan spasi";
                }
            }
            // Email duplicate check
            else if (
                fieldName === "email" &&
                value &&
                this.isEmailAlreadyRegistered(value)
            ) {
                isValid = false;
                errorMessage =
                    "Email ini sudah terdaftar. Gunakan email lain atau hubungi penyelenggara.";
            }
        }

        // Update UI based on validation result
        this.updateFieldValidationUI(
            field,
            errorContainer,
            isValid,
            errorMessage
        );

        return isValid;
    }

    /**
     * Update field UI based on validation state
     */
    updateFieldValidationUI(field, errorContainer, isValid, errorMessage) {
        // Handle radio button group
        if (field.length && field[0].type === "radio") {
            const radioLabels = document.querySelectorAll(
                `input[name="${field[0].name}"] + .radio-label`
            );
            radioLabels.forEach((label) => {
                label.classList.remove("error");
            });

            if (!isValid) {
                radioLabels.forEach((label) => {
                    label.classList.add("error");
                });
            }
        } else {
            // Handle regular input fields
            field.classList.remove("error", "success");

            if (!isValid) {
                field.classList.add("error");
            } else if (field.value.trim()) {
                field.classList.add("success");
            }
        }

        // Update error message
        errorContainer.textContent = errorMessage;
        errorContainer.style.display = errorMessage ? "block" : "none";
    }

    /**
     * Get selected radio button value
     */
    getSelectedRadioValue(name) {
        const selectedRadio = document.querySelector(
            `input[name="${name}"]:checked`
        );
        return selectedRadio ? selectedRadio.value : null;
    }

    /**
     * Get user-friendly field label
     */
    getFieldLabel(fieldName) {
        const labels = {
            name: "Nama lengkap",
            email: "Email",
            attendance: "Konfirmasi kehadiran",
            guests: "Jumlah tamu",
            message: "Pesan",
        };
        return labels[fieldName] || fieldName;
    }

    /**
     * Toggle guest count field visibility based on attendance selection
     */
    toggleGuestCountVisibility() {
        const attendanceValue = this.getSelectedRadioValue("attendance");

        if (attendanceValue === "yes") {
            this.guestCountGroup.classList.add("show");
            this.fields.guestCount.setAttribute("required", "required");
        } else {
            this.guestCountGroup.classList.remove("show");
            this.fields.guestCount.removeAttribute("required");
            this.fields.guestCount.value = "1"; // Reset to default
        }
    }

    /**
     * Validate entire form
     * @returns {boolean} - Overall form validation result
     */
    validateForm() {
        let isFormValid = true;

        // Validate all required fields
        Object.keys(this.validationRules).forEach((fieldName) => {
            const fieldValid = this.validateField(fieldName);
            if (!fieldValid) {
                isFormValid = false;
            }
        });

        // Additional validation for guest count if attendance is yes
        const attendanceValue = this.getSelectedRadioValue("attendance");
        if (attendanceValue === "yes") {
            const guestCountValid = this.validateField("guests");
            if (!guestCountValid) {
                isFormValid = false;
            }
        }

        return isFormValid;
    }

    /**
     * Handle form submission
     */
    async handleSubmit(event) {
        event.preventDefault();

        // Validate form before submission
        if (!this.validateForm()) {
            this.showFormStatus("Mohon perbaiki kesalahan pada form", "error");
            this.focusFirstError();
            return;
        }

        // Show loading state
        this.setSubmitButtonLoading(true);

        try {
            // Simulate form processing delay
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Collect form data
            const formData = this.collectFormData();

            // Save to localStorage (task 10.3 will implement this)
            this.saveRSVPData(formData);

            // Show success message
            this.showSuccessMessage();

            // Clear auto-saved data
            this.clearAutoSavedData();
        } catch (error) {
            console.error("RSVP submission error:", error);
            this.showFormStatus(
                "Terjadi kesalahan saat mengirim konfirmasi. Silakan coba lagi.",
                "error"
            );
        } finally {
            this.setSubmitButtonLoading(false);
        }
    }

    /**
     * Collect form data into structured object
     */
    collectFormData() {
        const attendanceValue = this.getSelectedRadioValue("attendance");

        return {
            id: Date.now().toString(), // Simple ID generation
            name: this.fields.name.value.trim(),
            email: this.fields.email.value.trim(),
            attendance: attendanceValue === "yes",
            guestCount:
                attendanceValue === "yes"
                    ? parseInt(this.fields.guestCount.value)
                    : 0,
            message: this.fields.message.value.trim(),
            timestamp: new Date().toISOString(),
            submittedAt: new Date().toLocaleString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }),
        };
    }

    /**
     * Set submit button loading state
     */
    setSubmitButtonLoading(isLoading) {
        const btnText = this.submitButton.querySelector(".btn-text");
        const btnLoading = this.submitButton.querySelector(".btn-loading");

        if (isLoading) {
            btnText.style.display = "none";
            btnLoading.style.display = "flex";
            this.submitButton.disabled = true;
        } else {
            btnText.style.display = "block";
            btnLoading.style.display = "none";
            this.submitButton.disabled = false;
        }
    }

    /**
     * Show form status message
     */
    showFormStatus(message, type = "info") {
        const statusElement = document.getElementById("submit-status");
        statusElement.textContent = message;
        statusElement.className = `form-status ${type}`;
        statusElement.style.display = "block";

        // Auto-hide after 5 seconds
        setTimeout(() => {
            statusElement.style.display = "none";
        }, 5000);
    }

    /**
     * Focus on first field with error
     */
    focusFirstError() {
        const firstErrorField = this.form.querySelector(".error, input.error");
        if (firstErrorField) {
            firstErrorField.focus();
            firstErrorField.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }

    /**
     * Show success message and hide form
     */
    showSuccessMessage() {
        // Update success message with current statistics
        const stats = this.getRSVPStatistics();
        const successMessageElement =
            this.successMessage.querySelector(".success-message");

        if (successMessageElement) {
            const attendanceText =
                this.getSelectedRadioValue("attendance") === "yes"
                    ? "hadir"
                    : "tidak dapat hadir";
            const guestCount =
                this.getSelectedRadioValue("attendance") === "yes"
                    ? parseInt(this.fields.guestCount.value)
                    : 0;

            let message = `Konfirmasi kehadiran Anda telah berhasil dikirim. `;
            message += `Anda telah mengkonfirmasi bahwa Anda akan ${attendanceText}`;

            if (guestCount > 1) {
                message += ` dengan ${guestCount} orang tamu`;
            }

            message += `. Kami sangat menantikan kehadiran Anda di hari bahagia kami.`;

            // Add statistics if there are multiple responses
            if (stats.totalResponses > 1) {
                message += `\n\nTotal konfirmasi: ${stats.totalResponses} orang, `;
                message += `${stats.attendingCount} akan hadir (${stats.totalGuests} tamu).`;
            }

            successMessageElement.textContent = message;
        }

        this.form.style.display = "none";
        this.successMessage.style.display = "block";
        this.successMessage.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    }

    /**
     * Auto-save form data to localStorage for recovery
     */
    autoSaveFormData() {
        const formData = {
            name: this.fields.name.value,
            email: this.fields.email.value,
            attendance: this.getSelectedRadioValue("attendance"),
            guestCount: this.fields.guestCount.value,
            message: this.fields.message.value,
            savedAt: Date.now(),
        };

        try {
            localStorage.setItem("rsvp_draft", JSON.stringify(formData));
        } catch (error) {
            console.warn("Could not save form data:", error);
        }
    }

    /**
     * Load previously saved form data
     */
    loadSavedData() {
        try {
            const savedData = localStorage.getItem("rsvp_draft");
            if (!savedData) return;

            const data = JSON.parse(savedData);

            // Only load if saved within last 24 hours
            const dayInMs = 24 * 60 * 60 * 1000;
            if (Date.now() - data.savedAt > dayInMs) {
                localStorage.removeItem("rsvp_draft");
                return;
            }

            // Restore form values
            if (data.name) this.fields.name.value = data.name;
            if (data.email) this.fields.email.value = data.email;
            if (data.message) this.fields.message.value = data.message;
            if (data.guestCount) this.fields.guestCount.value = data.guestCount;

            // Restore radio button selection
            if (data.attendance) {
                const radioButton = document.querySelector(
                    `input[name="attendance"][value="${data.attendance}"]`
                );
                if (radioButton) {
                    radioButton.checked = true;
                    this.toggleGuestCountVisibility();
                }
            }

            // Update character counter
            this.updateCharacterCounter();
        } catch (error) {
            console.warn("Could not load saved form data:", error);
            localStorage.removeItem("rsvp_draft");
        }
    }

    /**
     * Clear auto-saved draft data
     */
    clearAutoSavedData() {
        try {
            localStorage.removeItem("rsvp_draft");
        } catch (error) {
            console.warn("Could not clear saved data:", error);
        }
    }

    /**
     * Save RSVP data to localStorage with error handling
     */
    saveRSVPData(formData) {
        try {
            // Get existing RSVP data
            const existingData = this.getRSVPData();

            // Add new RSVP entry
            existingData.push(formData);

            // Save to localStorage
            localStorage.setItem(
                "wedding_rsvp_data",
                JSON.stringify(existingData)
            );

            // Update statistics
            this.updateRSVPStatistics(existingData);

            console.log("RSVP data saved successfully:", formData);
        } catch (error) {
            console.error("Error saving RSVP data:", error);

            // Handle storage quota exceeded
            if (error.name === "QuotaExceededError") {
                this.handleStorageQuotaExceeded();
            } else {
                throw error; // Re-throw other errors
            }
        }
    }

    /**
     * Get all RSVP data from localStorage
     * @returns {Array} Array of RSVP entries
     */
    getRSVPData() {
        try {
            const data = localStorage.getItem("wedding_rsvp_data");
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error("Error reading RSVP data:", error);
            return [];
        }
    }

    /**
     * Update RSVP statistics in localStorage
     */
    updateRSVPStatistics(rsvpData) {
        try {
            const stats = {
                totalResponses: rsvpData.length,
                attendingCount: rsvpData.filter((entry) => entry.attendance)
                    .length,
                notAttendingCount: rsvpData.filter((entry) => !entry.attendance)
                    .length,
                totalGuests: rsvpData.reduce(
                    (sum, entry) => sum + (entry.guestCount || 0),
                    0
                ),
                lastUpdated: new Date().toISOString(),
            };

            localStorage.setItem("wedding_rsvp_stats", JSON.stringify(stats));
            console.log("RSVP statistics updated:", stats);
        } catch (error) {
            console.error("Error updating RSVP statistics:", error);
        }
    }

    /**
     * Handle localStorage quota exceeded error
     */
    handleStorageQuotaExceeded() {
        try {
            // Try to free up space by removing old draft data
            const keysToRemove = ["rsvp_draft"];
            keysToRemove.forEach((key) => {
                localStorage.removeItem(key);
            });

            // Try to save again with reduced data
            const existingData = this.getRSVPData();

            // Keep only the most recent 100 entries to prevent storage issues
            const maxEntries = 100;
            if (existingData.length >= maxEntries) {
                const trimmedData = existingData.slice(-maxEntries + 1);
                localStorage.setItem(
                    "wedding_rsvp_data",
                    JSON.stringify(trimmedData)
                );
            }

            throw new Error(
                "Penyimpanan penuh. Data lama telah dihapus, silakan coba lagi."
            );
        } catch (cleanupError) {
            console.error("Error during storage cleanup:", cleanupError);
            throw new Error(
                "Penyimpanan penuh. Silakan hubungi penyelenggara untuk konfirmasi manual."
            );
        }
    }

    /**
     * Check if email already exists in RSVP data
     * @param {string} email - Email to check
     * @returns {boolean} True if email exists
     */
    isEmailAlreadyRegistered(email) {
        const existingData = this.getRSVPData();
        return existingData.some(
            (entry) => entry.email.toLowerCase() === email.toLowerCase()
        );
    }

    /**
     * Get RSVP statistics
     * @returns {Object} Statistics object
     */
    getRSVPStatistics() {
        try {
            const stats = localStorage.getItem("wedding_rsvp_stats");
            return stats
                ? JSON.parse(stats)
                : {
                      totalResponses: 0,
                      attendingCount: 0,
                      notAttendingCount: 0,
                      totalGuests: 0,
                      lastUpdated: null,
                  };
        } catch (error) {
            console.error("Error reading RSVP statistics:", error);
            return {
                totalResponses: 0,
                attendingCount: 0,
                notAttendingCount: 0,
                totalGuests: 0,
                lastUpdated: null,
            };
        }
    }

    /**
     * Export RSVP data as JSON (for backup/admin purposes)
     * @returns {string} JSON string of all RSVP data
     */
    exportRSVPData() {
        try {
            const data = {
                rsvpEntries: this.getRSVPData(),
                statistics: this.getRSVPStatistics(),
                exportedAt: new Date().toISOString(),
                version: "1.0",
            };

            return JSON.stringify(data, null, 2);
        } catch (error) {
            console.error("Error exporting RSVP data:", error);
            return null;
        }
    }

    /**
     * Clear all RSVP data (admin function)
     */
    clearAllRSVPData() {
        try {
            localStorage.removeItem("wedding_rsvp_data");
            localStorage.removeItem("wedding_rsvp_stats");
            localStorage.removeItem("rsvp_draft");
            console.log("All RSVP data cleared");
        } catch (error) {
            console.error("Error clearing RSVP data:", error);
        }
    }
}

/**
 * Reset RSVP form to allow new submission
 */
function resetRSVPForm() {
    const form = document.getElementById("rsvp-form");
    const successMessage = document.getElementById("rsvp-success");

    // Reset form
    form.reset();

    // Clear validation states
    form.querySelectorAll(".error, .success").forEach((element) => {
        element.classList.remove("error", "success");
    });

    // Clear error messages
    form.querySelectorAll(".error-message").forEach((element) => {
        element.textContent = "";
        element.style.display = "none";
    });

    // Hide guest count group
    document.getElementById("guest-count-group").classList.remove("show");

    // Reset character counter
    document.getElementById("message-count").textContent = "0";

    // Show form and hide success message
    form.style.display = "block";
    successMessage.style.display = "none";

    // Scroll to form
    form.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Global utility functions for RSVP data management (for debugging/admin)
window.RSVPUtils = {
    /**
     * Get all RSVP data (for admin/debugging)
     */
    getAllRSVPData() {
        try {
            const data = localStorage.getItem("wedding_rsvp_data");
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error("Error reading RSVP data:", error);
            return [];
        }
    },

    /**
     * Get RSVP statistics (for admin/debugging)
     */
    getRSVPStats() {
        try {
            const stats = localStorage.getItem("wedding_rsvp_stats");
            return stats ? JSON.parse(stats) : null;
        } catch (error) {
            console.error("Error reading RSVP statistics:", error);
            return null;
        }
    },

    /**
     * Export RSVP data as downloadable JSON file
     */
    downloadRSVPData() {
        try {
            const data = {
                rsvpEntries: this.getAllRSVPData(),
                statistics: this.getRSVPStats(),
                exportedAt: new Date().toISOString(),
                version: "1.0",
            };

            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], { type: "application/json" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `wedding-rsvp-data-${
                new Date().toISOString().split("T")[0]
            }.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            console.log("RSVP data exported successfully");
        } catch (error) {
            console.error("Error exporting RSVP data:", error);
        }
    },

    /**
     * Clear all RSVP data (admin function)
     */
    clearAllData() {
        if (
            confirm(
                "Apakah Anda yakin ingin menghapus semua data RSVP? Tindakan ini tidak dapat dibatalkan."
            )
        ) {
            try {
                localStorage.removeItem("wedding_rsvp_data");
                localStorage.removeItem("wedding_rsvp_stats");
                localStorage.removeItem("rsvp_draft");
                console.log("All RSVP data cleared");
                alert("Semua data RSVP telah dihapus.");
            } catch (error) {
                console.error("Error clearing RSVP data:", error);
                alert("Terjadi kesalahan saat menghapus data.");
            }
        }
    },

    /**
     * Display RSVP statistics in console
     */
    showStats() {
        const stats = this.getRSVPStats();
        const data = this.getAllRSVPData();

        console.log("=== RSVP Statistics ===");
        console.log("Total Responses:", stats?.totalResponses || 0);
        console.log("Attending:", stats?.attendingCount || 0);
        console.log("Not Attending:", stats?.notAttendingCount || 0);
        console.log("Total Guests:", stats?.totalGuests || 0);
        console.log("Last Updated:", stats?.lastUpdated || "Never");
        console.log("======================");

        if (data.length > 0) {
            console.log("Recent Entries:");
            data.slice(-5).forEach((entry, index) => {
                console.log(
                    `${index + 1}. ${entry.name} (${entry.email}) - ${
                        entry.attendance ? "Hadir" : "Tidak Hadir"
                    } - ${entry.guestCount || 0} tamu`
                );
            });
        }
    },
};

// Initialize RSVP form when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    new RSVPFormController();

    // Add console helper message
    console.log(
        "RSVP Form initialized. Use RSVPUtils.showStats() to view statistics or RSVPUtils.downloadRSVPData() to export data."
    );
});
