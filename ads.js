document.addEventListener("DOMContentLoaded", () => {
    const displayDuration = 7000; // durée du conteneur visible
    const adsStorageKey = "ads_shown"; // clé pour stocker pubs déjà vues

    // récupérer pubs déjà affichées depuis localStorage
    const shownAds = JSON.parse(localStorage.getItem(adsStorageKey)) || [];

    fetch("https://etakouana35-del.github.io/pubV/pub.json")
        .then(res => res.json())
        .then(data => {
            // filtrer les pubs déjà vues
            const remainingAds = data.filter(ad => !shownAds.includes(ad.url));

            if (remainingAds.length === 0) return; // toutes pubs déjà vues

            // choisir une pub à afficher (tu peux randomiser ici si tu veux)
            const ad = remainingAds[0];

            // créer conteneur sur le site
            const container = document.createElement("div");
            Object.assign(container.style, {
                position: "fixed",
                top: "10px",
                right: "10px",
                width: "320px",
                height: "180px",
                background: "rgba(0,0,0,0.85)",
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "16px",
                borderRadius: "10px",
                zIndex: "9999",
                textAlign: "center",
                padding: "10px"
            });

            // si c'est une vidéo
            if (ad.type === "video") {
                const video = document.createElement("video");
                video.src = ad.url;
                video.width = 300;
                video.height = 150;
                video.autoplay = true;
                video.muted = true;
                video.controls = false;
                container.appendChild(video);
            } else {
                // sinon lien
                const link = document.createElement("a");
                link.href = ad.url;
                link.textContent = "Cliquez ici pour voir la publicité";
                link.target = "_blank";
                link.style.color = "#00f";
                container.appendChild(link);
            }

            document.body.appendChild(container);

            // supprimer après displayDuration
            setTimeout(() => container.remove(), displayDuration);

            // marquer pub comme vue
            shownAds.push(ad.url);
            localStorage.setItem(adsStorageKey, JSON.stringify(shownAds));
        })
        .catch(err => console.log("Erreur pub", err));
});
