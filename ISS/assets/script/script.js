/***************
  MAP LEAFLET
***************/

//Récupération de la carte avec un affichage de base aux coordoonées 0, 0 zoom à 5 sur Leaflet
const MAP = L.map('map').setView([0, 0], 5);

//Ajout des tuiles provenant de OpenStreetMap
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(MAP);

//Création de l'icone
const ISS_ICON = new L.Icon({
  iconUrl :'ISS/assets/img/international-space-station-icon.png',
  iconSize : [50,50],
  iconAnchor : [22,94]
});

//Création d'une variable contenant l'icone et avec un affichage aux coordonnées 0,0 sur la carte 
const MARKER = L.marker([0, 0], {icon: ISS_ICON}).addTo(MAP);

/*******************
  SUIVI ISS
*******************/

//Création d'une fonction async ( API)
async function issAPI(map,marker) {

//Récupération de l'API avec sécurité ( try et catch)
  try{
    const reponse = await fetch("http://api.open-notify.org/iss-now.json");
    const donnees = await reponse.json();

//Récupération des coordonnées de l'API dans les variables
    map.panTo([donnees.iss_position.latitude, donnees.iss_position.longitude],5);

    marker.setLatLng([donnees.iss_position.latitude, donnees.iss_position.longitude]);

  } catch (erreur){
      console.log("Une erreur est survenue:", erreur);
    }
}

// Création de la fonction setInterval qui permet de déplacer en temps réel l'icone et la vue de la carte toutes les 1 secondes
setInterval(() =>{    
    issAPI(MAP,MARKER);
},1000);

/***************
  METEO LOCALE
***************/

//Sélection de l'article dans le HTML
let card = document.querySelector(".cardMeteo");

//Sélection du boutton dans le HTML
let boutton = document.querySelector("button");

//Création du paragraphe
const paragraphe = document.createElement("p");

//Css de l'élément paragraphe dans le JS
paragraphe.setAttribute("style","height :300px;width : 200px; margin: 16px 0; border : 3px solid grey; padding : 16px 12px 24px 12px");

//Placement du paragraphe avant le bouton et aprés l'image
card.insertBefore(paragraphe, boutton);

//Création de la fonction addInfo(element, txt) avec la propriété innerText.
function addInfo(element, txt) {
    element.innerText = txt;
}

// Création de l'écouteur d'évent sur le bouton "Charger" qui interroge l'API Météo
boutton.addEventListener("click", async () => {
//Récupération de l'API avec sécurité ( try & catch)
    try {
        const reponse = await fetch("https://prevision-meteo.ch/services/json/toulouse");
        const donnees = await reponse.json();
//Création d'une variable qui récupère les données que nous voulons afficher et rajout du texte pour affichage
        const texteMeteo = "Aujourd'hui le temps est : "+ donnees.current_condition.condition + " , la température actuelle est de "+ donnees.current_condition.tmp +"°C. Il fera au maximum "+ donnees.fcst_day_0.tmax +"°C et au minimum "+ donnees.fcst_day_0.tmin+"°C.";
//Renseigner les paramètres dans la fonction addInfo à savoir le paragraphe que nous avons crée juste avant et les donnés récupérées
        addInfo(paragraphe, texteMeteo);

    } catch (erreur) {
        console.log("Une erreur est survenue:", erreur);
      }
});
