## Overview
The Azure DevOps Services build pipeline is setup to automatically setup a Pull Request (PR) environment on an AWS EC2 system using terraform.  

This environment is created using the docker build process and contains the PR branch source at the time of the build.  The run-time logs are accessible via a browser to minimize the need to require access to the EC2 system.

The Azure DevOps build pipeline output identifies the access URLs.  The URLs will adhere to the following convention:
  * Installation and Run-time Logs
     * http://ec-system-ip
  * Application (hedwig) 
     * https://ec2-system-ip:5001

The scripts used by the Azure DevOps Services build pipeline can be performed on your local workstation.  The remainder of this document details the AWS requirements, software installations and script usage syntax. 

## Requirements
### Setup AWS User
 * Setup AWS user

 * Obtain secret key and access key - https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey

## Software Installation
### Install AWS CLI
Install awscli on local workstation - https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html
### Configure AWS CLI
Configure awscli on local workstation - https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html
  * Use us-east-2 for the AWS Region
### Install Terraform
Install terraform on local workstation - https://learn.hashicorp.com/terraform/getting-started/install.html
  * Install version 0.12.13 (required for compatibility with backend S3 database)

## Script Usage
These terraform scripts used by the build pipeline can also be used on the Developer workstation. These scripts are detailed below:   

### Initialize Workspace
Befoare executing terraform scripts, the workspace must be initialized to a) install terraform dependency modules and b) initialize the setup the terraform database located in an AWS S3 bucket. 

  * Windows
    * USAGE: tf-init.bat
  * Linux
    * USAGE: tf-init.sh

### Setup EC2 System

  * Windows
    * USAGE: tf-system-setup.bat github-pr github-branch [aws_ec2_instance_type] [aws_ec2_key_name]
  * Linux
    * USAGE: tf-system-setup.sh github-pr github-branch [aws_ec2_instance_type] [aws_ec2_key_name]

### Destroy EC2 System

* Destroy PR System on AWS EC2
  * Windows
    * USAGE: tf-system-destroy.bat github-pr
  * Linux
    * USAGE: tf-system-destroy.sh github-pr




