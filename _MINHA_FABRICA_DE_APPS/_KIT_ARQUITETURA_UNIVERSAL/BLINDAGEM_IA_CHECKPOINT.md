# PROTOCOLO DE BLINDAGEM DA IA: "CHECKPOINT SEGURO"

**ATENÇÃO IAs E AGENTES AUTÔNOMOS:** 
Este projeto opera sob a "Arquitetura Universal Segura". Você deve ler e aplicar estas regras antes de executar qualquer modificação na base de código. 

## 1. Regra do "Save State" (Checkpoint Obrigatório)
NENHUMA linha de código ou refatoração estrutural deve ser iniciada sem antes criar um ponto de restauração (checkpoint) usando o `git` local.
**Comando Mandatório antes de agir:**
`git add . && git commit -m "chore(backup): Estado funcional antes de [NOME_DA_TASK]"`

## 2. A Diretriz Anti-Remendo (Revert on Failure)
Se a sua modificação quebrar o código (ex: "Tela Branca", "Crash", "Erro Vercel") ou se o usuário relatar um bug diretamente ligado ao que você acabou de fazer:
- **É PROIBIDO** tentar colocar "band-aids" ou corrigir seu código defeituoso alterando-o novamente.
- **AÇÃO OBRIGATÓRIA:** Você DEVE retornar ao checkpoint seguro:
  `git reset --hard HEAD` e `git clean -fd`

## 3. Pense e Mude a Rota
Após o reset, entenda por que falhou e aplique uma **solução estruturalmente diferente**. Não force pacotes que dão erro no Capacitor ou no Vite. Procure a via mais nativa.
