# PROTOCOLO UNIVERSAL DE IA: "CHECKPOINT SEGURO" (AI_SAFE_WORKFLOW)

**ATENÇÃO IAs E AGENTES AUTÔNOMOS:** 
Este documento possui **PRIORIDADE MÁXIMA**. Leia e aplique estas regras antes de executar qualquer modificação na base de código deste projeto. Este protocolo existe para erradicar o "loop de correções sem fim" e garantir que o projeto sempre avance a partir de uma base sólida.

## 1. Regra do "Save State" (Checkpoint Obrigatório)
NENHUMA linha de código ou refatoração estrutural deve ser iniciada sem antes criar um ponto de restauração (checkpoint) usando o `git` local.

**Comando Mandatório antes de agir:**
```bash
git add .
git commit -m "chore(backup): Estado funcional antes de iniciar a task [NOME_DA_TASK]"
```

## 2. A Diretriz Anti-Remendo (Revert on Failure)
Se a sua modificação quebrar o código (ex: "Tela Branca", "Crash no Capacitor", "Erro de Build na Vercel" ou o usuário relatar um bug diretamente ligado ao que você acabou de fazer):

- **É ESTRITAMENTE PROIBIDO** continuar adicionando linhas de código (remendos) por cima do código quebrado na tentativa de adivinhar o conserto.
- **AÇÃO OBRIGATÓRIA:** Você DEVE desfazer imediatamente todas as suas mudanças utilizando o Git, retornando ao checkpoint seguro.

**Comando Mandatório em caso de falha/bug:**
```bash
git reset --hard HEAD
git clean -fd
```
*(Este comando destrói as mudanças que deram erro e restaura a sanidade do projeto).*

## 3. Pivotar, Não Insistir
Após executar o `git reset --hard`, você DEVE analisar a causa da falha e adotar uma **abordagem arquitetural diferente** da que falhou. 
Se você tentou instalar um pacote e deu erro, não tente forçar a instalação do mesmo pacote. Tente fazer a funcionalidade de forma nativa ou usando outra biblioteca.

## 4. O Foco no Mobile / Frontend
Sempre que testar ou alterar algo, lembre-se:
- O projeto usa Vite + Capacitor para APK.
- Alterações não devem quebrar o grid do celular (telas de 360px a 390px).

> *"Uma IA inteligente sabe a hora de avançar, mas uma IA de elite sabe a hora de voltar atrás e tentar um caminho mais limpo."*
