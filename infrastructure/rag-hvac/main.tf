terraform {
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = ">= 2.10.0"
    }
  }
}

provider "kubernetes" {
  config_path    = "~/.kube/config" # K3s config path
  config_context = "default"
}

resource "kubernetes_namespace" "rag_hvac" {
  metadata {
    name = "rag-hvac"
  }
}

resource "kubernetes_manifest" "rag_app" {
  manifest = yamldecode(file("${path.module}/hvac-rag.yaml"))
  depends_on = [kubernetes_namespace.rag_hvac]
}

# Output para o usuário
output "qdrant_service_url" {
  value = "http://qdrant.rag-hvac.svc.cluster.local:6333"
}

output "api_service_url" {
  value = "http://hvac-api.rag-hvac.svc.cluster.local:3000"
}
