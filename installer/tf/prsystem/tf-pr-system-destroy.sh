#!/bin/bash

GITHUB_PR=$1 

if [ -z  "$GITHUB_PR" ]
then
  echo USAGE: tf-system-destroy github-pr
  exit 9
fi

cd "$(dirname "$(realpath "$0")")"

terraform workspace select $GITHUB_PR
if [ $? -ne 0 ]
then
  echo WARNING: terraform workspace does not exist - $GITHUB_PR
  exit 0
fi

terraform workspace show
if [ $? -ne 0 ]
then
  echo ERROR: failed to show terraform workspace - $GITHUB_PR
  exit 9
fi

terraform destroy -no-color -auto-approve -var="github_pr=$GITHUB_PR" 
if [ $? -ne 0 ]
then
  echo ERROR: failed to terraform plan - $GITHUB_PR
  exit 9
fi

echo INFO: terraform system destroy complete

