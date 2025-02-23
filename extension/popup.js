document.getElementById("fetch-summary").addEventListener("click", () => {
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
            document.getElementById("summary").innerText = data.summary || "Résumé indisponible.";
        })
        .catch(error => console.error('Erreur:', error));
    });
});
