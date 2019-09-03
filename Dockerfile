FROM microsoft/dotnet:2.2-sdk AS builder
WORKDIR /source

RUN curl -sL https://deb.nodesource.com/setup_10.x |  bash -
RUN apt-get install -y nodejs
RUN npm install -g yarn

COPY *.csproj .
RUN dotnet restore

COPY ./ ./
RUN dotnet ef database update

RUN dotnet publish "./ecis2.csproj" --output "./dist" --configuration Release --no-restore

FROM microsoft/dotnet:2.2-aspnetcore-runtime
WORKDIR /app
COPY --from=builder /source/dist .
EXPOSE 80
ENTRYPOINT ["dotnet", "ecis2.dll"]
