#!/bin/bash
/home/eisti/temp_init_d/apache2 start
xterm -e mongod --configsvr --dbpath /data/bdds/pau/dbsvr --port 27020 &
xterm -e mongod --dbpath /data/bdds/pau/db1 --port 27021 &
xterm -e mongod --dbpath /data/bdds/pau/db2 --port 27022 &
xterm -e mongod --dbpath /data/bdds/pau/db3 --port 27023 &