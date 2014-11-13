<?php
ini_set('display_errors', 'on');
// connect
include 'connect.php';

// ajout du contenu du fichier en base, attention au format du fichier !!
// chaque entite est representee dans sa propre collection (bus, parking, banc...)
// chaque collection doit contenir un document par item...
// parametres fic : nom du fichier à importer
function loadDocument($fic) {
	global $db;
	echo "<br><br>####### ". basename($fic, ".json") . "<br>";
	$collec = $db->selectCollection(basename($fic, ".json"));
	$collec->remove();

	$json = file_get_contents($fic);
	$content = json_decode($json, TRUE);

	for($i=0 ;$i<sizeof($content['features']); ++$i){
		$collec->insert( $content['features'][$i] , array(safe=>true));
	}
	
}
// appel de la fonction pour chq collection
loadDocument('data/airejeux.json');
loadDocument('data/canisette.json');
loadDocument('data/horodateur.json');
loadDocument('data/parkingvelo.json');
loadDocument('data/stationnement.json');
loadDocument('data/banc.json');
loadDocument('data/corbeille.json');
loadDocument('data/idcycle.json');
loadDocument('data/pistecycle.json');
loadDocument('data/verre.json');
loadDocument('data/bus.json');
loadDocument('data/fontaine.json');
loadDocument('data/parking.json');

// message de fin de chargement
echo 'Chargement ok';
?>