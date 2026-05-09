resource "aws_s3_bucket" "terraform_state" {
    bucket = "ecomback-terraform-state"

    tags = {
      Name = "ecomback-terraform-state"
      
    }
  
}
resource "aws_s3_bucket_versioning" "state_versioninge" {
    bucket =  aws_s3_bucket.terraform_state.id
    versioning_configuration {
      status = "Enabled"
    }
  
}