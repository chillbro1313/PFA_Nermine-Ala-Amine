resource "aws_vpc" "ecomback_vpc" {
    cidr_block = "10.0.0.0/16"
    tags = {
        Name = "ecomback-vpc"
    }  
}

# Subnet
resource "aws_subnet" "ecomback_subnet" {
    vpc_id = aws_vpc.ecomback_vpc.id
    cidr_block = "10.0.1.0/24"
    availability_zone =  "us-west-2a"
    map_public_ip_on_launch = true
    tags = {
      Name = "ecomback-subnet"
    }
  
}

# Internet Gateway
resource "aws_internet_gateway" "ecomback_igw" {
    vpc_id = aws_vpc.ecomback_vpc.id
    tags = {
        Name = "ecomback-igw"
    }  
}

# Route Table
resource "aws_route_table" "ecomback_rt" {
    vpc_id = aws_vpc.ecomback_vpc.id
    route {
        cidr_block = "0.0.0.0/0"
        gateway_id = aws_internet_gateway.ecomback_igw.id
    }
  

 tags = {
    Name = "ecomback-rt"
  }
}
# Route Table Association
resource "aws_route_table_association" "ecomback_rta" {
  subnet_id      = aws_subnet.ecomback_subnet.id
  route_table_id = aws_route_table.ecomback_rt.id
}