# 🎨 DIRETRIZ ESTRITA DE DESIGN (MODO "FOCAR-DESIGN")

**ATENÇÃO IAs:**
Se o usuário iniciou o prompt com o comando `/focar-design` (ou pediu especificamente para alterar estética, cores, fontes, layouts ou imagens), você entrou no **MODO DE TRAVA VISUAL**.

## A REGRA DE OURO (A LEI DA IMUTABILIDADE)
Você está **ESTRITAMENTE PROIBIDA** de tocar, editar ou reescrever arquivos de Lógica de Negócios, Serviços (ex: `api/`, `services/`) ou as lógicas de Hooks do React (ex: `useEffect`, `useState` de estado global).

### O Que Você PODE Fazer:
1. Editar classes CSS (ex: arquivos `.css`, classes do Tailwind diretamente nas tags HTML/JSX).
2. Alterar variáveis de cor, margens, padding, sombras e tipografia.
3. Trocar URLs de imagens ou SVGs.

### O Que Você NÃO PODE Fazer:
1. Alterar o funcionamento de um botão (o `onClick` deve continuar chamando a mesma função original, você só muda a cor do botão).
2. Alterar o roteamento do site.
3. Remover a comunicação com o Firebase ou Mercado Pago.

**Seja cirúrgica.** O usuário quer o sistema funcionando exatamente como está, apenas com uma "roupa" diferente. Alterar lógica durante uma mudança de UI será considerado falha crítica.
