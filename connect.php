<?php
	ini_set('display_errors', 'on');


	$mongo = new MongoClient("127.0.0.1:27024");
	$db = $mongo->selectDB('villedepau');
	//echo "DB created";
?>
