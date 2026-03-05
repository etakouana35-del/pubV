document.addEventListener("DOMContentLoaded", () => {

    let adsData = [];
    let currentIndex = 0;
    const autoOpenTime = 0; // ouverture immédiate
    const displayDuration = 7000; // durée du conteneur visible (ms)

    function showNextAd() {
        if (currentIndex >= adsData.length) return; // toutes les pubs affichées

        const ad = adsData[currentIndex];

        // vérifier si la pub a déjà été ouverte
        if (!ad.opened) {
            // ouvrir la pub dans un nouvel onglet
            if (ad.type === "video" || ad.type === "link") {
                window.open(ad.url, "_blank");
            }

            // créer un petit conteneur visible temporairement
            const container = document.createElement("div");
            Object.assign(container.style, {
                position: "fixed",
                top: "10px",
                right: "10px",
                width: "300px",
                height: "200px",
                background: "rgba(0,0,0,0.8)",
                color: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "16px",
                borderRadius: "10px",
                zIndex: "9999",
                textAlign: "center",
                padding: "10px"
            });
            container.textContent = "Publicité ouverte dans un nouvel onglet";
            document.body.appendChild(container);

            // supprimer le conteneur après displayDuration
            setTimeout(() => {
                container.remove();
            }, displayDuration);

            ad.opened = true; // marquer la pub comme ouverte
        }

        currentIndex++;
        // passer à la prochaine pub
        setTimeout(showNextAd, autoOpenTime + 500);
    }

    // charger les pubs depuis le JSON
    fetch("https://etakouana35-del.github.io/pubV/pub.json")
        .then(res => res.json())
        .then(data => {
            adsData = data.map(ad => ({ ...ad, opened: false })); // ajouter le flag opened
            if (adsData.length > 0) {
                showNextAd();
            }
        })
        .catch(err => console.log("Erreur pub", err));
});
