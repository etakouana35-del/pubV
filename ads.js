document.addEventListener("DOMContentLoaded", () => {

    let adsData = [];
    let currentIndex = 0;
    let container;

    const autoNextTime = 5000; // temps avant d'afficher la prochaine pub automatiquement
    const reopenTime = 500;    // délai après fermeture

    function createAdContainer() {
        container = document.createElement("div");

        Object.assign(container.style, {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            background: "rgba(0,0,0,0.9)",
            borderRadius: "12px",
            overflow: "hidden",
            zIndex: "9999",
            boxShadow: "0 0 30px rgba(0,0,0,0.9)",
            transition: "all 0.8s ease"
        });

        function resizeAd() {
            if (window.innerWidth < 768) {
                container.style.width = "90%";
                container.style.height = "70%";
            } else {
                container.style.width = "420px";
                container.style.height = "300px";
            }
        }

        resizeAd();
        window.addEventListener("resize", resizeAd);
        document.body.appendChild(container);

        // TITRE
        const title = document.createElement("div");
        title.textContent = "CLIQUER SUR LA PUBLICITÉ";
        Object.assign(title.style, {
            color: "#fff",
            background: "#e60000",
            textAlign: "center",
            fontWeight: "bold",
            padding: "10px",
            fontSize: "18px"
        });
        container.appendChild(title);

        // BOUTON FERMER
        const closeBtn = document.createElement("div");
        closeBtn.innerHTML = "✕";
        Object.assign(closeBtn.style, {
            position: "absolute",
            top: "6px",
            right: "10px",
            color: "#fff",
            cursor: "pointer",
            fontSize: "20px"
        });

        closeBtn.onclick = () => {
            container.remove();
            clearTimeout(container.autoNextTimeout); // annuler l’auto-next en cours
            currentIndex++;
            if (currentIndex < adsData.length) {
                setTimeout(() => {
                    createAdContainer();
                    showAd();
                }, reopenTime);
            }
        };

        container.appendChild(closeBtn);

        // ZONE PUB
        const adArea = document.createElement("div");
        Object.assign(adArea.style, {
            width: "100%",
            height: "calc(100% - 45px)"
        });
        container.appendChild(adArea);

        return adArea;
    }

    function getYoutubeId(url) {
        const regExp = /^(?:.*v=|youtu\.be\/)([^&]+)/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    }

    function showAd() {
        if (currentIndex >= adsData.length) return;

        const ad = adsData[currentIndex];
        const adArea = container.querySelector("div:last-child");
        adArea.innerHTML = "";

        // VIDEO
        if (ad.type === "video") {
            if (ad.url.includes("youtube")) {
                const id = getYoutubeId(ad.url);
                const iframe = document.createElement("iframe");
                iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`;
                Object.assign(iframe.style, {
                    width: "100%",
                    height: "100%",
                    border: "none"
                });
                adArea.appendChild(iframe);
            } else {
                const video = document.createElement("video");
                video.src = ad.url;
                video.autoplay = true;
                video.muted = true;
                video.loop = true;
                video.controls = true;
                Object.assign(video.style, {
                    width: "100%",
                    height: "100%"
                });
                adArea.appendChild(video);
            }
        }

        // LIEN
        if (ad.type === "link") {
            const wrapper = document.createElement("div");
            Object.assign(wrapper.style, {
                position: "relative",
                width: "100%",
                height: "100%"
            });

            const iframe = document.createElement("iframe");
            iframe.src = ad.url;
            Object.assign(iframe.style, {
                width: "100%",
                height: "100%",
                border: "none"
            });

            const overlay = document.createElement("div");
            Object.assign(overlay.style, {
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                cursor: "pointer"
            });

            overlay.onclick = () => window.open(ad.url, "_blank");

            wrapper.appendChild(iframe);
            wrapper.appendChild(overlay);
            adArea.appendChild(wrapper);
        }

        // AUTO-OPEN NEXT PUB
        container.autoNextTimeout = setTimeout(() => {
            container.remove();
            currentIndex++;
            if (currentIndex < adsData.length) {
                createAdContainer();
                showAd();
            }
        }, autoNextTime);
    }

    // CHARGEMENT PUB
    fetch("https://etakouana35-del.github.io/pubV/pub.json")
        .then(res => res.json())
        .then(data => {
            adsData = data;
            if (adsData.length > 0) {
                createAdContainer();
                showAd();
            }
        })
        .catch(err => console.log("Erreur pub", err));

});
