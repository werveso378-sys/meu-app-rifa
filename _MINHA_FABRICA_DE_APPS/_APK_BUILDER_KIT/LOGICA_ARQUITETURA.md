# 🧠 LÓGICA E ARQUITETURA — Como Funciona por Trás

> **Entenda a fundo cada peça do sistema de build Web → APK Android**  
> Este documento explica a lógica, o "porquê" de cada decisão e como tudo se conecta.

---

## 📋 ÍNDICE

1. [Visão Geral da Arquitetura](#1-visão-geral-da-arquitetura)
2. [O Que é o Capacitor](#2-o-que-é-o-capacitor)
3. [Fluxo de Dados Completo](#3-fluxo-de-dados-completo)
4. [Como o Gradle Funciona](#4-como-o-gradle-funciona)
5. [Modos de Operação do Capacitor](#5-modos-de-operação-do-capacitor)
6. [Versionamento](#6-versionamento)
7. [Plugins Nativos](#7-plugins-nativos)
8. [Estrutura de Pastas Android Explicada](#8-estrutura-de-pastas-android-explicada)
9. [O Papel de Cada Arquivo de Configuração](#9-o-papel-de-cada-arquivo-de-configuração)
10. [Arquitetura de Dois Universos: Web vs APK](#10-arquitetura-de-dois-universos-web-vs-apk)

---

## 1. VISÃO GERAL DA ARQUITETURA

```
┌──────────────────────────────────────────────────────────────────┐
│                    ARQUITETURA COMPLETA                          │
│                                                                  │
│  ┌─────────────┐    ┌──────────────┐    ┌───────────────────┐   │
│  │   SEU CÓDIGO │    │   CAPACITOR  │    │   ANDROID NATIVO  │   │
│  │   (React)    │───▶│   (Ponte)    │───▶│   (APK Final)     │   │
│  │             │    │              │    │                   │   │
│  │  HTML/CSS/JS │    │  WebView +   │    │  Gradle + JDK    │   │
│  │  Components  │    │  Plugins     │    │  AndroidManifest  │   │
│  │  Services    │    │  Bridge      │    │  MainActivity     │   │
│  └─────────────┘    └──────────────┘    └───────────────────┘   │
│       ▲                    ▲                      ▲              │
│       │                    │                      │              │
│   npm run build      npx cap sync         gradlew assemble      │
│   (Vite → dist/)     (dist → android)     (android → APK)       │
└──────────────────────────────────────────────────────────────────┘
```

### As 3 Camadas:

| Camada | Tecnologia | Responsabilidade |
|--------|-----------|-----------------|
| **Web** | Vite + React | Interface, lógica de negócio, API calls |
| **Ponte** | Capacitor | Conecta Web ↔ Android, plugins nativos |
| **Nativa** | Android SDK + Gradle | Empacota tudo em APK instalável |

---

## 2. O QUE É O CAPACITOR

O **Capacitor** é uma "ponte" (bridge) criada pelo time do Ionic Framework. Ele permite que um **site/web app** rode dentro de um **app Android nativo** como se fosse um app real.

### Como funciona internamente:

```
┌────────────────────────────────────────┐
│          APP ANDROID NATIVO             │
│  ┌──────────────────────────────────┐  │
│  │          WEBVIEW (Chrome)         │  │
│  │  ┌────────────────────────────┐  │  │
│  │  │     SEU SITE/WEB APP       │  │  │
│  │  │     (HTML + CSS + JS)      │  │  │
│  │  └────────────────────────────┘  │  │
│  │              ▲   │               │  │
│  │              │   ▼               │  │
│  │       CAPACITOR BRIDGE           │  │
│  │  (JavaScript ↔ Java/Kotlin)      │  │
│  └──────────────────────────────────┘  │
│              ▲   │                     │
│              │   ▼                     │
│     PLUGINS NATIVOS (Câmera,           │
│     Push Notifications, GPS, etc.)     │
└────────────────────────────────────────┘
```

### Em palavras simples:
1. O Android abre um **WebView** (mini Chrome embutido)
2. O WebView carrega seu **site/app web**
3. O **Capacitor Bridge** permite que o JavaScript chame funções nativas (câmera, notificações, etc.)
4. Para o usuário, parece um **app nativo normal**

---

## 3. FLUXO DE DADOS COMPLETO

### Passo a passo do que acontece:

```
1. DESENVOLVIMENTO
   ├── Você escreve código em React (JSX/CSS/JS)
   ├── Componentes em src/components/
   ├── Serviços em src/services/
   └── Páginas em src/pages/

2. BUILD WEB (npm run build)
   ├── Vite processa todos os arquivos
   ├── Transpila JSX → JavaScript puro
   ├── Minifica CSS e JS
   ├── Otimiza imagens
   └── Gera tudo em dist/
       ├── index.html
       └── assets/
           ├── index-abc123.js  (bundle JS)
           └── index-def456.css (bundle CSS)

3. SYNC (npx cap sync android)
   ├── Copia dist/ → android/app/src/main/assets/public/
   ├── Copia capacitor.config.json → android/app/src/main/assets/
   ├── Gera capacitor.plugins.json (lista de plugins)
   ├── Atualiza capacitor.settings.gradle (módulos)
   └── Atualiza capacitor.build.gradle (dependências)

4. BUILD ANDROID (gradlew assembleRelease)
   ├── Gradle baixa dependências (Maven/Google)
   ├── Compila Java (MainActivity + Capacitor + Plugins)
   ├── Empacota assets + resources + código compilado
   ├── Gera o .apk
   └── Output: android/app/build/outputs/apk/
```

---

## 4. COMO O GRADLE FUNCIONA

Gradle é o **sistema de build** do Android. Ele é como o `npm` do mundo Android.

### Hierarquia de arquivos Gradle:

```
android/
├── build.gradle              ← Config GLOBAL (repositórios, AGP version)
├── variables.gradle          ← VARIÁVEIS compartilhadas (SDK versions)
├── settings.gradle           ← MÓDULOS do projeto (quais pastas incluir)
├── gradle.properties         ← PROPRIEDADES do Gradle (memória, flags)
├── gradle/wrapper/
│   └── gradle-wrapper.properties  ← VERSÃO do Gradle
└── app/
    ├── build.gradle          ← Config do APP (appId, versionCode, deps)
    ├── capacitor.build.gradle ← AUTO-GERADO pelo Capacitor (plugins)
    └── proguard-rules.pro    ← Regras de ofuscação de código
```

### O que cada arquivo faz:

| Arquivo | Analogia npm | Função |
|---------|-------------|--------|
| `build.gradle` (root) | `package.json` (monorepo) | Config global de todos os módulos |
| `variables.gradle` | `.nvmrc` | Define versões (SDK, bibliotecas) |
| `settings.gradle` | `workspaces` | Lista módulos do projeto |
| `gradle.properties` | `.npmrc` | Flags e configurações do Gradle |
| `app/build.gradle` | `package.json` (app) | Config específica do app |
| `capacitor.build.gradle` | `package-lock.json` | Auto-gerado pelo `cap sync` |

### Versões Importantes (Compatibilidade):

| Componente | Versão Mínima | Versão Recomendada |
|-----------|--------------|-------------------|
| **Gradle** | 8.4+ | 8.14.x |
| **AGP (Android Gradle Plugin)** | 8.3+ | 8.13.x |
| **JDK (Java)** | 17 | 21 |
| **Android SDK compileSdk** | 34 | 36 |
| **Android SDK targetSdk** | 34 | 36 |

---

## 5. MODOS DE OPERAÇÃO DO CAPACITOR

O Capacitor tem **dois modos** de carregar seu app:

### Modo 1: LOCAL (Padrão — Recomendado para a maioria)

```json
// capacitor.config.json
{
  "appId": "com.seudominio.app",
  "webDir": "dist"
  // SEM server.url
}
```

- ✅ O app carrega os arquivos da pasta `dist/` empacotados dentro do APK
- ✅ Funciona **offline** (sem internet)
- ✅ Carregamento instantâneo
- ❌ Para atualizar, precisa gerar novo APK

### Modo 2: REMOTO (Usado no BabyGo Rifas)

```json
// capacitor.config.json
{
  "appId": "com.seudominio.app",
  "webDir": "dist",
  "server": {
    "url": "https://meusite.vercel.app",
    "cleartext": true
  }
}
```

- ✅ O app carrega o site da URL remota (Vercel, Netlify, etc.)
- ✅ Atualizações automáticas (mudou o site, mudou o app)
- ❌ **Requer internet** para funcionar
- ❌ Mais lento (depende da conexão)

### Quando usar cada modo:

| Cenário | Modo Recomendado |
|---------|-----------------|
| App de produção final | LOCAL |
| App que muda frequentemente | REMOTO |
| App que precisa funcionar offline | LOCAL |
| App para equipe interna/admin | REMOTO funciona bem |
| App para distribuição na Play Store | LOCAL (obrigatório) |

> [!IMPORTANT]
> Para **qualquer novo projeto**, recomendamos o **Modo LOCAL** por padrão.
> O Modo Remoto é útil para desenvolvimento e apps internos.

---

## 6. VERSIONAMENTO

### Sistema de Versões (Semantic Versioning):

```
versionName: "1.2.3"
                │ │ │
                │ │ └── PATCH: Correções de bugs
                │ └──── MINOR: Novas features (sem quebrar)
                └────── MAJOR: Mudanças que quebram compatibilidade
```

### Onde o versionamento vive:

| Arquivo | Campo | Tipo | Exemplo |
|---------|-------|------|---------|
| `package.json` | `version` | String | `"1.0.2"` |
| `android/app/build.gradle` | `versionName` | String | `"1.0.2"` |
| `android/app/build.gradle` | `versionCode` | Integer | `3` |

### Regras do `versionCode`:

- É um **número inteiro** que a Play Store usa internamente
- **DEVE ser incrementado** a cada nova release
- Não pode diminuir (1 → 2 → 3 → ...)
- É **independente** do `versionName`

### Script de Bump Automático:

O script `bump-version.js` automatiza isso:

```bash
# Atualizar versão para 1.0.3
node bump-version.js 1.0.3
# → Atualiza package.json (version)
# → Atualiza build.gradle (versionCode +1, versionName)
```

---

## 7. PLUGINS NATIVOS

O Capacitor permite acessar funcionalidades nativas via plugins JavaScript.

### Como um plugin funciona:

```
JavaScript (seu código)
    │
    ▼
Capacitor.Plugins.Camera.getPhoto()
    │
    ▼
Capacitor Bridge (JavaScript ↔ Java)
    │
    ▼
CameraPlugin.java (código nativo Android)
    │
    ▼
API da Câmera do Android
```

### Plugins oficiais mais comuns:

| Plugin | npm Package | Para quê |
|--------|------------|----------|
| Camera | `@capacitor/camera` | Tirar fotos / escolher da galeria |
| Push | `@capacitor/push-notifications` | Notificações push (FCM) |
| Share | `@capacitor/share` | Compartilhar conteúdo |
| Browser | `@capacitor/browser` | Abrir URLs no navegador |
| Clipboard | `@capacitor/clipboard` | Copiar/colar texto |
| StatusBar | `@capacitor/status-bar` | Controlar barra de status |
| Keyboard | `@capacitor/keyboard` | Controlar teclado virtual |
| Geolocation | `@capacitor/geolocation` | GPS / Localização |

### Como instalar um plugin:

```bash
# 1. Instalar via npm
npm install @capacitor/camera

# 2. Sincronizar com Android
npx cap sync android

# 3. Usar no código
import { Camera } from '@capacitor/camera';
const photo = await Camera.getPhoto({ quality: 90 });
```

---

## 8. ESTRUTURA DE PASTAS ANDROID EXPLICADA

```
android/
├── app/                          ← MÓDULO PRINCIPAL DO APP
│   ├── build.gradle              ← Configurações de compilação
│   ├── google-services.json      ← Config Firebase (se usar)
│   ├── proguard-rules.pro        ← Ofuscação de código
│   ├── src/
│   │   └── main/
│   │       ├── AndroidManifest.xml    ← "Identidade" do app
│   │       ├── assets/
│   │       │   ├── public/            ← SEU SITE ESTÁ AQUI!
│   │       │   │   ├── index.html
│   │       │   │   └── assets/
│   │       │   ├── capacitor.config.json
│   │       │   └── capacitor.plugins.json
│   │       ├── java/com/seupackage/
│   │       │   └── MainActivity.java  ← Ponto de entrada nativo
│   │       └── res/
│   │           ├── mipmap-*/          ← ÍCONES do app (várias densidades)
│   │           ├── drawable/          ← SPLASH SCREEN, backgrounds
│   │           ├── values/
│   │           │   ├── strings.xml    ← Textos (nome do app)
│   │           │   ├── colors.xml     ← Cores do tema
│   │           │   └── styles.xml     ← Estilos do tema
│   │           └── xml/
│   │               └── file_paths.xml ← Config de compartilhamento
│   └── build/                    ← OUTPUT (gerado pelo Gradle)
│       └── outputs/apk/
│           ├── debug/app-debug.apk
│           └── release/app-release-unsigned.apk
│
├── capacitor-cordova-android-plugins/  ← Plugins de compatibilidade
├── gradle/wrapper/               ← Gradle Wrapper (auto-download)
└── [configs Gradle]              ← Já explicados na seção 4
```

---

## 9. O PAPEL DE CADA ARQUIVO DE CONFIGURAÇÃO

### Mapa Mental de Configurações:

```
capacitor.config.json
    └── Define: appId, appName, webDir, server URL, plugins
         └── Impacto: Todo o projeto (web + android)

vite.config.js
    └── Define: build target, output dir, base path
         └── Impacto: Apenas o build web (dist/)

android/variables.gradle
    └── Define: SDK versions, library versions
         └── Impacto: Compilação Android

android/app/build.gradle
    └── Define: appId, versionCode, versionName, dependencies
         └── Impacto: APK final gerado

android/app/src/main/AndroidManifest.xml
    └── Define: permissões, ícone, tema, activities
         └── Impacto: Comportamento do app instalado

android/gradle.properties
    └── Define: flags do Gradle (memória, AndroidX)
         └── Impacto: Processo de compilação
```

---

## 10. ARQUITETURA DE DOIS UNIVERSOS: WEB vs APK

### Como o mesmo código serve Web e APK:

```javascript
import { Capacitor } from '@capacitor/core';

// Detectar se está rodando no app nativo ou no browser
if (Capacitor.isNativePlatform()) {
  // ← Está dentro do APK (Android/iOS)
  console.log('Rodando no app nativo!');
} else {
  // ← Está no browser (Chrome, Safari, etc.)
  console.log('Rodando no navegador!');
}
```

### Casos de uso típicos:

```javascript
// Exemplo 1: Roteamento diferente
if (Capacitor.isNativePlatform()) {
  // No APK, mostrar apenas tela de Admin
  navigate('/admin');
} else {
  // Na web, mostrar site público
  navigate('/');
}

// Exemplo 2: Features nativas
if (Capacitor.isNativePlatform()) {
  // Pode usar push notifications
  PushNotifications.requestPermissions();
} else {
  // No browser, usar Web Notifications (ou nada)
  Notification.requestPermission();
}

// Exemplo 3: Remover funcionalidades incompatíveis
if (!Capacitor.isNativePlatform()) {
  // Vercel Speed Insights só funciona no browser
  import('@vercel/speed-insights/react');
}
```

### Por que separar Web e APK?

| Aspecto | Web (Browser) | APK (Android) |
|---------|--------------|---------------|
| **Público** | Visitantes do site | Admin/equipe interna |
| **Atualizações** | Instantâneas (deploy) | Precisa gerar novo APK |
| **Funcionalidades** | Limitadas (browser) | Completas (nativo) |
| **Performance** | Depende do browser | WebView otimizado |
| **Distribuição** | URL compartilhável | APK instalável |

---

> 📌 **Com este conhecimento, você entende exatamente como cada peça se encaixa para transformar um projeto web em um APK Android funcional.**
