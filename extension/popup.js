document.getElementById("getDetails").addEventListener("click", () => {
    const button = document.getElementById("getDetails");
    const loading = document.getElementById("loading");
    const summaryBox = document.getElementById("summary");

    // Affiche le loader et désactive le bouton
    loading.classList.remove("hidden");
    button.disabled = true;
    summaryBox.innerHTML = ""; // On vide le contenu précédent

    // Récupère l'URL de la vidéo active
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) return;
        const videoUrl = tabs[0].url;

        fetch(`http://localhost:5000/video_summary?url=${encodeURIComponent(videoUrl)}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            // Affichage du résumé général
            summaryBox.innerHTML = `<h2>Résumé général</h2><p>${data.summary || "Résumé indisponible."}</p>`;

            // Affichage des chapitres
            if (data.chapters && data.chapters.length > 0) {
                const chaptersContainer = document.createElement("div");
                chaptersContainer.innerHTML = "<h2>Chapitres</h2>";

                data.chapters.forEach(chapter => {
                    const chapterElement = document.createElement("div");
                    chapterElement.classList.add("chapter");

                    // Lien cliquable pour naviguer vers le chapitre
                    const chapterLink = document.createElement("a");
                    chapterLink.href = `${videoUrl}&t=${timeToSeconds(chapter.start_time)}`;
                    chapterLink.innerText = `⏩ ${chapter.start_time} - ${chapter.title}`;
                    chapterLink.target = "_blank"; 
                    chapterLink.classList.add("chapter-link");

                    // Résumé du chapitre
                    const chapterSummary = document.createElement("p");
                    chapterSummary.innerText = chapter.chapter_summary;
                    chapterSummary.classList.add("chapter-summary");

                    chapterElement.appendChild(chapterLink);
                    chapterElement.appendChild(chapterSummary);
                    chaptersContainer.appendChild(chapterElement);
                });

                summaryBox.appendChild(chaptersContainer);
            } else {
                summaryBox.innerHTML += "<p>Aucun chapitre trouvé.</p>";
            }
        })
        .catch(error => {
            console.error("Erreur:", error);
            summaryBox.innerText = "Erreur lors de la récupération des données.";
        })
        .finally(() => {
            loading.classList.add("hidden");
            button.disabled = false;
        });
    });
});

// Fonction pour convertir "00:02:35" en secondes (155 secondes)
function timeToSeconds(time) {
    const parts = time.split(":").map(Number);
    if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
    }
    return 0;
}
