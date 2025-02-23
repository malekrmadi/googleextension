chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url && tab.url.includes("youtube.com/watch")) {
        console.log("Nouvelle vidéo détectée :", tab.url);
    }
});
