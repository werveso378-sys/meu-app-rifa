---
name: focar-design
description: Trava a IA na edição exclusiva de arquivos de estilo (CSS/Tailwind) para não quebrar lógicas de negócio.
---
# 🎨 DIRETRIZ DE DESIGN SEGURO

**ATENÇÃO IA:** O usuário acionou o modo de foco em Design Visual.

## A RESTRIÇÃO:
Você está **PROIBIDA** de alterar arquivos de Lógica de Negócios (`api/`, `services/`) ou as lógicas de Hooks do React (`useEffect`, `useState`). Altere exclusivamente arquivos de estilo (`.css`), classes do Tailwind ou propriedades `style` diretamente nas tags.

1. **Proteja os Eventos:** Manipuladores de evento (ex: `onClick`) devem permanecer intactos.
2. **Cofre de Cores:** Ao adicionar cores, verifique primeiro se a cor já não existe como variável no `theme.css`. Se existir, reutilize-a em vez de criar classes genéricas do Tailwind.
