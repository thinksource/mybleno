
#!/bin/bash

# No-IP uses emails as usernames, so make sure that you encode the @ as %40
USERNAME=vitaliykim
PASSWORD=sXYem4fa1i
HOST=rpiw5.ddns.net
LOGFILE=/var/log/noip.log
USERAGENT="Simple Bash No-IP Updater/0.4 antoniocs@gmail.com"


NEWIP=$(ip addr list wlan0 |grep inet |cut -d' ' -f6|cut -d/ -f1 | grep ^10 | head -n 1)

RESULT=$(wget -O "$LOGFILE" -q --user-agent="$USERAGENT" --no-check-certificate "https://$USERNAME:$PASSWORD@dynupdate.no-ip.com/nic/update?hostname=$HOST&myip=$NEWIP")

LOGLINE="[$(date +"%Y-%m-%d %H:%M:%S")] $RESULT"
echo $LOGLINE >> $LOGFILE

exit 0
