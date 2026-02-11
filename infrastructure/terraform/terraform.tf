# Terraform Configuration for Elite Home Lab
# Backend: MinIO (S3-compatible)
# Cluster: K3s (H1 Master + H2 Worker)

terraform {
  required_version = ">= 1.6.0"
  
  required_providers {
    null = {
      source  = "hashicorp/null"
      version = "~> 3.2"
    }
  }

  backend "s3" {
    bucket                      = "terraform-state"
    key                         = "homelab/k3s/terraform.tfstate"
    region                      = "us-east-1"
    endpoint                    = "http://localhost:9000"  # MinIO endpoint
    skip_credentials_validation = true
    skip_metadata_api_check     = true
    skip_region_validation      = true
    force_path_style            = true
    
    # Credentials via environment variables:
    # AWS_ACCESS_KEY_ID=minioadmin
    # AWS_SECRET_ACCESS_KEY=minioadmin
  }
}

provider "null" {}
