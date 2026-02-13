# 🆕 LocalStack Module
resource "aws_sqs_queue" "jarvis_tasks" {
  name                      = "jarvis-task-queue"
  delay_seconds             = 0
  max_message_size          = 262144
  message_retention_seconds = 86400
  receive_wait_time_seconds = 10
}

resource "aws_s3_bucket" "jarvis_artifacts" {
  bucket = "jarvis-artifacts"
}

output "queue_url" {
  value = aws_sqs_queue.jarvis_tasks.id
}
