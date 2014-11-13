#!/bin/bash
su
~/temp_init_d/apache2 start
xterm -e mongod --configsvr --dbpath /data/bdds/pau/dbsvr --port 27020
xterm -e mongod --dbpath /data/bdds/pau/db1 --port 27021
xterm -e mongod --dbpath /data/bdds/pau/db2 --port 27022
xterm -e mongod --dbpath /data/bdds/pau/db3 --port 27023
exit
xterm -e mongos --port 27024 --configdb 127.0.0.1:27020ls hanging-punctuation: 