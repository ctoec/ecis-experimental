#!/bin/sh

set -e
echo "moving test migrations into app..."
testMigrations=$(ls test/HedwigTests/Fixtures/Migrations/*)
cp test/HedwigTests/Fixtures/Migrations/* src/Hedwig/Migrations

if [ -z "$(dotnet tool list -g | grep dotnet-ef)" ]; then
  echo "installing dotnet ef utility..."
  until dotnet tool install --global dotnet-ef --version 3.0.0; do
      sleep 1
  done
fi

export PATH="$PATH:/root/.dotnet/tools"
echo "waiting for database..."
until dotnet ef -v --project src/Hedwig -v database update; do
    sleep 1
done

echo "cleaning up test migrations..."
for m in $testMigrations; do
    rm src/Hedwig/Migrations/$(basename $m)
done

echo "building tests..."
dotnet build test/HedwigTests

echo "starting tests..."
dotnet test --no-build test/HedwigTests --logger trx;LogFileName=Hedwig.trx
