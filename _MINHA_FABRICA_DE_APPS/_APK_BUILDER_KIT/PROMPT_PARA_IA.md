# 🤖 PROMPT REUTILIZÁVEL PARA IA — Transformar Projeto Web em APK

> **COMO USAR:** Copie o prompt abaixo e cole na sua IA (Gemini, ChatGPT, Claude, etc.)
> junto com o contexto do seu projeto. A IA vai seguir o processo certinho.

---

## 📋 VERSÃO CURTA (Prompt Rápido)

> Cole este prompt para builds simples:

```
Preciso que você transforme meu projeto web em um APK Android instalável usando Capacitor.

STACK DO MEU PROJETO:
- Framework: [Vite + React / Next.js / Vue / HTML puro]
- Pasta de output do build: [dist / build / out]
- Node.js: [versão]

CONFIGURAÇÕES DO APK:
- Nome do App: [Nome do App]
- Package ID: [com.meudominio.meuapp]
- Versão: [1.0.0]
- Ícone: [caminho do ícone se tiver]

REQUISITOS:
1. Compatível com Android 7.0+ (API 24) até Android 16+ (API 36)
2. Usar Capacitor 8.x (última versão estável)
3. Gradle 8.14+ e AGP 8.13+
4. Java 21
5. Build target ES2018 para compatibilidade com WebView antigo
6. Gerar APK de Debug para teste

PROCESSO:
1. Instalar Capacitor (core, cli, android)
2. Criar capacitor.config.json
3. Configurar vite.config.js para mobile (target: es2018, cssTarget: chrome61)
4. Rodar: npm run build
5. Rodar: npx cap add android (se primeira vez) ou npx cap sync android
6. Configurar android/variables.gradle com SDK versions corretas
7. Buildar APK: cd android && gradlew assembleDebug
8. Me mostrar onde está o APK gerado

CUIDADOS:
- Usar HashRouter ao invés de BrowserRouter (React Router)
- Não usar APIs exclusivas de browser (window.print, etc.)
- Base path deve ser './' no vite.config.js
- Verificar se dist/ foi gerado antes de sync
- Garantir que gradle.properties tem android.useAndroidX=true
```

---

## 📋 VERSÃO COMPLETA (Prompt Detalhado)

> Cole este prompt para builds completos com assinatura:

```
Preciso que você transforme meu projeto web em um APK Android profissional e pronto para distribuição. Siga EXATAMENTE este processo:

## INFORMAÇÕES DO PROJETO
- Framework: [Vite + React / Next.js / Vue / Angular / HTML puro]
- Pasta build output: [dist / build / out / .next]
- Node.js versão: [rode 'node --version']
- Nome do App: [Nome do Seu App]
- Package ID: [com.seudominio.seuapp]
- Versão inicial: [1.0.0]

## ESPECIFICAÇÕES TÉCNICAS OBRIGATÓRIAS
- Capacitor: 8.x (última versão)
- Gradle Wrapper: 8.14.x
- Android Gradle Plugin (AGP): 8.13.x
- Java/JDK: 21
- compileSdkVersion: 36
- targetSdkVersion: 36
- minSdkVersion: 24 (Android 7.0+)
- Build target JS: es2018
- Build target CSS: chrome61

## PROCESSO STEP-BY-STEP (NÃO PULE NENHUM)

### FASE 1: Preparação Web
1. Verificar se o projeto compila sem erros: npm run build
2. Configurar vite.config.js (ou equivalente) com:
   - base: './'
   - build.target: 'es2018'
   - build.cssTarget: 'chrome61'
   - build.outDir: 'dist'
   - rollupOptions.output.manualChunks: undefined
3. Se usar React Router, confirmar uso de HashRouter (NÃO BrowserRouter)
4. Remover/condicionar APIs incompatíveis com WebView:
   - window.print() → remover
   - @vercel/speed-insights → condicionar com !Capacitor.isNativePlatform()
   - navigator.share() → usar plugin @capacitor/share

### FASE 2: Instalação Capacitor
5. npm install @capacitor/core @capacitor/android
6. npm install -D @capacitor/cli
7. Criar capacitor.config.json:
{
  "appId": "com.seudominio.seuapp",
  "appName": "Nome Do Seu App",
  "webDir": "dist",
  "server": {
    "androidScheme": "https"
  }
}

### FASE 3: Criar Projeto Android
8. npm run build (gerar dist/ atualizado)
9. npx cap add android
10. npx cap sync android

### FASE 4: Configurar Android Nativo
11. Editar android/variables.gradle:
    - minSdkVersion = 24
    - compileSdkVersion = 36
    - targetSdkVersion = 36
12. Verificar android/gradle.properties:
    - android.useAndroidX=true
    - android.enableJetifier=true
    - org.gradle.jvmargs=-Xmx1536m
13. Verificar android/app/build.gradle:
    - applicationId correto
    - versionCode: 1
    - versionName: "1.0.0"

### FASE 5: Gerar APK
14. cd android
15. .\gradlew assembleDebug (Windows) ou ./gradlew assembleDebug (Mac/Linux)
16. Verificar APK gerado em: android/app/build/outputs/apk/debug/app-debug.apk
17. cd ..

### FASE 6: (Opcional) APK Assinado para Produção
18. Gerar keystore:
    keytool -genkeypair -v -keystore release.keystore -alias minha-chave -keyalg RSA -keysize 2048 -validity 10000
19. Adicionar signingConfig no build.gradle
20. .\gradlew assembleRelease
21. Verificar APK assinado

## VALIDAÇÕES OBRIGATÓRIAS ANTES DE FINALIZAR
- [ ] npm run build completa sem erros
- [ ] dist/ contém index.html e assets/
- [ ] npx cap sync android completa sem erros
- [ ] APK foi gerado com sucesso
- [ ] Me informar o tamanho do APK e caminho exato

## SE DER ERRO
- Mostrar o erro completo
- Diagnosticar a causa
- Corrigir e tentar novamente
- NUNCA pular etapas
```

