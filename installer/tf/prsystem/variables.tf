variable "aws_ec2_instance_type" {
  type = "string"
  default = "t2.medium"
}

variable "aws_ec2_key_name" {
  type = "string"
  default = "keypair-devops-cicd"
}

variable "aws_region" {
  type = "string"
  default = "us-east-2"
}

variable "aws_ec2_security_group" {
  type = "string"
  default = "sg-0ec08d25c970ba6c2"
}

variable "aws_subnet_id" {
  type = "string"
  default = "subnet-0938d513fa606e06a"
}

variable "aws_vpc_id" {
  type = "string"
  default = "vpc-04999818c06fd9537"
}

variable "github_branch" {
  type = "string"
  default = "232-authorization"
}

variable "github_pr" {
  type = "string"
}

variable "organization_name" {
  type = "string"
  default = "ct-oec"
}

variable "project_name" {
  type = "string"
  default = "hedwig"
}

