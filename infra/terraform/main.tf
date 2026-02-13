# Main Terraform Configuration for K3s Cluster
# Architecture: H1 (Master) + H2 (Worker)

# H1: K3s Master Node
resource "null_resource" "k3s_master_h1" {
  connection {
    type        = "ssh"
    host        = var.h1_ip
    user        = var.ssh_user
    private_key = file(var.ssh_private_key_path)
  }

  # Install K3s as master
  provisioner "remote-exec" {
    inline = [
      "curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION=${var.k3s_version} K3S_TOKEN=${var.k3s_token} sh -s - server --cluster-init",
      "sudo kubectl get nodes",
      "echo 'K3s Master installed on H1'"
    ]
  }

  triggers = {
    k3s_version = var.k3s_version
    k3s_token   = var.k3s_token
  }
}

# H2: K3s Worker Node
resource "null_resource" "k3s_worker_h2" {
  depends_on = [null_resource.k3s_master_h1]

  connection {
    type        = "ssh"
    host        = var.h2_ip
    user        = var.ssh_user
    private_key = file(var.ssh_private_key_path)
  }

  # Join H2 to the cluster as worker
  provisioner "remote-exec" {
    inline = [
      "curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION=${var.k3s_version} K3S_URL=https://${var.h1_ip}:6443 K3S_TOKEN=${var.k3s_token} sh -",
      "echo 'K3s Worker joined cluster from H2'"
    ]
  }

  triggers = {
    k3s_version = var.k3s_version
    k3s_token   = var.k3s_token
    master_ip   = var.h1_ip
  }
}

# Output: Kubeconfig location
output "kubeconfig_location" {
  description = "Location of kubeconfig file on H1"
  value       = "/etc/rancher/k3s/k3s.yaml"
}

output "cluster_status" {
  description = "Cluster deployment status"
  value       = "K3s cluster deployed: H1 (master) + H2 (worker)"
}