---

## 📋 PROMPT PARA ATUALIZAR APK EXISTENTE

> Use quando já tem Capacitor configurado e quer gerar novo APK:

```
Meu projeto já tem Capacitor configurado. Preciso gerar um novo APK com as últimas alterações.

Siga este processo:
1. Atualizar a versão (se tiver bump-version.js):
   node bump-version.js [NOVA_VERSÃO]

2. Build do projeto web:
   npm run build

3. Verificar se dist/ foi gerado corretamente

4. Sincronizar com Android:
   npx cap sync android

5. Gerar o APK:
   cd android && .\gradlew assembleDebug && cd ..

6. Me informar o caminho e tamanho do APK

IMPORTANTE: Não altere nenhuma configuração existente.
Apenas rebuild e resync.
```

---

## 📋 PROMPT PARA ADICIONAR PLUGIN NATIVO

```
Preciso adicionar o plugin [NOME_DO_PLUGIN] ao meu projeto Capacitor.

Siga este processo:
1. Instalar o plugin: npm install @capacitor/[plugin]
2. Sincronizar: npx cap sync android
3. Verificar AndroidManifest.xml para permissões necessárias
4. Mostrar exemplo de código para usar o plugin
5. Rebuildar o APK se necessário

Capacitor version do projeto: 8.x
```

---

## 📋 PROMPT PARA MIGRAR PROJETO EXISTENTE

> Use quando tem um site pronto e quer transformar em APK pela primeira vez:

```
Tenho um site/web app PRONTO e funcionando. Preciso transformá-lo em um APK Android.

INFORMAÇÕES DO SITE:
- URL atual: [https://meusite.com]
- Tecnologias: [React/Vue/Angular/HTML]
- Bundler: [Vite/Webpack/CRA/nenhum]
- Backend: [Firebase/Supabase/API própria/nenhum]

QUERO QUE O APK:
- Funcione em Android 7.0+ (2016 em diante)
- Carregue o conteúdo [localmente do APK / da URL remota]
- Tenha o nome: [Nome do App]
- Tenha o ícone: [descrever ou enviar]
- Package ID: [com.empresa.app]

PROCESSO ESPERADO:
1. Analisar meu projeto
2. Instalar e configurar Capacitor
3. Ajustar configurações de build para mobile
4. Gerar projeto Android
5. Buildar APK
6. Me entregar o APK pronto

RESTRIÇÕES:
- NÃO alterar a UI/funcionalidade existente
- NÃO instalar dependências desnecessárias
- Manter compatibilidade com versão web
```

---

## 📋 PROMPT PARA RESOLVER ERROS DE BUILD

```
Estou tentando gerar um APK do meu projeto Capacitor e estou recebendo este erro:

[COLE O ERRO COMPLETO AQUI]

CONTEXTO:
- Capacitor version: [8.x]
- Node version: [x.x.x]
- Java version: [x]
- Sistema operacional: [Windows/Mac/Linux]
- Último comando executado: [o comando que deu erro]

Por favor:
1. Diagnostique a causa raiz do erro
2. Me dê a solução passo-a-passo
3. Verifique se a correção não quebra outras coisas
4. Me diga como prevenir este erro no futuro
```

---

## 🔑 DICAS PARA USAR OS PROMPTS

1. **Seja específico** — quanto mais detalhes sobre seu projeto, melhor
2. **Cole erros completos** — não resuma, cole o output inteiro
3. **Informe versões** — Node, Java, Capacitor fazem diferença
4. **Um passo de cada vez** — se der erro, pare e resolva antes de prosseguir
5. **Mantenha este documento** — atualize com novos prompts que funcionarem

---

> 📌 **Estes prompts foram testados e validados com Gemini, ChatGPT e Claude.**
> 📌 **Funcionam para qualquer projeto web moderno (React, Vue, Angular, HTML puro).**
