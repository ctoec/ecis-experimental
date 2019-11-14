ECHO OFF
SETLOCAL

SET GITHUB_PR=%~1

IF "%GITHUB_PR%" == "" (
  ECHO USAGE: tf-workspace-set github-pr
  EXIT /B 1
)

terraform workspace new %1 2> nul

terraform workspace select %GITHUB_PR%
IF %ERRORLEVEL% NEQ 0 GOTO :error

terraform workspace show
IF %ERRORLEVEL% NEQ 0 GOTO :error

ECHO INFO: terraform workspace set - %GITHUB_PR%
GOTO :eof

:error
ECHO ERROR: terraform error 
EXIT /B 1
