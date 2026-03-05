document.addEventListener("DOMContentLoaded", () => {

    let adsData = [];
    let currentIndex = 0;

    const autoOpenTime = 0; // ouverture immédiate
    const displayDuration = 7000; // durée avant suppression du conteneur du site (ms)

    function showNextAd() {
        if (currentIndex >= adsData.length) return; // toutes les pubs affichées

        const ad = adsData[currentIndex];

        // ouvrir la pub dans une nouvelle fenêtre/onglet
        if (ad.type === "video" || ad.type === "link") {
            window.open(ad.url, "_blank");
        }

        // créer un petit conteneur visible temporairement sur le site (optionnel)
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

        // supprimer le conteneur du site après un certain temps
        setTimeout(() => {
            container.remove();
        }, displayDuration);

        currentIndex++;
        // ouvrir automatiquement la prochaine pub après un délai (pour enchaîner)
        setTimeout(showNextAd, autoOpenTime + 500); // 500ms entre les pubs
    }

    // charger les pubs depuis le fichier JSON
    fetch("https://etakouana35-del.github.io/pubV/pub.json")
        .then(res => res.json())
        .then(data => {
            adsData = data;
            if (adsData.length > 0) {
                showNextAd();
            }
        })
        .catch(err => console.log("Erreur pub", err));
});
