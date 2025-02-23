console.log("Content script chargé.");

// Fonction pour récupérer l'URL actuelle de la vidéo YouTube
function getVideoUrl() {
    return window.location.href;
}

// Fonction pour appeler l'API Flask
function fetchSummary() {
    const videoUrl = getVideoUrl();
    
    fetch(`http://localhost:5000/video_summary?url=${encodeURIComponent(videoUrl)}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("Résumé :", data.summary);
        displaySummary(data.summary);
    })
    .catch(error => console.error('Erreur lors de la récupération du résumé:', error));
}

// Fonction pour afficher le résumé sous la vidéo
function displaySummary(summary) {
    let container = document.querySelector("#summary-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "summary-container";
        container.style.padding = "10px";
        container.style.marginTop = "10px";
        container.style.background = "#f9f9f9";
        container.style.border = "1px solid #ccc";
        container.style.borderRadius = "5px";
        document.querySelector("#above-the-fold").appendChild(container);
    }
    container.innerHTML = `<h3>Résumé de la vidéo :</h3><p>${summary}</p>`;
}

// Ajoute un bouton pour récupérer le résumé
const button = document.createElement("button");
button.innerText = "Obtenir le résumé";
button.style.marginTop = "10px";
button.style.padding = "10px";
button.style.background = "#ff0000";
button.style.color = "#fff";
button.style.border = "none";
button.style.borderRadius = "5px";
button.style.cursor = "pointer";
button.addEventListener("click", fetchSummary);

document.querySelector("#above-the-fold").appendChild(button);
