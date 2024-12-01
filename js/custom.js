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
        setInvitedName();

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

    function setInvitedName() {
        const urlParams = new URLSearchParams(window.location.search);
        const invited = urlParams.get('invited');
        const partner = urlParams.get('partner');
    
        if (invited && partner) {
            const capitalizedInvited = capitalizeFirstLetter(invited);
            const capitalizedPartner = capitalizeFirstLetter(partner);
            document.getElementById('invited').innerHTML = `<p class="text-white-75">${capitalizedInvited} & ${capitalizedPartner}</p>`;
        }
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

function capitalizeFirstLetter(str) {
    if (!str) return str; // Check if the string is empty
    return str.charAt(0).toUpperCase() + str.slice(1);
}
