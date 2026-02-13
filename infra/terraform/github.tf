# GitHub Secrets Automation
# Manages secrets for the antigravity-zero repository

provider "github" {
  token = var.github_token
  owner = "willianstos"
}

resource "github_actions_secret" "openai_api_key" {
  repository      = "antigravity-zero"
  secret_name     = "OPENAI_API_KEY"
  plaintext_value = var.openai_api_key
}

resource "github_actions_secret" "github_token" {
  repository      = "antigravity-zero"
  secret_name     = "GH_TOKEN"
  plaintext_value = var.github_token
}
