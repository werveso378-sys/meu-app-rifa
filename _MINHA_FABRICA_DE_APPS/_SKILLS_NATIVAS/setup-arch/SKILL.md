---
name: setup-arch
description: Ativa e valida toda a arquitetura base do projeto garantindo a consistência das plataformas.
version: 1.0.0
---

# Setup da Arquitetura

Aciona e revisa toda a arquitetura base do projeto (React, Firebase, Capacitor).

## Passos
1. Verifique se o projeto está seguindo o "Princípio da Responsabilidade Única" e o "Protocolo Anti-Gravity".
2. Certifique-se de que a separação entre Backend e UI está bem definida (ex: chamadas a BD devem estar em `src/services`).
3. Valide a integridade do ambiente Web, Android, iOS e garanta que as variáveis de ambiente e dependências estão corretamente orquestradas.
