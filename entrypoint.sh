echo "waiting for database..."
until dotnet ef -v database update; do
    sleep 1
done

echo "starting backend..."
dotnet watch run --urls http://0.0.0.0:5000