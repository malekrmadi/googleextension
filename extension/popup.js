document.getElementById('getSummary').addEventListener('click', () => {
    const button = document.getElementById('getSummary');
    const loading = document.getElementById('loading');
    const summaryBox = document.getElementById('summary');

    // Afficher le loader et désactiver le bouton
    loading.classList.remove('hidden');
    button.disabled = true;
    summaryBox.innerHTML = ''; // Effacer l'ancien résumé

    // Récupérer l'URL de l'onglet actif
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs || tabs.length === 0) return;

        const url = tabs[0].url;
        
        fetch(`http://localhost:5000/video_summary?url=${encodeURIComponent(url)}`)
            .then(response => response.json())
            .then(data => {
                // Affichage du résumé général
                summaryBox.innerHTML = `<h2>Résumé général</h2><p>${data.summary}</p>`;

                // Ajout de la section des chapitres
                if (data.chapters && data.chapters.length > 0) {
                    const chaptersContainer = document.createElement("div");
                    chaptersContainer.innerHTML = "<h2>Chapitres</h2>";
                    
                    data.chapters.forEach(chapter => {
                        const chapterElement = document.createElement("div");
                        chapterElement.style.marginBottom = "10px";

                        // Lien cliquable pour aller au chapitre
                        const chapterLink = document.createElement("a");
                        chapterLink.href = `${url}&t=${timeToSeconds(chapter.start_time)}`;
                        chapterLink.innerText = `⏩ ${chapter.start_time} - ${chapter.title}`;
                        chapterLink.style.display = "block";
                        chapterLink.style.color = "#007BFF";
                        chapterLink.style.fontWeight = "bold";
                        chapterLink.style.textDecoration = "none";
                        chapterLink.target = "_blank"; 

                        // Ajout du résumé du chapitre
                        const chapterSummary = document.createElement("p");
                        chapterSummary.innerText = chapter.chapter_summary;
                        chapterSummary.style.margin = "5px 0";

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
                console.error('Erreur:', error);
                summaryBox.innerHTML = "<p>Erreur lors de la récupération des données.</p>";
            })
            .finally(() => {
                loading.classList.add('hidden');
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
