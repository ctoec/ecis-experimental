set -e
echo "waiting for database..."
until dotnet ef -v --project src/Hedwig -v database update; do
    sleep 1
done

echo "building tests..."
dotnet build test/HedwigTests

echo "starting tests..."
dotnet test --no-build test/HedwigTests --logger trx;LogFileName=Hedwig.trx
