// ads.js universel amélioré

(function() {
    const PUB_JSON_URL = "https://etakouana35-del.github.io/pubV/pub.json"; // URL de ton pub.json
    const CHANGE_INTERVAL = 30000; // 30 secondes

    let currentIndex = 0;
    let adsData = [];

    // Crée le conteneur pub
    function createAdContainer() {
        let container = document.getElementById("ads-container");
        if (!container) {
            container = document.createElement("div");
            container.id = "ads-container";
            container.style.position = "fixed";
            container.style.bottom = "0";
            container.style.left = "0";
            container.style.width = "100%";
            container.style.backgroundColor = "#000000aa";
            container.style.display = "flex";
            container.style.justifyContent = "center";
            container.style.alignItems = "center";
            container.style.padding = "10px";
            container.style.zIndex = "9999";
            document.body.appendChild(container);
        }
        return container;
    }

    // Affiche une pub
    function displayAd(adData) {
        const container = createAdContainer();
        container.innerHTML = ""; // vide le container avant d'ajouter la pub

        if(adData.type === "video") {
            const video = document.createElement("video");
            video.src = adData.url;
            video.controls = true;
            video.autoplay = true;
            video.loop = adData.loop || false;
            video.style.maxHeight = "150px";
            video.style.width = "auto";
            container.appendChild(video);
        } else if(adData.type === "link") {
            const link = document.createElement("a");
            link.href = adData.url;
            link.textContent = adData.text || "Cliquez ici pour voir la pub";
            link.target = "_blank";
            link.style.color = "#fff";
            link.style.fontSize = "16px";
            container.appendChild(link);
        }
    }

    // Change de pub toutes les X secondes
    function startRotation() {
        if(adsData.length === 0) return;

        displayAd(adsData[currentIndex]);
        currentIndex = (currentIndex + 1) % adsData.length;

        setInterval(() => {
            displayAd(adsData[currentIndex]);
            currentIndex = (currentIndex + 1) % adsData.length;
        }, CHANGE_INTERVAL);
    }

    // Charger pub.json
    fetch(PUB_JSON_URL)
        .then(response => response.json())
        .then(data => {
            if(Array.isArray(data) && data.length > 0) {
                adsData = data;
                startRotation();
            } else {
                console.warn("Aucune pub trouvée dans pub.json");
            }
        })
        .catch(err => console.error("Erreur chargement pub.json :", err));
})();
