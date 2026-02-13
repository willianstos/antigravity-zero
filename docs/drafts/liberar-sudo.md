```md
# Sudo “keepalive” (Ubuntu)

Use quando você vai rodar vários comandos com `sudo` e quer evitar ficar digitando a senha toda hora.

## 1) Inicializar o cache do sudo (pede a senha 1x)
```bash
sudo -v
```

## 2) Manter o sudo “vivo” enquanto você trabalha
> Este loop renova o timestamp a cada 60s sem pedir senha.  
> Se o cache expirar, o comando falha e o loop não reautentica sozinho.

```bash
while true; do sudo -n true; sleep 60; done
```

## 3) Encerrar (voltar a pedir senha)
> Invalida o cache do sudo imediatamente.

```bash
sudo --reset-timestamp
```

## Dica
Para parar o loop do keepalive, use `Ctrl + C` no terminal onde ele está rodando.
```