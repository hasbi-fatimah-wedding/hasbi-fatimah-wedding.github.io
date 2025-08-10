// Simple Gallery using GLightbox library
// Much simpler and more reliable than custom implementation

document.addEventListener("DOMContentLoaded", function () {
    console.log("Initializing GLightbox gallery...");

    // Initialize GLightbox
    const lightbox = GLightbox({
        touchNavigation: true,
        loop: true,
        autoplayVideos: true,
        plyr: {
            config: {
                ratio: "16:9",
                youtube: {
                    noCookie: true,
                    rel: 0,
                    showinfo: 0,
                    iv_load_policy: 3,
                },
                vimeo: {
                    byline: false,
                    portrait: false,
                    title: false,
                    speed: true,
                    transparent: false,
                },
            },
        },
        openEffect: "zoom",
        closeEffect: "zoom",
        slideEffect: "slide",
        moreText: "Lihat lebih banyak",
        moreLength: 60,
        closeButton: true,
        touchFollowAxis: true,
        keyboardNavigation: true,
        closeOnOutsideClick: true,
        startAt: null,
        width: "900px",
        height: "506px",
        videosWidth: "960px",
        beforeSlideChange: null,
        afterSlideChange: null,
        beforeSlideLoad: null,
        afterSlideLoad: null,
        slideInserted: null,
        slideRemoved: null,
        slideExtraAttributes: null,
        onOpen: function () {
            console.log("Gallery opened");
        },
        onClose: function () {
            console.log("Gallery closed");
        },
    });

    console.log("GLightbox initialized successfully");

    // Make lightbox globally accessible for debugging
    window.galleryLightbox = lightbox;

    // Add some hover effects to gallery items
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
