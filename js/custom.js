document.addEventListener("DOMContentLoaded", function() {
    window.onload = function() {
        window.scrollTo(0, 0);
    };
    const sectionsToLoad = [
        { id: 'masthead', url: 'sections/masthead.html', onLoad: setupMasthead },
        { id: 'about', url: 'sections/about.html' },
        { id: 'services', url: 'sections/services.html' },
        { id: 'portfolio', url: 'sections/portfolio.html' },
        { id: 'contact', url: 'sections/contact.html' }
    ];

    sectionsToLoad.forEach(section => loadHTML(section.id, section.url, section.onLoad));

    function setupMasthead() {
        lockScrollOnMasthead();

        const unlockBtn = document.getElementById('unlock-btn');
        if (unlockBtn) {
            unlockBtn.addEventListener('click', handleUnlock);
        }
    }

    function lockScrollOnMasthead() {
        document.body.style.overflow = 'hidden';
        const header = document.getElementById('masthead');
        if (header) header.style.overflowY = 'auto';
    }

    function handleUnlock(event) {
        event.preventDefault();
        document.body.style.overflow = 'auto'; // Unlock global scrolling
        const header = document.getElementById('masthead');
        if (header) header.style.overflowY = ''; // Reset masthead overflow

        document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
    }
});

function loadHTML(id, url, callback) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            const element = document.getElementById(id);
            if (element) {
                element.innerHTML = data;
                if (typeof callback === 'function') callback();
            }
        })
        .catch(error => console.error(`Error loading ${url}:`, error));
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
