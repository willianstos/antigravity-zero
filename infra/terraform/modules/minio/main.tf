# 📦 MinIO Buckets Module
resource "aws_s3_bucket" "jarvis_memos" {
  bucket = "jarvis-memos"
}

resource "aws_s3_bucket" "jarvis_context" {
  bucket = "jarvis-context"
}
