## Overview
The Azure DevOps Services build pipeline automatically provisions a Pull Request (PR) environment on a single AWS EC2 system using Terraform.  After the system is provisioned, developers can verify the application behaves as expected. 

Terraform builds the system via the docker build process and uses source from the GitHub pull request branch.  The docker logs are immediately accessible via a browser thus minimizing the need for developer logon access to the EC2 system.

The Azure DevOps build pipeline output identifies the access PR system URLs.  The URLs will adhere to the following convention:
  * Installation and Run-time Logs
     * http://ec-system-ip
  * Application (hedwig) 
     * https://ec2-system-ip:5001

The scripts used by the Azure DevOps Services build pipeline can be optionally executed on developer workstation.  The remainder of this document details the AWS requirements, software installations and script usage syntax for use on the developer workstation. 

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
The scripts used by the build pipeline can also be used on the Developer workstation. These scripts are detailed below:   

### Initialize Workspace
Before executing Terraform commands via the scripts, the script workspace must be initialized to a) install Terraform dependency modules and b) initialize the setup the Terraform database located in the AWS S3 bucket. 

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
