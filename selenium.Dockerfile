FROM mcr.microsoft.com/dotnet/core/sdk:3.1
RUN apt-get update \
	&& apt-get install -y --no-install-recommends unzip \
	&& curl -sSL https://aka.ms/getvsdbgsh | bash /dev/stdin -v latest -l /vsdbg \
	&& dotnet tool install --global dotnet-ef --version 3.1.4
ENV PATH="${PATH}:/root/.dotnet/tools"

COPY ./src/Hedwig /app/src/Hedwig

WORKDIR /app/src/Hedwig
