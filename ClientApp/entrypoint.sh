nm=$(ls -A ./node_modules/*)
if [ -z "$nm" ]; then
    echo "installing yarn dependencies..."
    yarn install
fi

echo "starting client..."
if [ "$DOCKER_ON_WINDOWS" ]; then
    CHOKIDAR_USEPOLLING=true CHOKIDAR_INTERVAL=2500 yarn start
else
    yarn start
fi
