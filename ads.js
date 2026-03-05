document.addEventListener("DOMContentLoaded", () => {

    let adsData = [];
    let currentIndex = 0;

    // Création du conteneur (masqué au départ)
    const container = document.createElement("div");
    container.id = "ads-container";
    Object.assign(container.style, {
        position: "fixed",
        bottom: "10px",
        right: "10px",
        width: "320px",
        height: "220px",
        background: "rgba(0,0,0,0.9)",
        borderRadius: "10px",
        overflow: "hidden",
        zIndex: "9999",
        boxShadow: "0 0 15px rgba(0,0,0,0.7)",
        transition: "opacity 0.5s",
        display: "none" // masqué par défaut
    });
    document.body.appendChild(container);

    // Bouton de fermeture
    const closeBtn = document.createElement("div");
    closeBtn.innerHTML = "✕";
    Object.assign(closeBtn.style, {
        position: "absolute",
        top: "5px",
        right: "8px",
        color: "#fff",
        cursor: "pointer",
        fontSize: "18px",
        zIndex: "10"
    });
    closeBtn.onclick = () => container.style.display = "none";
    container.appendChild(closeBtn);

    const adArea = document.createElement("div");
    adArea.style.width = "100%";
    adArea.style.height = "100%";
    container.appendChild(adArea);

    function getYoutubeId(url) {
        let regExp = /^(?:.*v=|youtu\.be\/)([^&]+)/;
        let match = url.match(regExp);
        return match ? match[1] : null;
    }

    // Affichage d'une pub spécifique
    function showAd(index) {
        if (!adsData[index]) return;

        const ad = adsData[index];
        adArea.innerHTML = "";

        if (ad.type === "video") {
            if (ad.url.includes("youtube") || ad.url.includes("youtu.be")) {
                const id = getYoutubeId(ad.url);
                const iframe = document.createElement("iframe");
                iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`;
                iframe.allow = "autoplay";
                Object.assign(iframe.style, { width: "100%", height: "100%", border: "none" });
                adArea.appendChild(iframe);
            } else {
                const video = document.createElement("video");
                video.src = ad.url;
                video.autoplay = true;
                video.muted = true;
                video.loop = ad.loop || false;
                video.controls = true;
                Object.assign(video.style, { width: "100%", height: "100%" });
                adArea.appendChild(video);
            }
        }

        if (ad.type === "link") {
            const wrapper = document.createElement("div");
            Object.assign(wrapper.style, { position: "relative", width: "100%", height: "100%" });

            const iframe = document.createElement("iframe");
            iframe.src = ad.url;
            Object.assign(iframe.style, { width: "100%", height: "100%", border: "none" });

            const overlay = document.createElement("div");
            Object.assign(overlay.style, { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", cursor: "pointer" });
            overlay.onclick = () => window.open(ad.url, "_blank");

            wrapper.appendChild(iframe);
            wrapper.appendChild(overlay);
            adArea.appendChild(wrapper);
        }

        container.style.display = "block"; // afficher la pub
    }

    // Charger les pubs depuis le JSON
    fetch("https://etakouana35-del.github.io/pubV/pub.json")
        .then(res => res.json())
        .then(data => {
            adsData = data;

            // Ici tu peux créer un bouton pour afficher une pub à la demande
            const showButton = document.createElement("button");
            showButton.textContent = "Afficher Pub";
            Object.assign(showButton.style, {
                position: "fixed",
                bottom: "240px",
                right: "10px",
                zIndex: "9999",
                padding: "10px 15px",
                background: "#00f",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
            });
            document.body.appendChild(showButton);

            showButton.onclick = () => showAd(currentIndex++);
        })
        .catch(err => console.log("Erreur pub", err));

});
