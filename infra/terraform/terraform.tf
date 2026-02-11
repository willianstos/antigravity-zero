# terraform/terraform.tf
# Padrão: 10/02/2026 - Home Lab Elite

terraform {
  required_version = ">= 1.5.0"
  
  required_providers {
    libvirt = {
      source  = "dmacvicar/libvirt"
      version = "~> 0.7.0"
    }
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23.0"
    }
  }

  # Backend S3 adaptado para MinIO Local
  backend "s3" {
    bucket                      = "terraform-state"
    key                         = "home-lab/terraform.tfstate"
    region                      = "us-east-1"
    endpoint                    = "http://localhost:9000" # Endpoint do MinIO
    skip_credentials_validation = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    force_path_style            = true
  }
}

provider "aws" {
  region = "us-east-1"
  
  endpoints {
    s3 = "http://localhost:9000" # MinIO
  }
}
