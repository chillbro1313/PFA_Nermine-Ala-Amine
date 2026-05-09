# Key Pair
resource "aws_key_pair" "ecomback_key" {
  key_name   = "ecomback-key"
  public_key = file("ecomback-key.pub")
}

# EC2 Instance
resource "aws_instance" "ecomback_ec2" {
    ami = "ami-0735c191cf914754d"
    instance_type = "t2.micro"
    subnet_id = aws_subnet.ecomback_subnet.id
    vpc_security_group_ids = [aws_security_group.ecomback_sg.id]
    key_name =  aws_key_pair.ecomback_key.key_name 


  user_data = <<-EOF
    #!/bin/bash
    apt-get update -y
    apt-get install -y docker.io docker-compose
    systemctl start docker
    systemctl enable docker
  EOF

  tags = {
    Name = "ecomback-ec2"
  }
  }
 # Output the public IP
 output "ec2_public_ip" {
  value = aws_instance.ecomback_ec2.public_ip
}