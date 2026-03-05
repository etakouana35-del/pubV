// ads.js universel
document.addEventListener("DOMContentLoaded", () => {
    const container = document.createElement("div");
    container.id = "ads-container";
    container.style.position = "fixed";
    container.style.bottom = "10px";
    container.style.right = "10px";
    container.style.zIndex = "9999";
    container.style.background = "#000";
    container.style.padding = "10px";
    container.style.borderRadius = "8px";
    container.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
    document.body.appendChild(container);

    fetch("https://etakouana35-del.github.io/pubV/pub.json")
        .then(res => res.json())
        .then(data => {
            // Choisir une pub aléatoire
            const ad = data[Math.floor(Math.random() * data.length)];

            if(ad.type === "video") {
                const video = document.createElement("video");
                video.src = ad.url;
                video.autoplay = true;
                video.muted = true;
                video.loop = ad.loop || false;
                video.style.maxWidth = "300px";
                video.style.maxHeight = "200px";
                video.style.borderRadius = "8px";
                container.appendChild(video);
            } else if(ad.type === "link") {
                const link = document.createElement("a");
                link.href = ad.url;
                link.textContent = ad.text || "Cliquez ici !";
                link.target = "_blank";
                link.style.color = "#00f";
                link.style.textDecoration = "underline";
                container.appendChild(link);
            }
        })
        .catch(err => console.error("Erreur chargement pub : ", err));
});
