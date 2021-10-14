cd "`dirname $0`"
(sleep 1 && v run cli/load.v) &
(cd web-client/ && npm start) &
(cd API/ && npm start) &
pause
