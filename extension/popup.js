document.getElementById("getDetails").addEventListener("click", () => {
    const button = document.getElementById("getDetails");
    const loading = document.getElementById("loading");
    const summaryBox = document.getElementById("summary");

    // Affiche le loader et désactive le bouton
    loading.classList.remove("hidden");
    button.disabled = true;
    summaryBox.innerText = "";

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
            summaryBox.innerText = data.summary || "Résumé indisponible.";
        })
        .catch(error => {
            console.error("Erreur:", error);
            summaryBox.innerText = "Erreur lors de la récupération du résumé.";
        })
        .finally(() => {
            loading.classList.add("hidden");
            button.disabled = false;
        });
    });
});
