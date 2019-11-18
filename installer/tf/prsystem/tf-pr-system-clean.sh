#!/bin/bash

cd "$(dirname "$(realpath "$0")")"

s3_workspaces_output=`aws s3 ls s3://ct-oec-hedwig-cicd-pr-terraform/env: --recursive | sed "s|/terraform.tfstate.*||" | sed "s|.*/||"`
for workspace in $s3_workspaces_output
do
   if curl https://github.com/ctoec/ecis-experimental/pull/${workspace} | grep redirected 
   then
      echo deleting system and workspace - $workspace
   fi	  
done
