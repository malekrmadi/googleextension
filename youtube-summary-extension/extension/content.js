// content.js
console.log("Content script loaded.");

// Fonction pour récupérer l'URL de la vidéo YouTube
function getVideoUrl() {
    const videoUrl = window.location.href;
    return videoUrl;
}

// Appel de l'API pour obtenir le résumé
function fetchSummary(url) {
    fetch('http://localhost:5000/summary', {  // Assurez-vous que l'URL correspond à votre API
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: url })
    })
    .then(response => response.json())
    .then(data => {
        // Logique pour afficher le résumé
        console.log(data.summary);
    })
    .catch(error => console.error('Erreur:', error));
}

// Exemple d'utilisation
const videoUrl = getVideoUrl();
fetchSummary(videoUrl);