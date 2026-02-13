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
    github = {
      source  = "integrations/github"
      version = "~> 5.0"
    }
  }

  backend "local" {
    path = "terraform.tfstate"
  }
}

provider "null" {}
