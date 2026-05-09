variable "access_key" {}
variable "secret_key" {}
variable "session_token" {}

variable "region" {
    default =  "us-west-2"

  
}

variable "instance_type" {
    default = "t2.micro"

  
}

variable "ami" {
    default = "ami-0c02fb55956c7d316"
  
}