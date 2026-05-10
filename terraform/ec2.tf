# Key Pair
resource "aws_key_pair" "ecomback_key" {
  key_name   = "ecomback-key"
  public_key = file("ecomback-key.pub")
}

# EC2 Instance
resource "aws_instance" "ecomback_ec2" {
  ami                         = "ami-0735c191cf914754d"
  instance_type               = "t2.micro"
  subnet_id                   = aws_subnet.ecomback_subnet.id
  vpc_security_group_ids      = [aws_security_group.ecomback_sg.id]
  key_name                    = aws_key_pair.ecomback_key.key_name
  associate_public_ip_address = true
user_data = <<-EOF
  #!/bin/bash
  export HOME=/root
  apt-get update -y
  apt-get install -y docker.io docker-compose openjdk-17-jdk git
  systemctl start docker
  systemctl enable docker
  export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
  export PATH=$JAVA_HOME/bin:$PATH
  cd /home/ubuntu
  git clone https://github.com/chillbro1313/PFA_Nermine-Ala-Amine.git
  cd PFA_Nermine-Ala-Amine
  chmod +x mvnw
  ./mvnw package -DskipTests
  docker build -t ecomback:1.0 .
  docker-compose up -d
EOF
  tags = {
    Name = "ecomback-ec2"
  }
}

# Output the public IP
output "ec2_public_ip" {
  value = aws_instance.ecomback_ec2.public_ip
}