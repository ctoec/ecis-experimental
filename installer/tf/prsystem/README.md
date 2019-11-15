These terraform scripts allow for the user to create and destroy an EC2 system in AWS to support execution of the PR source. 

Script Usage

* Setup PR System on AWS EC2
  * Windows
    * tf-pr-system-setup.bat GITHUB-PR-NUMBER-HERE
  * Linux
    * tf-pr-system-setup.sh GITHUB-PR-NUMBER-HERE

* Destroy PR System on AWS EC2
  * Windows
    * tf-pr-system-destroy.bat GITHUB-PR-NUMBER-HERE
  * Linux
    * tf-pr-system-destroy.sh GITHUB-PR-NUMBER-HERE

Developer Workstation Setup Requirements

* If you want to run these files on your developer workstation, the following must be done:
  * setup AWS user with sufficient rights
  * setup AWS secet key and access key for AWS user
  * install awscli on local workstation
  * configure awscli via "aws configure" on local workstation




