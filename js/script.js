var map;
var control;
var baseLayers;		// tableau des fonds de carte (osm & google)
var overlays = [];	// tableau des layers du menu
var oldlayerdraw;	// variable pour gerer l'effacage des figures deja tracees

// new XMLHTTPREQUEST object pour Ajax
function getXHR() {
	var xhr = null;
	if (window.XMLHttpRequest)
		xhr = new XMLHttpRequest();
	if (window.ActiveXObject)
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
	return xhr;
}

// transforme un tableau d'elt json en un objet geoJSON
function getGeoJson(liste, styl) {
 return L.geoJson(liste,  {
			style: styl,
			// recupere les infos de chq objet pour les associer a une popup
			onEachFeature: function (feature, layer) {
			var str = "";
				JSON.parse(JSON.stringify(feature.properties), function (k, v) {
																if(k !== "") {
																	//console.log(v);
																	str = str + "<br>"+k+" : "+v;
																}
																} );
				layer.bindPopup(str);
			}
		});
}

// fn ajax qui recupère toutes les data de la bdd, crée le layer et ajoute un controle ds le menu
function getAllData() {
	var xhr = getXHR();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var rep = xhr.responseText;

			// pour toutes les collections recuperees, 
			rep = JSON.parse(rep);
			for(var k in rep){
				v = rep[k];
				if(k!==""){
					// genere le layer geoJSON
					var layer = getGeoJson(eval(v));
					// ajout ds le tableau des layers ( FORMAT <nomCollec> => layerGeoJSON)
					overlays[k]=layer;
					// ajout au menu control
					control.addOverlay(layer, k);
				}
			}

		}
	};
	xhr.ontimeout = function(){
		alert("request timed out");
	};
	xhr.open('GET', "getData.php", true); // page php de récupération de ttes les donnees 
	xhr.send(null);
}

// fonction qui efface les resultats de la requete precedente
function refresh() {
	map.closePopup();  // fermeture de la popup
	for (var key in overlays)  // parcours du tableau des layers
		map.removeLayer(overlays[key]);  // suppression des layers
}

// fonction qui traite le resultat de la requete ajax
// elle ajoute les layers au control
// rep : xmlhttprequest.responseText
function traiteReponse(rep){
	// supprime le control, en crée un nv
	control.removeFrom(map);
	// vide le tableau des anciens layers, 
	overlays = [];
	// cree un nv control
	control = L.control.layers(baseLayers, overlays).addTo(map);
	// parcours la reponse, pour chacun, recuperation du layer geoJSON, ajout ds la tableau des layers, ajouts au control
	
	var json = JSON.parse(rep);
	for(var k in json){
		v = json[k];
		//console.log(v);
		if(k!==""){
			// genere le layer geoJSON
			var layer = getGeoJson(eval(v));
			// ajout ds le tableau des layers ( FORMAT <nomCollec> => layerGeoJSON)
			overlays[k]=layer;
			// ajout au menu control
			control.addOverlay(layer, k);
		}
	}
}

// fonction ajax pour la requete "proche de"
// params longitude, latitude, la distance est recuperee ds l'input
function getNear(lng, lat) {
	console.log("getNear");
	var distance = document.getElementById('dist').value; // recup de la valeur du formulaire
	var xhr = getXHR();
	refresh();			// suppression des anciens layers
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) // quand la reponse est bonne...
			traiteReponse(xhr.responseText);
	};
	xhr.ontimeout = function(){
		alert("request timed out");
	};
	xhr.open('GET', "getNear.php?lng="+lng+"&lat="+lat+"&dist="+distance, true);
	xhr.send(null);
	map.closePopup();
}


// fonction ajax pour la requete "contenu"
// params type de forme, json representant la figure, rayon, pour le cercle
function getIn(figure,gojson,rayon) {
	console.log("getIn");
	var xhr = getXHR();
	refresh();			// suppression des anciens layers
	if(!rayon) rayon = 0;  // si rayon pas renseigne, valeur bidon
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200)
			traiteReponse(xhr.responseText);
	};
	xhr.ontimeout = function(){
		alert("request timed out");
	};
	xhr.open('POST', "getIn.php", true);
	xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhr.send("type="+figure+"&jsonobj="+JSON.stringify(gojson)+"&rayon="+rayon);
	map.closePopup();
}

