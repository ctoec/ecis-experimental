#!/bin/bash

cd "$(dirname "$(realpath "$0")")"

s3_workspaces_output=`aws s3 ls s3://ct-oec-hedwig-cicd-pr-terraform/env: --recursive | sed "s|/terraform.tfstate.*||" | sed "s|.*/||"`
for workspace in $s3_workspaces_output
do
   if curl https://github.com/ctoec/ecis-experimental/pull/${workspace} | grep redirected 
   then
      echo deleting terraform system - $workspace
      ./tf-pr-system-destroy.sh ${workspace}

      terraform workspace select default

      echo deleting terraform workspace - $workspace
      terraform workspace delete ${workspace}
   else
      echo skipping terraform system - $workspace
   fi	  
done
