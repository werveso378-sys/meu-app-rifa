---
name: test
description: Inicia o servidor de desenvolvimento e abre um simulador de dispositivos (PC, Mobile, Tablet) para testar o app antes de buildar.
version: 1.0.0
---

# Skill: /test

Quando o usuário solicitar o comando `/test` ou pedir para testar o app, siga estas instruções:

## Propósito
Esta skill executa um script que sobe o servidor Vite de desenvolvimento e simultaneamente abre uma janela do navegador (`Puppeteer`) apontando para um simulador.
Esse simulador possui botões para testar o layout em tamanhos diferentes (PC, Tablet e Mobile).
Quando a janela do simulador for fechada pelo usuário, o script automaticamente derrubará o servidor e encerrará o teste.

## Passos para Execução
1. Execute o seguinte comando via terminal na raiz do frontend:
   `cd frontend && npm run test`
2. Informe ao usuário que o simulador está sendo aberto em uma nova janela.
3. Avise-o que ele pode alternar entre os tamanhos (PC, Tablet, Celular) através dos botões na parte superior.
4. Instrua o usuário que, ao terminar o teste, basta fechar a janela do navegador. Isso fará com que o servidor de desenvolvimento seja encerrado de forma limpa automaticamente.
