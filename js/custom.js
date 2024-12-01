document.addEventListener("DOMContentLoaded", function() {
    loadHTML('mainNav', 'sections/nav.html');
    loadHTML('masthead', 'sections/masthead.html');
    loadHTML('about', 'sections/about.html');
    loadHTML('services', 'sections/services.html');
    loadHTML('portfolio', 'sections/portfolio.html');
    loadHTML('contact', 'sections/contact.html');

    let param = get_param_url();
    console.log(param);
});

// Function to load HTML partials
function loadHTML(elementId, filePath) {
fetch(filePath)
    .then(response => {
    if (!response.ok) throw new Error("Failed to load " + filePath);
    return response.text();
    })
    .then(data => {
    document.getElementById(elementId).innerHTML = data;
    })
    .catch(error => console.error(error));
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
