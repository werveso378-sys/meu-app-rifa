# 🛡️ SUÍTE DE COMANDOS DE FOCO (SISTEMA DE BLINDAGEM)

**ATENÇÃO IA:** Toda vez que o usuário iniciar uma mensagem com qualquer um dos comandos abaixo precedidos de `/`, você entra automaticamente em **Modo de Restrição**. O não cumprimento destas regras resultará em falha crítica de sistema.

---

### 🎨 `/focar-design` (A Lei da Imutabilidade Lógica)
**O que é:** O usuário quer alterar cores, fontes, bordas ou posicionamento.
**A RESTRIÇÃO:** Você está **PROIBIDA** de alterar arquivos de Lógica de Negócios (`api/`, `services/`) ou as lógicas de Hooks do React (`useEffect`, `useState`). Altere exclusivamente arquivos de estilo (`.css`), classes do Tailwind ou propriedades `style` diretamente nas tags, mantendo os manipuladores de evento (ex: `onClick`) intactos. (Consulte o arquivo `design_system/REGRAS_DE_UI.md` para mais detalhes).

### 🪲 `/focar-debug` (Modo Investigação)
**O que é:** Um erro ocorreu e o usuário quer descobrir o porquê.
**A RESTRIÇÃO:** Você está **PROIBIDA** de apagar ou reescrever a lógica na tentativa de consertar. Você deve atuar como um investigador forense: limite-se a adicionar `console.log()` ou `try/catch` para capturar variáveis. Encontre a causa raiz PRIMEIRO e sugira a solução teórica ao usuário. Apenas modifique o código estrutural se o usuário aprovar sua hipótese.

### 🧱 `/focar-backend` (Modo Servidor Isolado)
**O que é:** O usuário quer criar rotas na Vercel ou regras de segurança no Firebase.
**A RESTRIÇÃO:** Tranque o seu escopo à pasta `api/` e `_services/`. É **PROIBIDO** tocar em componentes visuais `.jsx` ou `.css` do frontend. O fluxo de dados deve ser garantido, mas a interface não pode ser alterada.

### ✨ `/nova-feature` (Modo Quarentena)
**O que é:** Criação de um botão novo, página nova ou funcionalidade inédita.
**A RESTRIÇÃO:** É proibido inflar componentes existentes (ex: colocar 300 linhas novas dentro do `App.jsx`). Você DEVE criar a nova feature em um arquivo novo (ex: `src/components/NovaFeature.jsx`), testar de forma isolada e só então importá-la de forma limpa no arquivo principal.

### 📝 `/focar-texto` (Modo Redator)
**O que é:** Revisão ortográfica, mudança de títulos ou mensagens de erro.
**A RESTRIÇÃO:** Modifique APENAS strings dentro de aspas. Não altere variáveis, nomes de funções ou estrutura de HTML.

### 🛡️ `/piloto-automatico` (O Modo Autônomo)
**O que é:** O usuário quer que você execute tudo sozinho sem ficar perguntando.
**A RESTRIÇÃO:** Por padrão (sem este comando), você é OBRIGADA a gerar um Relatório de Impacto e pedir permissão antes de alterar qualquer código (Modo Cão de Guarda). Porém, se o usuário mandar `/piloto-automatico`, a trava está desativada. Analise, planeje mentalmente, execute as melhores práticas da Fábrica e entregue o resultado final pronto, sem fazer perguntas e sem pedir aprovação. Aja como um Desenvolvedor Sênior autônomo.
