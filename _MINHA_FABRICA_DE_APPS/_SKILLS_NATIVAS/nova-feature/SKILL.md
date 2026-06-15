---
name: nova-feature
description: Isola a construção de códigos novos para impedir o inchaço e a destruição de arquivos antigos.
---
# ✨ MODO QUARENTENA DE CÓDIGO (NOVA FEATURE)

**ATENÇÃO IA:** O usuário pediu para você construir algo completamente novo (Botão, Página, Função Inédita).

## A RESTRIÇÃO:
É proibido criar "código espaguete" inflando componentes já existentes de forma imprudente (ex: injetar 300 linhas novas dentro do `App.jsx`).

1. Você DEVE criar a nova feature em um **arquivo novo** (ex: `src/components/NovaFeature.jsx`).
2. Teste e estruture toda a lógica e visual da feature de forma completamente modularizada e isolada.
3. Somente após pronta, faça a importação de forma limpa e com o mínimo impacto possível no arquivo principal.
