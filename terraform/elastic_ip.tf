resource "aws_eip" "ecomback_eip" {
    instance = aws_instance.ecomback_ec2.id
    domain = "vpc"

    tags = {
      Name ="ecomback-eip"
    }
  
}
output "elastic_ip" {
    value = aws_eip.ecomback_eip.public_ip 
}