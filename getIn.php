<?php
// connexion a la bdd
include 'connect.php';

// tableau resultat  (format : <nomCollec> => tableau de documents JSON)
$tabdata = array();

// recuperation dess variables envoyees ds la requete
$type = $_POST['type'];
$obj = json_decode($_POST['jsonobj'], true); // transformation du json en tableau php
$rayon = intval($_POST['rayon']);

//var_dump($type);
//var_dump($obj);
//var_dump($rayon);

// requete recuperant l'ensemble des doc de ttes les collections
$list = $db->listCollections();

foreach ($list as $collection) {
	// Pour chaque colonne, récupérer les données
	switch ($type) {
		case 'polygon':
		case 'rectangle':
			$cursor = $collection->find(array(
									'geometry' => array(
										'$geoIntersects' => array(
											'$geometry' => array(
												'type' => 'Polygon',
												'coordinates' => $obj['geometry']['coordinates']
												)
											)
										)
									)
			);
			break;
		case 'circle':
			$cursor = $collection->find(array(
									'geometry' => array(
										'$geoWithin' => array(
											'$center' => array(
												$obj['geometry']['coordinates'],
												($rayon / 111320)
												)
											)
										)
									)
			);
			break;
		case 'polyline':
			$cursor = $collection->find(array(
									'geometry' => array(
										'$geoIntersects' => array(
											'$geometry' => array(
												'type' => 'LineString',
												'coordinates' => $obj['geometry']['coordinates']
												)
											)
										)
									)
			);
			break;
		default:
			break;
	}

	
	
	$data = array();
	foreach ($cursor as $doc) {
	    $data[] = $doc;
	}

    $tabdata[ $collection->getName() ] = $data;
}

// remplissage du tableau resultat pour toutes les collections



// ecriture du resultat au format json
echo json_encode($tabdata);

?>