nm=$(ls -A ./node_modules/*)
if [ -z "$nm" ]; then
    echo "installing yarn dependencies..."
    yarn install
fi
echo "starting client..."
yarn start
