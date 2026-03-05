fetch("https://TON_GITHUB_USERNAME.github.io/GOODDAVNET-ADS-GH/pub.json")
.then(res => res.json())
.then(data => {
    if(!data.video) return;

    let popup = document.createElement("div");
    popup.style.position="fixed";
    popup.style.top="0";
    popup.style.left="0";
    popup.style.width="100%";
    popup.style.height="100%";
    popup.style.background="rgba(0,0,0,0.8)";
    popup.style.display="flex";
    popup.style.alignItems="center";
    popup.style.justifyContent="center";
    popup.style.zIndex="9999";

    let content = `<div style="background:white;padding:20px;text-align:center;border-radius:10px;">
    <h3>Publicité Ets GOOD DAV NET</h3>`;

    if(data.type === "mp4"){
        content += `<video width="420" autoplay muted controls>
        <source src="${data.video}" type="video/mp4">
        </video>`;
    } else if(data.type === "youtube"){
        // transformer lien YouTube en embed
        let videoID = data.video.split("v=")[1] || data.video.split(".be/")[1];
        if(videoID.includes("&")) videoID = videoID.split("&")[0];
        content += `<iframe width="420" height="236" src="https://www.youtube.com/embed/${videoID}?autoplay=1&mute=1"
        frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    }

    content += `<br><br><button onclick="this.parentElement.parentElement.remove()"
    style="background:red;color:white;border:none;padding:5px 10px;cursor:pointer;">Fermer</button></div>`;

    popup.innerHTML = content;
    document.body.appendChild(popup);
});