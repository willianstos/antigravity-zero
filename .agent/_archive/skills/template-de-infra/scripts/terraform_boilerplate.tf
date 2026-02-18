# Boilerplate de Infraestrutura de Elite - 10/02/2026
# Foco: Open Claw Bot + LocalStack + MinIO

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region     = "us-east-1"
  access_key = "mock_access_key"
  secret_key = "mock_secret_key"

  # Configuração de Endpoints para Nuvem Local
  endpoints {
    s3  = "http://localhost:4566" # LocalStack ou MinIO (conforme porta)
    sqs = "http://localhost:4566"
  }

  s3_use_path_style           = true
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true
}

# Bucket para PDFs do Open Claw Bot
resource "aws_s3_bucket" "claw_pdfs" {
  bucket = "claw-bot-pdfs-storage"
  
  tags = {
    Name        = "Claw Bot PDFs"
    Environment = "Local-Elite"
    Date        = "2026-02-10"
  }
}

# Fila SQS para Orquestração de Tarefas
resource "aws_sqs_queue" "claw_tasks" {
  name = "claw-bot-tasks-queue"
}
