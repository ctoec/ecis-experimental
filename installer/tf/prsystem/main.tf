#--------------------------------------------------------
# data sources - vpc, subnets
#--------------------------------------------------------

data "aws_vpc" "target-vpc" {
  id = "${var.aws_vpc_id}"
}

data "aws_subnet" "target-subnet" {
  id = "${var.aws_subnet_id}"
}

#--------------------------------------------------------
# data sources - latest ubuntu ami
#--------------------------------------------------------

data "aws_ami" "ubuntu" {
    most_recent = true

    filter {
        name   = "name"
        values = ["ubuntu/images/hvm-ssd/ubuntu-xenial-16.04-amd64-server-*"]
    }

    filter {
        name   = "virtualization-type"
        values = ["hvm"]
    }

    owners = ["099720109477"] # Canonical
}

#--------------------------------------------------------
# resource - ec2
#     subnet_id = "subnet-0938d513fa606e06a"
#--------------------------------------------------------

resource "aws_instance" "target_system" {
    ami                          = "${data.aws_ami.ubuntu.id}"
    associate_public_ip_address  = "true"
    instance_type                = "${var.aws_ec2_instance_type}"
    key_name                     = "${var.aws_ec2_key_name}"
    subnet_id                    = "${var.aws_subnet_id}"
    vpc_security_group_ids       = ["${var.aws_ec2_security_group}"]
    user_data                    = templatefile("startup.sh", { github_branch = "${var.github_branch}" })

    tags = {
        Name = "ec2-${var.project_name}-cicd-pr-${var.github_pr}"
    }
}

output "aws_system_public_url" {
    value = "https://${aws_instance.target_system.public_ip}:5001"
}

output "aws_system_log_url" {
    value = "http://${aws_instance.target_system.public_ip}:80"
}