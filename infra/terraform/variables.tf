# Variables for Elite Home Lab K3s Cluster

variable "h1_ip" {
  description = "IP address of H1 (Master Node)"
  type        = string
  default     = "192.168.1.100"  # Ajuste conforme sua rede
}

variable "h2_ip" {
  description = "IP address of H2 (Worker Node)"
  type        = string
  default     = "192.168.1.101"  # Ajuste conforme sua rede
}

variable "k3s_version" {
  description = "K3s version to install"
  type        = string
  default     = "v1.28.5+k3s1"
}

variable "k3s_token" {
  description = "K3s cluster token for node authentication"
  type        = string
  sensitive   = true
}

variable "ssh_user" {
  description = "SSH user for remote provisioning"
  type        = string
  default     = "zappro"
}

variable "ssh_private_key_path" {
  description = "Path to SSH private key"
  type        = string
  default     = "~/.ssh/id_rsa"
}

variable "github_token" {
  description = "GitHub Personal Access Token"
  type        = string
  sensitive   = true
}

variable "openai_api_key" {
  description = "OpenAI API Key for GitHub Actions"
  type        = string
  sensitive   = true
}

variable "telegram_bot_token" {
  description = "Telegram Bot Token"
  type        = string
  sensitive   = true
}

variable "telegram_admin_id" {
  description = "Telegram Admin/User ID"
  type        = string
}
