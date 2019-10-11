echo "waiting for database..."
until dotnet ef -v --project src/Hedwig -v database update; do
    sleep 1
done

echo "starting tests..."
dotnet test test/HedwigTests --logger trx;LogFileName=Hedwig.trx