// fonction qui retourne le formulaire pour un marker point
function getFormuNear(long,lat) {
	return "<div> <center>Requete proche</center>"+
				"<label>Distance : <input id='dist' name='dist' type='text' size='15' /> (m)</label> <br/>"+
				"<center><button onclick='getNear("+long+","+lat+")'>Envoi</button></center>"+
				"</div>";
}

// fonction qui retourne un formulaire pour un layer forme (ligne, cercle, polygone & rectangle)
function getFormuIn(figure,gojson, rayon) {
	return "<div> <center>Requete contenu</center>"+
				"<center><button onclick='getIn(\""+figure+"\","+JSON.stringify(gojson)+","+rayon+")'>Envoi</button></center>"+
				"</div>";
}

// fonction qui efface la derniere forme tracee
function efface() {
	if (oldlayerdraw != null)
		map.removeLayer(oldlayerdraw);
}

// fonction d'initialisation de la carte
function initMap() {
	// cree la map avec le pt central et le niveau de zoom
	map = L.map('mamap', {
					center: [43.3, -0.3667],
					zoom: 14
		});

	// cree layer openstreetmap
	var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
	var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 18, attribution: osmAttrib});
	//cree layer google
	var ggl = new L.Google('ROADMAP');
	var gglsat = new L.Google();

	// ajout du fond de carte /defaut
	map.addLayer(osm);

	//creation control menu
	baseLayers = {"OpenStreetMap": osm, "Google": ggl, "Google Sat": gglsat};
	// baseLayers = {"OpenStreetMap": osm};  // si quota google depasse, n'ajouter qu'openstreetmap
	control = L.control.layers(baseLayers, overlays).addTo(map);

	// init des donnees ds le  menu control
	getAllData();

	/************************************** leafletdraw ****************************/
	var drawnItems = new L.FeatureGroup();
	map.addLayer(drawnItems);

	var drawControl = new L.Control.Draw({
		position: 'topleft',
		draw: {
			polyline: {
				metric: true
			},
			polygon: {
				allowIntersection: false,
				showArea: true,
				drawError: {
					color: '#b00b00',
					timeout: 1000
				},
				shapeOptions: {
					color: '#bada55'
				}
			},
//			rectangle: false,
			circle: {
				shapeOptions: {
					color: '#662d91'
				}
			},
			marker: true
		},
		edit: {
			featureGroup: drawnItems,
			remove: false
		}
	});

	drawControl.setDrawingOptions({ polygon: { shapeOptions: { color: '#04B404' } } });
	drawControl.setDrawingOptions({ rectangle: { shapeOptions: { color: '#004a80' } } });
	map.addControl(drawControl);  // ajout du control dessin a la map

	map.on('draw:created', function (e) {
		var type = e.layerType,
			layer = e.layer;

		efface(); // on efface la derniere forme tracee

		if (type === 'marker')  // association du popup menu pour un marker point
			layer.bindPopup(getFormuNear(layer.getLatLng().lng, layer.getLatLng().lat));
		else
			if (type === 'circle') // association du popup menu pour le cercle (info rayon)
				layer.bindPopup(getFormuIn(type,layer.toGeoJSON(),layer.getRadius()));
			else				// association du popup menu pour les autres types de figure
				layer.bindPopup(getFormuIn(type,layer.toGeoJSON()));

		drawnItems.addLayer(layer);
		oldlayerdraw = layer;  // la nvlle forme devient l'ancienne de la prochaine action...
	});
	map.on('draw:edited', function (e) {
		var layers = e.layers;
		var countOfEditedLayers = 0;
		layers.eachLayer(function(layer) {
			countOfEditedLayers++;
		});
		//console.log("Edited " + countOfEditedLayers + " layers");
	});

}


