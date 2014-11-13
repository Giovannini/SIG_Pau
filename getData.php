<?php
ini_set('display_errors', 'on');

// connexion a la bdd
include 'connect.php';

// tableau resultat  (format : <nomCollec> => tableau de documents JSON)
$tabdata = array();


// requete recuperant l'ensemble des doc de ttes les collections
$list = $db->listCollections();

foreach ($list as $collection) {
	// Pour chaque colonne, récupérer les données
	$cursor = $collection->find();
	
	$data = array();
	foreach ($cursor as $doc) {
	    $data[] = $doc;
	}

    $tabdata[ $collection->getName() ] = $data;
}

// ecriture du resultat au format json
echo json_encode($tabdata);

?>