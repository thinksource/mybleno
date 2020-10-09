#!/bin/sh
### BEGIN INIT INFO
# Provides:  gateway.sh
# Required-Start:   mosquitto
# Required-Stop:
# Default-Start:     2 3 4 5
# Default-Stop:     0 1 6
# Short-Description: Some info
# Description:       Some more info
### END INIT INFO

# export PATH=/root/.nvm/versions/node/v6.9.5/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

cd ./examples/gatewayBLE/

node main.js | tee console.log
