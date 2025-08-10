// Gallery functionality using GLightbox library

document.addEventListener("DOMContentLoaded", function () {
    // Initialize GLightbox
    const lightbox = GLightbox({
        touchNavigation: true,
        loop: true,
        openEffect: "zoom",
        closeEffect: "zoom",
        slideEffect: "slide",
        moreText: "Lihat lebih banyak",
        moreLength: 60,
        closeButton: true,
        touchFollowAxis: true,
        keyboardNavigation: true,
        closeOnOutsideClick: true,
        width: "900px",
        height: "506px",
    });

    // Add hover effects to gallery items
    const galleryItems = document.querySelectorAll(".gallery-item");
    galleryItems.forEach((item) => {
        const photoCard = item.querySelector(".photo-card");
        if (photoCard) {
            photoCard.addEventListener("mouseenter", function () {
                this.style.transform = "translateY(-8px)";
            });

            photoCard.addEventListener("mouseleave", function () {
                this.style.transform = "translateY(0)";
            });
        }
    });
});
