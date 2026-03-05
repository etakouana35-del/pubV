// ads.js universel complet
document.addEventListener("DOMContentLoaded", () => {
    // Création du conteneur de pub
    const container = document.createElement("div");
    container.id = "ads-container";
    container.style.position = "fixed";
    container.style.zIndex = "9999";
    container.style.background = "rgba(0,0,0,0.85)";
    container.style.padding = "10px";
    container.style.borderRadius = "10px";
    container.style.boxShadow = "0 0 15px rgba(0,0,0,0.6)";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";
    container.style.maxWidth = "90%";
    container.style.maxHeight = "80%";
    container.style.overflow = "auto";
    container.style.transition = "all 0.3s ease";
    document.body.appendChild(container);

    // Ajustement responsive
    function adjustForScreen() {
        if(window.innerWidth <= 768){ // mobile
            container.style.left = "5px";
            container.style.right = "5px";
            container.style.bottom = "5px";
            container.style.maxWidth = "calc(100% - 10px)";
            container.style.maxHeight = "50%";
        } else { // desktop
            container.style.right = "10px";
            container.style.bottom = "10px";
            container.style.maxWidth = "300px";
            container.style.maxHeight = "200px";
        }
    }
    adjustForScreen();
    window.addEventListener("resize", adjustForScreen);

    // Récupération des pubs depuis pub.json
    fetch("https://etakouana35-del.github.io/pubV/pub.json")
        .then(res => res.json())
        .then(data => {
            if(!data || data.length === 0) return;

            // Choisir une pub aléatoire
            const ad = data[Math.floor(Math.random() * data.length)];

            if(ad.type === "video") {
                // Si YouTube, créer un iframe embed
                if(ad.url.includes("youtube.com") || ad.url.includes("youtu.be")) {
                    let embedUrl = ad.url
                        .replace("watch?v=", "embed/")
                        .replace("youtu.be/", "www.youtube.com/embed/");
                    const iframe = document.createElement("iframe");
                    iframe.src = embedUrl + "?autoplay=1&mute=1&loop=" + (ad.loop ? "1" : "0") + "&playlist=" + (ad.loop ? embedUrl.split("/").pop() : "");
                    iframe.width = "300";
                    iframe.height = "200";
                    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                    iframe.allowFullscreen = true;
                    iframe.style.borderRadius = "10px";
                    container.appendChild(iframe);
                } else { // vidéo directe
                    const video = document.createElement("video");
                    video.src = ad.url;
                    video.autoplay = true;
                    video.muted = true;
                    video.loop = ad.loop || false;
                    video.style.width = "100%";
                    video.style.height = "auto";
                    video.style.borderRadius = "10px";
                    container.appendChild(video);
                }
            } else if(ad.type === "link") {
                const link = document.createElement("a");
                link.href = ad.url;
                link.textContent = ad.text || "Cliquez ici !";
                link.target = "_blank";
                link.style.color = "#00f";
                link.style.fontWeight = "bold";
                link.style.textDecoration = "underline";
                link.style.fontSize = "16px";
                container.appendChild(link);
            }
        })
        .catch(err => console.error("Erreur chargement pub : ", err));
});
