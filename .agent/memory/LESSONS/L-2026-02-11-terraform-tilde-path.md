# Lição: Terraform e Caminhos com Til (~)

- **Sintoma**: Terraform falha ao encontrar arquivos como `~/.ssh/id_rsa` mesmo eles existindo.
- **Causa Raiz**: O Terraform não expande o caractere `~` automaticamente em funções como `file()`.
- **Solução**: Usar sempre caminhos absolutos (ex: `/home/zappro/.ssh/id_rsa`) ou a variável de ambiente `TF_VAR_`.
- **Prevenção**: Jarvis agora utiliza `realpath` ou caminhos absolutos direto no `tfvars`.
