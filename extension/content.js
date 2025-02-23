(function() {
    // Vérifie si la vidéo existe
    const waitForVideoTitle = setInterval(() => {
        const videoTitle = document.querySelector('#title h1');
        if (videoTitle) {
            clearInterval(waitForVideoTitle);
            injectButton(videoTitle);
        }
    }, 1000);

    // Injection du bouton "Résumé" sous le titre de la vidéo
    function injectButton(videoTitle) {
        const summaryButton = document.createElement('button');
        summaryButton.innerText = '📄 Résumé w kadhe kadhe';
        Object.assign(summaryButton.style, {
            padding: '6px 10px',
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '12px',
            marginTop: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            transition: 'background-color 0.3s, transform 0.3s',
            animation: 'fadeIn 0.5s'
        });

        summaryButton.addEventListener('mouseover', () => {
            summaryButton.style.backgroundColor = '#0056b3';
            summaryButton.style.transform = 'scale(1.05)';
        });
        summaryButton.addEventListener('mouseout', () => {
            summaryButton.style.backgroundColor = '#007BFF';
            summaryButton.style.transform = 'scale(1)';
        });

        videoTitle.appendChild(summaryButton);

        // Créer la sidebar
        const summaryPanel = document.createElement('div');
        summaryPanel.id = 'summaryPanel';
        summaryPanel.innerHTML = `
            <button id="closeSummary">❌</button>
            <h1 style="font-size:28px; border-bottom:2px solid #007BFF; padding-bottom:8px; margin-bottom:15px;">Résumé de la vidéo</h1>
            <div id="loading" class="hidden" style="text-align:center; font-weight:bold; font-size:20px; color: #FFD700;">⏳ Chargement...</div>
            <div id="summary" class="summary-box" style="font-size:20px; line-height:1.6; color: #f0f0f0;"></div>
        `;

        Object.assign(summaryPanel.style, {
            position: 'fixed',
            top: '0',
            right: '0',
            width: '450px',
            height: '100%',
            background: '#1c1c1c',
            color: 'white',
            padding: '25px',
            boxShadow: '-6px 0px 12px rgba(0, 0, 0, 0.5)',
            overflowY: 'auto',
            transform: 'translateX(100%)',
            transition: 'transform 0.4s ease',
            zIndex: '9999',
            borderLeft: '4px solid #007BFF',
            borderRadius: '20px 0 0 20px',
            fontFamily: 'Arial, sans-serif'
        });

        document.body.appendChild(summaryPanel);

        // Bouton fermer
        const closeButton = summaryPanel.querySelector('#closeSummary');
        Object.assign(closeButton.style, {
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'red',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            fontSize: '20px',
            width: '35px',
            height: '35px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background-color 0.3s'
        });

        closeButton.addEventListener('mouseover', () => {
            closeButton.style.backgroundColor = '#ff4d4d';
        });
        closeButton.addEventListener('mouseout', () => {
            closeButton.style.backgroundColor = 'red';
        });

        // Ouvrir la sidebar
        summaryButton.addEventListener('click', () => {
            const videoUrl = window.location.href;
            const loading = summaryPanel.querySelector('#loading');
            const summaryBox = summaryPanel.querySelector('#summary');

            summaryPanel.style.transform = 'translateX(0)';
            loading.classList.remove('hidden');
            summaryBox.innerHTML = '';

            fetch(`http://localhost:5000/video_summary?url=${encodeURIComponent(videoUrl)}`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => response.json())
            .then(data => {
                summaryBox.innerHTML = `<h2 style="font-size:24px; margin-bottom:10px; color: #FFD700;">Résumé général</h2><p>${data.summary || "Résumé indisponible."}</p>`;

                if (data.chapters && data.chapters.length > 0) {
                    const chaptersContainer = document.createElement('div');
                    chaptersContainer.innerHTML = '<h2 style="font-size:24px; margin-top:20px; color: #FFD700;">Chapitres</h2>';

                    data.chapters.forEach(chapter => {
                        const chapterElement = document.createElement('div');
                        chapterElement.classList.add('chapter');
                        Object.assign(chapterElement.style, {
                            padding: '10px 0',
                            borderBottom: '1px solid #555'
                        });

                        const chapterLink = document.createElement('span');
                        chapterLink.innerText = `⏩ ${chapter.start_time} - ${chapter.title}`;
                        chapterLink.style.color = '#007BFF';
                        chapterLink.style.fontWeight = 'bold';
                        chapterLink.style.cursor = 'pointer';
                        chapterLink.style.textDecoration = 'none';

                        // Garde la vidéo en cours et avance au bon moment sans ouvrir un nouvel onglet
                        chapterLink.addEventListener('click', () => {
                            const video = document.querySelector('video');
                            if (video) {
                                video.currentTime = timeToSeconds(chapter.start_time);
                                video.play();
                            }
                        });

                        const chapterSummary = document.createElement('p');
                        chapterSummary.innerText = chapter.chapter_summary;
                        chapterSummary.style.color = '#bbb';
                        chapterSummary.style.margin = '5px 0';

                        chapterElement.appendChild(chapterLink);
                        chapterElement.appendChild(chapterSummary);
                        chaptersContainer.appendChild(chapterElement);
                    });

                    summaryBox.appendChild(chaptersContainer);
                } else {
                    summaryBox.innerHTML += '<p>Aucun chapitre trouvé.</p>';
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
                summaryBox.innerText = 'Erreur lors de la récupération des données.';
            })
            .finally(() => {
                loading.classList.add('hidden');
            });
        });

        // Fermer la sidebar
        closeButton.addEventListener('click', () => {
            summaryPanel.style.transform = 'translateX(100%)';
        });
    }

    // Fonction pour convertir "00:02:35" en secondes
    function timeToSeconds(time) {
        const parts = time.split(":").map(Number);
        if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        return 0;
    }
})();