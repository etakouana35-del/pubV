document.addEventListener("DOMContentLoaded", () => {
    const container = document.createElement("div");
    container.id = "ads-container";
    Object.assign(container.style, {
        position: "fixed",
        zIndex: "9999",
        background: "rgba(0,0,0,0.85)",
        padding: "10px",
        borderRadius: "10px",
        boxShadow: "0 0 15px rgba(0,0,0,0.6)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "90%",
        maxHeight: "80%",
        overflowY: "auto",
        transition: "opacity 0.5s ease",
        bottom: "10px",
        right: "10px",
        opacity: "1"
    });
    document.body.appendChild(container);

    // Bouton de fermeture
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "×";
    Object.assign(closeBtn.style, {
        position: "absolute",
        top: "5px",
        right: "5px",
        background: "transparent",
        color: "#fff",
        border: "none",
        fontSize: "20px",
        cursor: "pointer"
    });
    closeBtn.addEventListener("click", () => container.remove());
    container.appendChild(closeBtn);

    function adjustForScreen() {
        if(window.innerWidth <= 768){
            Object.assign(container.style, {
                left: "5px",
                right: "5px",
                bottom: "5px",
                maxWidth: "calc(100% - 10px)",
                maxHeight: "50%"
            });
        } else {
            Object.assign(container.style, {
                right: "10px",
                bottom: "10px",
                maxWidth: "300px",
                maxHeight: "200px"
            });
        }
    }
    adjustForScreen();
    window.addEventListener("resize", adjustForScreen);

    function getYouTubeID(url) {
        const match = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
        return match ? match[1] : null;
    }

    fetch("https://etakouana35-del.github.io/pubV/pub.json")
        .then(res => res.json())
        .then(data => {
            if(!data || data.length === 0){
                container.textContent = "Aucune pub disponible.";
                return;
            }

            let currentIndex = 0;
            const rotationTime = 15000; // 15 secondes par pub

            function showAd(index) {
                const ad = data[index];

                // Fade out container
                container.style.opacity = "0";

                setTimeout(() => {
                    // Supprimer toutes les pubs existantes (sauf le bouton)
                    container.querySelectorAll(":not(button)").forEach(el => el.remove());

                    // Ajouter la pub
                    if(ad.type === "video"){
                        if(ad.url.includes("youtube.com") || ad.url.includes("youtu.be")){
                            const videoId = getYouTubeID(ad.url);
                            if(videoId){
                                const iframe = document.createElement("iframe");
                                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=${ad.loop ? 1 : 0}&playlist=${ad.loop ? videoId : ""}`;
                                Object.assign(iframe.style, { width: "100%", height: "auto", borderRadius: "10px" });
                                iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                                iframe.allowFullscreen = true;
                                container.appendChild(iframe);
                            }
                        } else {
                            const video = document.createElement("video");
                            video.src = ad.url;
                            video.autoplay = true;
                            video.muted = true;
                            video.loop = ad.loop || false;
                            video.controls = true;
                            video.style.width = "100%";
                            video.style.height = "auto";
                            video.style.borderRadius = "10px";
                            container.appendChild(video);
                        }
                    } else if(ad.type === "link"){
                        const link = document.createElement("a");
                        link.href = ad.url;
                        link.textContent = ad.text || "Cliquez ici !";
                        link.target = "_blank";
                        Object.assign(link.style, {
                            display: "inline-block",
                            padding: "8px 12px",
                            backgroundColor: "#007BFF",
                            color: "#fff",
                            borderRadius: "5px",
                            textAlign: "center",
                            textDecoration: "none",
                            fontWeight: "bold",
                            marginTop: "5px"
                        });
                        container.appendChild(link);
                    }

                    // Fade in container
                    container.style.opacity = "1";

                    // Passer à la pub suivante
                    currentIndex = (currentIndex + 1) % data.length;
                    setTimeout(() => showAd(currentIndex), rotationTime);

                }, 500); // transition fade
            }

            // Lancer la première pub
            showAd(currentIndex);
        })
        .catch(err => {
            console.error("Erreur chargement pub : ", err);
            container.textContent = "Erreur chargement pub";
        });
});
