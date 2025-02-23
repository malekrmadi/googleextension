// popup.js
document.getElementById('getSummary').addEventListener('click', () => {
    const url = document.getElementById('urlInput').value;
    const button = document.getElementById('getSummary');
    const loading = document.getElementById('loading');
    const summaryBox = document.getElementById('summary');

    // Show loading indicator and disable button
    loading.classList.remove('hidden');
    button.disabled = true;
    summaryBox.innerText = ''; // Clear previous summary

    fetch('http://localhost:5000/video_summary', {  // Ensure the URL matches your API
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: url })
    })
    .then(response => response.json())
    .then(data => {
        // Display the summary
        summaryBox.innerText = data.summary;
    })
    .catch(error => {
        console.error('Erreur:', error);
        summaryBox.innerText = "Erreur lors de la récupération du résumé.";
    })
    .finally(() => {
        // Hide loading indicator and enable button
        loading.classList.add('hidden');
        button.disabled = false;
    });
});