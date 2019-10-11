FROM mcr.microsoft.com/dotnet/core/sdk:3.0
RUN apt-get update \
	&& apt-get install -y --no-install-recommends unzip \
	&& curl -sSL https://aka.ms/getvsdbgsh | bash /dev/stdin -v latest -l /vsdbg

# FROM mcr.microsoft.com/dotnet/core/aspnet:3.0-stretch-slim AS base
# WORKDIR /app
# EXPOSE 80
# EXPOSE 443

# FROM mcr.microsoft.com/dotnet/core/sdk:3.0-stretch AS build
# WORKDIR /src
# COPY ["auth-dev/OpenIDProvider/OpenIDProvider.csproj", "auth-dev/OpenIDProvider/"]
# RUN dotnet restore "auth-dev/OpenIDProvider/OpenIDProvider.csproj"
# COPY . .
# WORKDIR "/src/auth-dev/OpenIDProvider"
# RUN dotnet build "OpenIDProvider.csproj" -c Release -o /app/build

# FROM build AS publish
# RUN dotnet publish "OpenIDProvider.csproj" -c Release -o /app/publish

# FROM base AS final
# WORKDIR /app
# COPY --from=publish /app/publish .
# ENTRYPOINT ["dotnet", "OpenIDProvider.dll"]
