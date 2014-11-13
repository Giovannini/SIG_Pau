
#1. PARTITIONNEMENT

//Création du serveur de config ; en prod, au moins 3 sont recommandés
mongod ­­configsvr ­­dbpath /data/dbsvr ­­port 27020 //On peut en créer plusieurs
//Lancement des serveurs de shards
mongod ­­dbpath /data/db1 ­­port 27021
mongod ­­dbpath /data/db2 ­­port 27022
mongod ­­dbpath /data/db3 ­­port 27023
//Création du routeur ; en prod, au moins 2 sont recommandés
mongos ­­port <port> ­­configdb <IP>:27020, ... //apposer autant que définis en 1ere étape
//Lancement de mongo sur le serveur
mongo ­­host <IPserver> ­­port <port> //si pas défini au­dessus, 27017/defaut 
//verif status
sh.status();
//déclaration des shards
sh.addShard("<IP1>:27021");
sh.addShard("<IP2>:27022");
sh.addShard("<IP3>:27023");
//autorisation de découpage de la bdd
sh.enaleSharding("<bdd>");
//critère de découpe par collection
sh.shardCollection("<bdd>.<collec1>", {"_id":"hashed"});
sh.shardCollection("<bdd>.<collec2>", {"_id":"hashed"});
...
//verif status
sh.status();
//ajout index sur coords
db.<collec1>.ensureIndex({<champ coord>:"2dsphere"});
db.<collec2>.ensureIndex({<champ coord>:"2dsphere"});
...


#2. CHARGEMENT DE LA BDD DANS MONGO
Lancer le script "loadData.php"

#3. UTILISATION
Lancement des serveurs de shards et du routeur via les scripts "startAll.sh" et "startMongos.sh" respectivement
Ouvrir la page "geo.html"