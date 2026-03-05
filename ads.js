document.addEventListener("DOMContentLoaded", () => {

let adsData = [];
let currentIndex = 0;
const rotationTime = 15000;
const autoOpenTime = 20000;

/* CONTENEUR */

const container = document.createElement("div");

Object.assign(container.style,{
position:"fixed",
top:"50%",
left:"50%",
transform:"translate(-50%,-50%)",
width:"420px",
height:"300px",
background:"rgba(0,0,0,0.9)",
borderRadius:"10px",
overflow:"hidden",
zIndex:"9999",
boxShadow:"0 0 25px rgba(0,0,0,0.9)",
transition:"all 0.8s ease"
});

document.body.appendChild(container);

/* TITRE */

const title = document.createElement("div");
title.textContent="CLIQUER SUR LA PUBLICITÉ";

Object.assign(title.style,{
color:"#fff",
background:"#e60000",
textAlign:"center",
fontWeight:"bold",
padding:"8px",
fontSize:"18px"
});

container.appendChild(title);

/* BOUTON FERMER */

const closeBtn = document.createElement("div");
closeBtn.innerHTML="✕";

Object.assign(closeBtn.style,{
position:"absolute",
top:"5px",
right:"10px",
color:"#fff",
cursor:"pointer",
fontSize:"20px"
});

closeBtn.onclick=()=>container.remove();

container.appendChild(closeBtn);

/* ZONE PUB */

const adArea=document.createElement("div");

Object.assign(adArea.style,{
width:"100%",
height:"calc(100% - 40px)"
});

container.appendChild(adArea);

/* DEPLACEMENT PUB */

setTimeout(()=>{

Object.assign(container.style,{
top:"auto",
left:"auto",
transform:"none",
bottom:"20px",
right:"20px"
});

},5000);

/* YOUTUBE */

function getYoutubeId(url){
let regExp=/^(?:.*v=|youtu\.be\/)([^&]+)/;
let match=url.match(regExp);
return match?match[1]:null;
}

/* AFFICHAGE PUB */

function showAd(){

if(adsData.length===0) return;

const ad=adsData[currentIndex];

adArea.innerHTML="";

/* VIDEO */

if(ad.type==="video"){

if(ad.url.includes("youtube")){

const id=getYoutubeId(ad.url);

const iframe=document.createElement("iframe");

iframe.src=`https://www.youtube.com/embed/${id}?autoplay=1&mute=1`;

Object.assign(iframe.style,{
width:"100%",
height:"100%",
border:"none"
});

adArea.appendChild(iframe);

}else{

const video=document.createElement("video");

video.src=ad.url;
video.autoplay=true;
video.muted=true;
video.loop=true;
video.controls=true;

Object.assign(video.style,{
width:"100%",
height:"100%"
});

adArea.appendChild(video);

}

}

/* LIEN */

if(ad.type==="link"){

const wrapper=document.createElement("div");

Object.assign(wrapper.style,{
position:"relative",
width:"100%",
height:"100%"
});

const iframe=document.createElement("iframe");

iframe.src=ad.url;

Object.assign(iframe.style,{
width:"100%",
height:"100%",
border:"none"
});

const overlay=document.createElement("div");

Object.assign(overlay.style,{
position:"absolute",
top:"0",
left:"0",
width:"100%",
height:"100%",
cursor:"pointer"
});

overlay.onclick=()=>window.open(ad.url,"_blank");

wrapper.appendChild(iframe);
wrapper.appendChild(overlay);

adArea.appendChild(wrapper);

/* OUVERTURE AUTO */

setTimeout(()=>{
window.open(ad.url,"_blank");
},autoOpenTime);

}

/* ROTATION */

currentIndex++;

if(currentIndex>=adsData.length){
currentIndex=0;
}

setTimeout(showAd,rotationTime);

}

/* CHARGEMENT JSON */

fetch("https://etakouana35-del.github.io/pubV/pub.json")
.then(res=>res.json())
.then(data=>{
adsData=data;
showAd();
})
.catch(err=>{
console.log("Erreur pub",err);
});

});
