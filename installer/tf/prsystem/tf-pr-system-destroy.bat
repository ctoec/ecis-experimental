ECHO OFF
SETLOCAL

SET GITHUB_PR=%~1

IF "%GITHUB_PR%" == "" (
  ECHO USAGE: tf-system-destroy github-pr
  EXIT /B 1
)

terraform workspace select %GITHUB_PR%
IF %ERRORLEVEL% NEQ 0 GOTO :exit

terraform workspace show
IF %ERRORLEVEL% NEQ 0 GOTO :error

terraform destroy -no-color -auto-approve -var="github_pr=%GITHUB_PR%"
IF %ERRORLEVEL% NEQ 0 GOTO :error

ECHO INFO: terraform system destroy complete
GOTO :eof

:error
ECHO ERROR: terraform error 
:exit
EXIT /B 1

