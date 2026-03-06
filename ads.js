document.addEventListener("DOMContentLoaded", () => {

    const STORAGE_KEY = "openedAdsList";
    let adsData = [];
    let openedAds = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const DELAY_BETWEEN = 2000; // 2 secondes entre chaque pub

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
        // fin si toutes les pubs ont été traitées
        if (index >= adsData.length) return;

        // ignorer les pubs déjà ouvertes
        if (!openedAds.includes(index)) {
            openedAds.push(index);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(openedAds));

            // ouvrir la pub dans un nouvel onglet
            if (adsData[index].url) {
                window.open(adsData[index].url, "_blank");
            }
        }

        // passer à la pub suivante après un délai
        setTimeout(() => {
            openAdsSequentially(index + 1);
        }, DELAY_BETWEEN);
    }

});
