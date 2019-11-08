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
# Copy entity framework dll (ef.dll) to web root
#
#   Notes: ef.dll is used for manual database deployments (if needed)
#          See https://github.com/ctoec/ecis-experimental/wiki/OPS:-Manual-Database-Migration-&-Rollback
#

Copy-Item -force C:/inetpub/AspNetCoreWebApps/hedwig-spa/installer/lib/ef.dll C:/inetpub/AspNetCoreWebApps/hedwig-spa/ef.dll

#
# Install windows feature telnet client
#
#  Notes: Telnet client is used to check for open ports 
#         See https://github.com/ctoec/ecis-experimental/wiki/Debug:-FAQs

$Env:UserName > c:/cfn/installer-username.txt
[System.Security.Principal.WindowsIdentity]::GetCurrent().Name > c:/cfn/installer-username-2.txt
$Env:PSModulePath > c:/cfn/installer-module-path.txt
$PSVersionTable > c:/cfn/installer-psversion.txt
ls c:/Windows/System32/WindowsPowerShell/v1.0/Modules > c:/cfn/installer-out.txt 2> c:/cfn/installer-err.txt
Enable-WindowsOptionalFeature -online -featureName TelnetClient -all > c:/cfn/installer-feature-telnet.log
Import-Module ServerManager
Install-WindowsFeature -name Telnet-Client -LogPath c:/cfn/installer-telnet.log

#
# Touch token file for post installer end (for logging purposes only)
#
fc > c:/cfn/installer-postinstall-end.txt