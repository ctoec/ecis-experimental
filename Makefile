install:
	dotnet restore && cd ClientApp && yarn install

client-test:
	cd ClientApp && yarn test

backend-test:
	dotnet watch test

client-watch:
	cd ClientApp && yarn start

backend-watch:
	dotnet watch run

watch:
	${MAKE} -j4 client-watch backend-watch

storybook:
	cd ClientApp && yarn storybook

prettier:
	./ClientApp/node_modules/.bin/prettier --single-quote --write "ClientApp/src/**/*.{js,jsx,ts,tsx,json,css,scss}"
