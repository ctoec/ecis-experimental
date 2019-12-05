#!/bin/bash

GITHUB_PR=$1
GITHUB_BRANCH=$2
AWS_EC2_INSTANCE_TYPE=$3
AWS_EC2_KEY_NAME=$4

if [ -z  "$GITHUB_PR" ]
then
  echo USAGE: tf-system-setup github-pr github-branch [aws-ec2-instance-type] [aws-ec2-key-name]
  exit 9
fi

if [ -z  "$GITHUB_BRANCH" ]
then
  echo USAGE: tf-system-setup github-pr github-branch [aws-ec2-instance-type] [aws-ec2-key-name]
  exit 9
fi

if [ -z  "$AWS_EC2_INSTANCE_TYPE" ]
then
  AWS_EC2_INSTANCE_TYPE=t2.medium
fi

if [ -z  "$AWS_EC2_KEY_NAME" ]
then
  AWS_EC2_KEY_NAME=keypair-mgmt-server
fi

cd "$(dirname "$(realpath "$0")")"

if curl https://api.github.com/repos/ctoec/ecis-experimental/pulls/$GITHUB_PR | grep 'pull request environment'
then
  echo 'INFO: detected GitHub pull request environment label'
else
  echo 'WARN: GitHub Pull Request environment label not detected'
  echo 'WARN: Pull Request enviornment not setup'
  exit 0
fi 

terraform workspace new $GITHUB_PR 2> /dev/null 

terraform workspace select $GITHUB_PR
if [ $? -ne 0 ]
then
  echo ERROR: failed to select terraform workspace - $GITHUB_PR
  exit 9
fi

terraform workspace show
if [ $? -ne 0 ]
then
  echo ERROR: failed to show terraform workspace - $GITHUB_PR
  exit 9
fi

terraform plan -no-color -var="github_pr=$GITHUB_PR" -var="github_branch=$GITHUB_BRANCH" -var="aws_ec2_instance_type=$AWS_EC2_INSTANCE_TYPE" -var="aws_ec2_key_name=$AWS_EC2_KEY_NAME" -out=tfplan-$GITHUB_PR
if [ $? -ne 0 ]
then
  echo ERROR: failed to terraform plan - $GITHUB_PR $GITHUB_BRANCH
  exit 9
fi

terraform apply -no-color -input=false tfplan-$GITHUB_PR
if [ $? -ne 0 ]
then
  echo ERROR: failed to terraform apply - $GITHUB_PR $GITHUB_BRANCH
  exit 9
fi

echo INFO: terraform system setup complete

