console.log("Content script chargé.");

// Fonction pour récupérer l'URL de la vidéo en cours
function getVideoUrl() {
    return window.location.href;
}

// Fonction pour récupérer les détails via l'API Flask
function fetchVideoDetails() {
    const videoUrl = getVideoUrl();

    // Affichage du loader
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
    container.innerHTML = "<p>Chargement...</p>";

    fetch(`http://localhost:5000/video_summary?url=${encodeURIComponent(videoUrl)}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("Détails de la vidéo :", data);
        container.innerHTML = `<h3>Détails de la vidéo :</h3><p>${data.summary}</p>`;
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des détails:', error);
        container.innerHTML = "<p>Erreur lors de la récupération des détails.</p>";
    });
}

// Ajoute un bouton sous la vidéo pour obtenir les détails
const button = document.createElement("button");
button.innerText = "Obtenir les détails de la vidéo";
button.style.marginTop = "10px";
button.style.padding = "10px";
button.style.background = "#ff0000";
button.style.color = "#fff";
button.style.border = "none";
button.style.borderRadius = "5px";
button.style.cursor = "pointer";
button.addEventListener("click", fetchVideoDetails);

// Ajoute le bouton sous la vidéo
document.querySelector("#above-the-fold").appendChild(button);
