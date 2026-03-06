document.addEventListener("DOMContentLoaded", () => {

    const STORAGE_KEY = "openedAdsList";
    const DELAY_BETWEEN = 2000; // 2 secondes entre chaque pub
    let adsData = [];
    let openedAds = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    // Charger les pubs depuis le JSON
    fetch("https://etakouana35-del.github.io/pubV/pub.json")
        .then(res => res.json())
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) return;
            adsData = data;
            openAdsSequentially(0);
        })
        .catch(err => console.log("Erreur pub :", err));

    function openAdsSequentially(index) {
        if (index >= adsData.length) return;

        const ad = adsData[index];

        // Si la pub n'a pas encore été ouverte
        if (!openedAds.includes(index) && ad.url) {
            openedAds.push(index);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(openedAds));

            if (ad.type === "link") {
                window.open(ad.url, "_blank");
            } else if (ad.type === "video") {
                openVideoAd(ad);
            }
        }

        // Appel récursif pour la pub suivante après 2 secondes
        setTimeout(() => {
            openAdsSequentially(index + 1);
        }, DELAY_BETWEEN);
    }

    function openVideoAd(ad) {
        const videoWindow = window.open("", "_blank", "width=800,height=450");
        if (!videoWindow) return;

        let videoHTML = "";

        if (ad.url.includes("youtube.com") || ad.url.includes("youtu.be")) {
            const videoId = extractYouTubeID(ad.url);
            if (videoId) {
                videoHTML = `<iframe width="100%" height="100%" 
                    src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" 
                    frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
                    </iframe>`;
            } else {
                videoHTML = `<p>URL YouTube invalide</p>`;
            }
        } else {
            const loopAttr = ad.loop ? "loop" : "";
            videoHTML = `<video src="${ad.url}" autoplay ${loopAttr} controls style="width:100%;height:100%;"></video>`;
        }

        videoWindow.document.write(`
            <html>
                <head>
                    <title>Publicité vidéo</title>
                    <style>body{margin:0;background:#000;display:flex;justify-content:center;align-items:center;height:100vh;}</style>
                </head>
                <body>${videoHTML}</body>
            </html>
        `);
        videoWindow.document.close();
    }

    function extractYouTubeID(url) {
        let match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        return match ? match[1] : null;
    }

});
