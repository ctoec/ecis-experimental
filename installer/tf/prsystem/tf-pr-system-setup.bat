ECHO OFF
SETLOCAL

SET GITHUB_PR=%~1
SET GITHUB_BRANCH=%~2
SET AWS_EC2_INSTANCE_TYPE=%~3
SET AWS_EC2_KEY_NAME=%~4

IF "%GITHUB_PR%" == "" (
  ECHO USAGE: tf-system-setup github-pr github-branch [aws_ec2_instance_type] [aws_ec2_key_name]
  EXIT /B 1
)

IF "%GITHUB_BRANCH%" == "" (
  ECHO USAGE: tf-system-setup github-pr github-branch [aws_ec2_instance_type] [aws_ec2_key_name]
  EXIT /B 1
)

IF "%AWS_EC2_INSTANCE_TYPE%" == "" (
  SET AWS_EC2_INSTANCE_TYPE=t2.medium
)

IF "%AWS_EC2_KEY_NAME%" == "" (
  SET AWS_EC2_KEY_NAME=keypair-mgmt-server
)

terraform workspace new %GITHUB_PR% 2> nul

terraform workspace select %GITHUB_PR%
IF %ERRORLEVEL% NEQ 0 GOTO :error

terraform workspace show
IF %ERRORLEVEL% NEQ 0 GOTO :error

terraform plan -var="github_pr=%GITHUB_PR%" -var="github_branch=%GITHUB_BRANCH%" -var="aws_ec2_instance_type=%AWS_EC2_INSTANCE_TYPE%" -var="aws_ec2_key_name=%AWS_EC2_KEY_NAME%" -out=tfplan-%GITHUB_PR%
IF %ERRORLEVEL% NEQ 0 GOTO :error

terraform apply -input=false tfplan-%GITHUB_PR%
IF %ERRORLEVEL% NEQ 0 GOTO :error

ECHO INFO: terraform system setup complete
GOTO :eof

:error
echo ERROR: failed to terraform apply - $GITHUB_PR $GITHUB_BRANCH
EXIT /B 1

