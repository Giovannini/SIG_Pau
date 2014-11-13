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
// A VOUS !!, ATTENTION étudiez bien le format de retour de la requete geoNear....

// ecriture du resultat au format json
echo json_encode($tabdata);

?>