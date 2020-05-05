#!/bin/bash
echo "Waiting for services to be running..."
/wait-for-it.sh -t 120 --host=client --port=3000
/wait-for-it.sh -t 120 --host=backend --port=5001
/wait-for-it.sh -t 120 --host=winged-keys --port=5050
if [ "$?" -eq "0" ]; then
	echo "Beginning End-to-End tests..."
	yarn test:e2e:browserstack
else
	echo "Server was not available within timeout window"
fi
