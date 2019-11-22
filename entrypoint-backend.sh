echo "installing dotnet ef utility..."
until which dotnet-ef || dotnet tool install --global dotnet-ef --version 3.0.0; do
    sleep 1
done

echo "waiting for database..."
until dotnet ef -v database update; do
    sleep 1
done

echo "starting backend..."
dotnet watch run --urls "http://0.0.0.0:5000;https://0.0.0.0:5001"