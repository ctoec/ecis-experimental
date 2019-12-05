#!/bin/bash

cd "$(dirname "$(realpath "$0")")"

terraform init -input=false -lock=true -lock-timeout=0s -force-copy -backend=true -backend-config=bucket\=ct-oec-hedwig-cicd-pr-terraform -backend-config=key\=terraform.tfstate -backend-config=region\=us-east-2 -get=true -get-plugins=true  -verify-plugins=true 
