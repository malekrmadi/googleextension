console.log("Content script chargé.");

// Vérifie si la page est une vidéo YouTube
function isYouTubeVideoPage() {
    return window.location.href.includes("youtube.com/watch");
}

// Fonction pour récupérer l'URL de la vidéo en cours
function getVideoUrl() {
    return window.location.href;
}

// Fonction pour ajouter un bouton "Résumé" à côté du titre de la vidéo
function addSummaryButton() {
    if (!isYouTubeVideoPage()) return;

    // Vérifie si le bouton existe déjà
    if (document.getElementById("summary-btn")) return;

    // Sélectionne le conteneur du titre de la vidéo (mutation observer friendly)
    let titleContainer = document.querySelector("#title");
    if (!titleContainer) return;

    // Création du bouton
    const button = document.createElement("button");
    button.id = "summary-btn";
    button.innerText = "📖 Résumé";
    button.style.marginLeft = "10px";
    button.style.padding = "8px 12px";
    button.style.fontSize = "14px";
    button.style.background = "#007BFF";
    button.style.color = "#fff";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.style.fontWeight = "bold";

    // Ajout d'un événement pour afficher le résumé
    button.addEventListener("click", toggleSummaryPanel);

    titleContainer.appendChild(button);
}

// Observer pour détecter les changements sur la page
const observer = new MutationObserver(() => {
    addSummaryButton();
});
observer.observe(document.body, { childList: true, subtree: true });

// Fonction pour afficher ou masquer le panneau de résumé
function toggleSummaryPanel() {
    let summaryPanel = document.getElementById("summary-panel");
    
    if (summaryPanel) {
        summaryPanel.style.display = summaryPanel.style.display === "none" ? "block" : "none";
    } else {
        fetchVideoSummary();
    }
}

// Fonction pour récupérer et afficher le résumé
function fetchVideoSummary() {
    const videoUrl = getVideoUrl();

    // Création du panneau latéral
    let summaryPanel = document.createElement("div");
    summaryPanel.id = "summary-panel";
    summaryPanel.style.position = "fixed";
    summaryPanel.style.top = "0";
    summaryPanel.style.right = "0";
    summaryPanel.style.width = "350px";
    summaryPanel.style.height = "100vh";
    summaryPanel.style.background = "white";
    summaryPanel.style.borderLeft = "2px solid #007BFF";
    summaryPanel.style.boxShadow = "rgba(0, 0, 0, 0.2) -2px 0 10px";
    summaryPanel.style.padding = "15px";
    summaryPanel.style.overflowY = "auto";
    summaryPanel.style.zIndex = "10000";
    summaryPanel.style.fontFamily = "Arial, sans-serif";

    // Bouton de fermeture
    let closeButton = document.createElement("button");
    closeButton.innerText = "❌";
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.style.background = "transparent";
    closeButton.style.border = "none";
    closeButton.style.fontSize = "18px";
    closeButton.style.cursor = "pointer";
    closeButton.addEventListener("click", () => {
        summaryPanel.style.display = "none";
    });

    // Loader
    let loadingText = document.createElement("p");
    loadingText.innerText = "Chargement du résumé...";
    summaryPanel.appendChild(closeButton);
    summaryPanel.appendChild(loadingText);
    document.body.appendChild(summaryPanel);

    // Appel API
    fetch(`http://localhost:5000/video_summary?url=${encodeURIComponent(videoUrl)}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        summaryPanel.innerHTML = ""; // On vide le loader
        summaryPanel.appendChild(closeButton);

        // Affichage du résumé
        let summaryTitle = document.createElement("h2");
        summaryTitle.innerText = "Résumé de la vidéo";
        summaryPanel.appendChild(summaryTitle);

        let summaryContent = document.createElement("p");
        summaryContent.innerText = data.summary || "Résumé indisponible.";
        summaryPanel.appendChild(summaryContent);

        // Affichage des chapitres
        if (data.chapters && data.chapters.length > 0) {
            let chaptersTitle = document.createElement("h3");
            chaptersTitle.innerText = "Chapitres";
            summaryPanel.appendChild(chaptersTitle);

            data.chapters.forEach(chapter => {
                let chapterElement = document.createElement("div");
                chapterElement.style.marginBottom = "10px";

                let chapterLink = document.createElement("a");
                chapterLink.href = "#";
                chapterLink.innerText = `⏩ ${chapter.start_time} - ${chapter.title}`;
                chapterLink.style.color = "#007BFF";
                chapterLink.style.fontWeight = "bold";
                chapterLink.style.display = "block";
                chapterLink.style.marginBottom = "5px";

                // Gérer le clic sur le lien sans recharger la page
                chapterLink.addEventListener("click", (event) => {
                    event.preventDefault();
                    const timeInSeconds = timeToSeconds(chapter.start_time);
                    const videoElement = document.querySelector("video");
                    if (videoElement) {
                        videoElement.currentTime = timeInSeconds;
                    }
                });

                let chapterSummary = document.createElement("p");
                chapterSummary.innerText = chapter.chapter_summary;
                chapterSummary.style.fontSize = "14px";
                chapterSummary.style.color = "#555";
                summaryPanel.appendChild(chapterElement);
                chapterElement.appendChild(chapterLink);
                chapterElement.appendChild(chapterSummary);
            });
        }
    })
    .catch(error => {
        console.error("Erreur:", error);
        summaryPanel.innerHTML = "<p>Erreur lors de la récupération des données.</p>";
        summaryPanel.appendChild(closeButton);
    });
}

// Fonction pour convertir "00:02:35" en secondes
function timeToSeconds(time) {
    const parts = time.split(":").map(Number);
    return parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : parts[0] * 60 + parts[1];
}

// Gestion du PWA - Installation
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault(); // Empêche l'affichage automatique de la bannière
    deferredPrompt = event; // Stocke l'événement pour plus tard
    console.log("Événement beforeinstallprompt capturé !");
    
    // Optionnel : affiche un bouton pour déclencher l'installation
    showInstallButton();
});

function showInstallButton() {
    const installButton = document.createElement("button");
    installButton.id = "install-btn";
    installButton.innerText = "Installer l'application";
    installButton.style.position = "fixed";
    installButton.style.bottom = "20px";
    installButton.style.right = "20px";
    installButton.style.padding = "10px";
    installButton.style.background = "#007BFF";
    installButton.style.color = "#fff";
    installButton.style.border = "none";
    installButton.style.borderRadius = "5px";
    installButton.style.cursor = "pointer";

    document.body.appendChild(installButton);

    installButton.addEventListener("click", () => {
        if (deferredPrompt) {
            deferredPrompt.prompt(); // Affiche la bannière d'installation
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === "accepted") {
                    console.log("L'utilisateur a installé l'application");
                } else {
                    console.log("L'utilisateur a refusé l'installation");
                }
                deferredPrompt = null; // Réinitialise l'événement
            });
        }
    });
}
