<?php
// connexion a la bdd
include 'connect.php';

// tableau resultat
$tabdata = array();

// recuperation dess variables envoyees ds la requete
$lng = floatVal($_GET['lng']);
$lat = floatVal($_GET['lat']);
$dist = floatVal($_GET['dist']);

// remplissage du tableau resultat pour toutes les collections
$list = $db->listCollections();
foreach ($list as $collection) {
	$cursor = $collection->find(array(
									'geometry' => array(
										'$geoWithin' => array(
											'$center' => array(
												array($lng, $lat),
												($dist / 111320)
												)
											)
										)
									)
			);

	$data = array();
	foreach ($cursor as $doc) {
	    $data[] = $doc;
	}

    $tabdata[ $collection->getName() ] = $data;
}

// ecriture du resultat au format json
echo json_encode($tabdata);

?>