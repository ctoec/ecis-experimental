if [ "$DOCKER_ON_WINDOWS" ]; then
    cd /home/node/mapped-app
fi

nm=$(ls -A ./node_modules/*)
if [ -z "$nm" ]; then
    echo "installing yarn dependencies..."
    yarn install
fi

if [ "$DOCKER_ON_WINDOWS" ]; then
    rsync -aq --exclude node_modules /home/node/mapped-app/* /home/node/app > /dev/null 2>& 1
    cd /home/node/app
    echo "starting client..."
    yarn start &

    while true;
    do
        rsync -aq /home/node/mapped-app/* /home/node/app > /dev/null 2>& 1
    done
else
    echo "starting client..."
    yarn start
fi