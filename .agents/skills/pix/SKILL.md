---
name: pix
description: Implementa ou revisa todo o sistema de integração do PIX no projeto.
version: 1.0.0
---

# Sistema de PIX

Este comando orienta a implementação e integração do sistema de pagamentos via PIX.

## Passos
1. Analise o código atual em `frontend/src/services` ou na pasta de backend relacionado a pagamentos.
2. Certifique-se de que a API de PIX está configurada corretamente usando as variáveis de ambiente.
3. Siga o Protocolo Anti-Gravity para lidar com erros de forma resiliente e garanta que o QRCode do PIX será gerado e exibido corretamente para o usuário.
