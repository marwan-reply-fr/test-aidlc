terraform {
  /**
    s3 backend does not require dynamodb for locking anymore
    as long the bucket has versioning enabled
    https://developer.hashicorp.com/terraform/language/backend/s3
  **/
  backend "s3" {
    bucket       = "your-bucket"
    key          = "your/key"
    region       = "eu-west-3"
    use_lockfile = true
  }

  required_version = "~> 1.13"

  required_providers {
    aws = "~> 6.18.0"
  }
}

/**
  recommend using environment variables such as AWS_PROFILE
  https://registry.terraform.io/providers/hashicorp/aws/latest/docs#environment-variables
**/
provider "aws" {
  default_tags {
    tags = var.default_tags
  }
}
