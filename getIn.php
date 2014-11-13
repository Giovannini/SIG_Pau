<?php
// connexion a la bdd
include 'connect.php';

// tableau resultat  (format : <nomCollec> => tableau de documents JSON)
$tabdata = array();

// recuperation dess variables envoyees ds la requete
$type = $_POST['type'];
$obj = json_decode($_POST['jsonobj']); // transformation du json en tableau php
$rayon = $_POST['rayon'];

// remplissage du tableau resultat pour toutes les collections
// A VOUS !!

// ecriture du resultat au format json
echo json_encode($tabdata);

?>