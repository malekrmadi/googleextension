// popup.js
document.getElementById('getSummary').addEventListener('click', () => {
    const url = document.getElementById('urlInput').value;
    fetch('http://localhost:5000/summary', {  // Assurez-vous que l'URL correspond à votre API
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: url })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('summary').innerText = data.summary;
    })
    .catch(error => console.error('Erreur:', error));
});