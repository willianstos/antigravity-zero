provider "aws" {
  access_key                  = "test"
  secret_key                  = "test"
  region                      = "us-east-1"
  s3_use_path_style           = true
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
    s3 = "http://localhost:4566"
  }
}

resource "aws_s3_bucket" "refrimix_logs" {
  bucket = "refrimix-monitoring-logs-2026"
  
  tags = {
    Name        = "Refrimix Logs"
    Environment = "Sovereign"
    Project     = "PH-13"
  }
}

resource "aws_s3_bucket_public_access_block" "refrimix_logs_block" {
  bucket = aws_s3_bucket.refrimix_logs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

output "bucket_name" {
  value = aws_s3_bucket.refrimix_logs.bucket
}
