cd "`dirname $0`" ; (sleep 1 && v run cli/load.v) & (cd API/ && npm start)
