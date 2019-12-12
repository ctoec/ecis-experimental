install:
	dotnet restore && cd ClientApp && yarn install

dc-start:
	./dc up -d --build 

db-migrate:
	dotnet ef database update

dc-db-migrate:
	./dc-backend dotnet ef database update

db-drop:
	dotnet ef database drop

dc-db-drop:
	./dc-backend dotnet ef database drop

db-reset: | db-drop db-migrate

dc-db-reset: | dc-db-drop dc-db-migrate

test-client:
	cd ClientApp && yarn test

dc-test-client:
	./dc-client yarn test

test-backend:
	dotnet watch test

dc-test-backend:
	./dc-test-backend dotnet test

watch-client:
	cd ClientApp && yarn start

watch-backend:
	dotnet watch run

watch:
	${MAKE} -j2 watch-client watch-backend

storybook:
	cd ClientApp && yarn storybook

dc-storybook:
	./dc-client yarn storybook

prettier:
	./ClientApp/node_modules/.bin/prettier --single-quote --write "ClientApp/src/**/*.{js,jsx,ts,tsx,json,css,scss}"

dc-prettier:
	./dc-client ./node_modules/.bin/prettier --single-quote --write "/app/src/**/*.{js,jsx,ts,tsx,json,css,scss}

api-generate:
	rm -rf ${PWD}/src/Hedwig/ClientApp/src/generated
	curl -k https://localhost:5001/swagger/v1/swagger.json > swagger.json
	docker run --rm -u $(shell id -u) -v ${PWD}:/local openapitools/openapi-generator-cli:v4.2.2 generate -i /local/swagger.json -g typescript-fetch -o /local/src/Hedwig/ClientApp/src/generated --additional-properties="typescriptThreePlus=true"
