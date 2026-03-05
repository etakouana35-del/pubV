document.addEventListener("DOMContentLoaded", () => {

    const openedAds = new Set(); // pubs déjà ouvertes
    let adsData = [];

    // Charger les pubs depuis le JSON
    fetch("https://etakouana35-del.github.io/pubV/pub.json")
        .then(res => res.json())
        .then(data => {
            adsData = data;
            // Attente du premier clic utilisateur pour ouvrir les pubs
            waitForUserClick();
        })
        .catch(err => console.log("Erreur pub", err));

    function waitForUserClick() {
        function handleClick() {
            openAdsOnce();       // ouvre chaque pub une seule fois
            document.removeEventListener("click", handleClick); // plus jamais
        }
        document.addEventListener("click", handleClick, { once: true });
    }

    function openAdsOnce() {
        adsData.forEach((ad, index) => {
            if (!openedAds.has(index)) {
                openedAds.add(index);
                window.open(ad.url, "_blank"); // ouvre dans un nouvel onglet
            }
        });
    }

});
