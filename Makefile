install:
	dotnet restore && cd ClientApp && yarn install

db-migrate:
	dotnet ef database update

dc-db-migrate:
	./dc-dotnet ef database update

dc-db-drop:
	./dc-dotnet ef database drop

db-drop:
	dotnet ef database drop

dc-db-reset: | dc-db-drop dc-db-migrate

db-reset: | db-drop db-migrate

test-client:
	cd ClientApp && yarn test

dc-test-client:
	./dc-yarn test

test-backend:
	dotnet watch test

dc-test-backend:
	./dc-dotnet watch test

watch-client:
	cd ClientApp && yarn start

watch-backend:
	dotnet watch run

watch:
	${MAKE} -j2 watch-client watch-backend

storybook:
	cd ClientApp && yarn storybook

dc-storybook:
	./dc-yarn storybook

apollo-generate:
	cd ClientApp && yarn apollo-generate

dc-apollo-generate:
	./dc-yarn apollo-generate

prettier:
	./ClientApp/node_modules/.bin/prettier --single-quote --write "ClientApp/src/**/*.{js,jsx,ts,tsx,json,css,scss}"

dc-prettier:
	docker-compose exec client ./node_modules/.bin/prettier --single-quote --write "/app/src/**/*.{js,jsx,ts,tsx,json,css,scss}
