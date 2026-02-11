# Infraestrutura Open Claw Bot - 10/02/2026
# Orquestração: LocalStack (AWS Emulation) + MinIO (S3 Dedicated)

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
  access_key = "test"
  secret_key = "test"

  # Endpoints apontando para LocalStack (Porta 4566 padrão)
  endpoints {
    s3  = "http://localhost:4566"
    sqs = "http://localhost:4566"
    iam = "http://localhost:4566"
  }

  s3_use_path_style           = true
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true
}

# Bucket S3 para PDFs do Bot no LocalStack
resource "aws_s3_bucket" "pdf_storage" {
  bucket = "claw-bot-pdfs"
  
  tags = {
    Name        = "Claw PDF Store"
    Environment = "Local"
    Project     = "Open Claw Bot"
  }
}

# Fila SQS para orquestração de download de Documentos
resource "aws_sqs_queue" "pdf_download_queue" {
  name = "pdf-download-priority"
}

# Output para o Agente saber onde salvar
output "pdf_bucket_name" {
  value = aws_s3_bucket.pdf_storage.bucket
}
