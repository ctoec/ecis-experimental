nm=$(ls -A ./node_modules/*)
if [ -z "$nm" ]; then
    echo "installing yarn dependencies..."
    yarn install
fi
/wait-for-it.sh -t 120 --host=backend-for-selenium --port=5001
if [ "$?" -eq "0" ]; then
	echo "Beginning End-to-End tests..."
	yarn test:e2e:browserstack
else
	echo "Server was not available within timeout window"
fi
