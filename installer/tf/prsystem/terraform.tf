terraform {
  backend "s3" {
    bucket         = "ct-oec-hedwig-cicd-pr-terraform"
    key            = "terraform.tfstate"
    region         = "us-east-2"
    encrypt        = true
  }
}