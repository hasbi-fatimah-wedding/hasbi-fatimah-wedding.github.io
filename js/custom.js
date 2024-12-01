document.addEventListener("DOMContentLoaded", function() {
    loadHTML('masthead', 'sections/masthead.html', function() {
        // Lock scrolling on body, allow only masthead to scroll
        document.body.style.overflow = 'hidden';
        const header = document.getElementById('masthead');
        header.style.overflowY = 'auto'; // Only masthead scrolls initially

        // Ensure unlock button is present and add event listener
        const unlockBtn = document.getElementById('unlock-btn');
        unlockBtn.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default anchor jump
            document.body.style.overflow = 'auto'; // Unlock scrolling globally
            header.style.overflowY = ''; // Reset masthead scroll

            // Smoothly scroll to the about section
            document.querySelector('#about').scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Load other sections
    loadHTML('about', 'sections/about.html');
    loadHTML('services', 'sections/services.html');
    loadHTML('portfolio', 'sections/portfolio.html');
    loadHTML('contact', 'sections/contact.html');
});

function loadHTML(id, url, callback) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
            if (callback) callback(); // Call callback after content loads
        })
        .catch(error => console.error('Error loading HTML:', error));
}

// get url param
function get_param_url(){
    const urlParams = new URLSearchParams(window.location.search);
    const value = urlParams.get('id'); // Replace 'query' with the key you're looking for
    
    if (value) {
        return value;
    }
    
    return;
}
