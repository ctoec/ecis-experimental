#
# Touch token file for post installer start (for logging purposes only)
#
fc > c:/cfn/installer-postinstall-start.txt

#
# Give IIS AppPool\DefaultAppPool full control on webapp root
#
Invoke-Expression -Command:"icacls C:/inetpub/AspNetCoreWebApps/hedwig-spa /grant 'IIS AppPool\DefaultAppPool:(OI)(CI)F'"

#
# Display permissions for webapp root
#
Invoke-Expression -Command:"icacls C:/inetpub/AspNetCoreWebApps/hedwig-spa"

#
# Set IIS http to https
#
##C:/inetpub/AspNetCoreWebApps/hedwig-spa/installer/scripts/iis-redirect-http-https.bat

#
# Copy entity framework dll (ef.dll) to web root
#
#   Notes: ef.dll is used for manual database deployments (if needed)
#          See https://github.com/ctoec/ecis-experimental/wiki/OPS:-Manual-Database-Migration-&-Rollback
#
Copy-Item -force C:/inetpub/AspNetCoreWebApps/hedwig-spa/installer/lib/ef.dll C:/inetpub/AspNetCoreWebApps/hedwig-spa/ef.dll

#
# Touch token file for post installer end (for logging purposes only)
#
fc > c:/cfn/installer-postinstall-end.txt
