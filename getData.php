<?php
// connexion a la bdd
include 'connect.php';

// tableau resultat  (format : <nomCollec> => tableau de documents JSON)
$tabdata = array();

// requete recuperant l'ensemble des doc de ttes les collections

// ecriture du resultat au format json
echo json_encode($tabdata);

?>