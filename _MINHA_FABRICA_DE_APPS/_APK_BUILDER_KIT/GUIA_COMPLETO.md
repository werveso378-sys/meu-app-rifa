# 📱 GUIA COMPLETO — De Projeto Web a APK Android

> **Versão:** 2.0 | **Atualizado:** Junho 2026  
> **Compatibilidade:** Android 6.0+ (API 23) até Android 16 (API 36+)  
> **Testado com:** Vite + React + Capacitor 7 + Gradle 8.x

---

## 📋 ÍNDICE

1. [Pré-requisitos do Ambiente](#1-pré-requisitos-do-ambiente)
2. [Estrutura do Projeto Web](#2-estrutura-do-projeto-web)
3. [Instalação do Capacitor](#3-instalação-do-capacitor)
4. [Configuração do Capacitor](#4-configuração-do-capacitor)
5. [Configuração do Vite para Mobile](#5-configuração-do-vite-para-mobile)
6. [Criação do Projeto Android](#6-criação-do-projeto-android)
7. [Configuração do Android Nativo](#7-configuração-do-android-nativo)
8. [Build do Projeto Web](#8-build-do-projeto-web)
9. [Sincronização com Android](#9-sincronização-com-android)
10. [Geração do APK](#10-geração-do-apk)
11. [Assinatura do APK para Produção](#11-assinatura-do-apk-para-produção)
12. [Distribuição e Instalação](#12-distribuição-e-instalação)

---

## 1. PRÉ-REQUISITOS DO AMBIENTE

### 🖥️ Software Necessário

| Software | Versão Mínima | Para quê serve |
|----------|--------------|-----------------|
| **Node.js** | 18 LTS (recomendado 22+) | Rodar o projeto web e ferramentas npm |
| **npm** | 9+ (vem com Node.js) | Gerenciador de pacotes |
| **Android Studio** | Ladybug (2024+) | IDE e SDK do Android |
| **JDK (Java)** | 17+ (incluso no Android Studio) | Compilador Gradle |

### ⚙️ Variáveis de Ambiente (Windows)

Abra **"Editar variáveis de ambiente do sistema"** e configure:

```
ANDROID_HOME = C:\Users\SEU_USUARIO\AppData\Local\Android\Sdk
JAVA_HOME    = C:\Program Files\Android\Android Studio\jbr
```

Adicione ao **PATH**:
```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\cmdline-tools\latest\bin
%ANDROID_HOME%\build-tools\35.0.0
%JAVA_HOME%\bin
```

### ✅ Verificação do Ambiente

Rode estes comandos no terminal para confirmar:

```powershell
node --version          # Deve mostrar v18+ ou v22+
npm --version           # Deve mostrar 9+
java -version           # Deve mostrar 17+
adb --version           # Deve mostrar Android Debug Bridge
```

---

## 2. ESTRUTURA DO PROJETO WEB

O projeto web pode usar **qualquer framework** moderno. A estrutura base é:

```
meu-projeto/
├── package.json          ← Configuração npm do projeto
├── vite.config.js        ← Config do bundler (ou webpack, etc.)
├── index.html            ← Ponto de entrada HTML
├── src/                  ← Código fonte
│   ├── main.jsx          ← Entry point React/Vue/etc
│   ├── App.jsx           ← Componente principal
│   ├── components/       ← Componentes reutilizáveis
│   ├── services/         ← Lógica de negócio/APIs
│   └── assets/           ← CSS, imagens, fontes
├── public/               ← Arquivos estáticos
└── dist/                 ← ⬅️ OUTPUT DO BUILD (gerado automaticamente)
```

> [!IMPORTANT]
> A pasta `dist/` é o que será empacotado no APK. Todo o projeto web é compilado pra dentro dela.

---

## 3. INSTALAÇÃO DO CAPACITOR

### Instalar dependências do Capacitor

```bash
# Core do Capacitor (runtime)
npm install @capacitor/core

# CLI do Capacitor (ferramentas de build)
npm install -D @capacitor/cli

# Plugin Android
npm install @capacitor/android
```

### Inicializar o Capacitor

```bash
npx cap init
```

Quando perguntado:
- **App name:** Nome do seu app (ex: "Meu App")
- **App Package ID:** Identificador único (ex: `com.seudominio.meuapp`)
- **Web asset directory:** `dist` (ou `build` se usar CRA)

---

## 4. CONFIGURAÇÃO DO CAPACITOR

Crie/edite o arquivo `capacitor.config.json` na raiz do projeto:

```json
{
  "appId": "com.seudominio.meuapp",
  "appName": "Nome Do Seu App",
  "webDir": "dist",
  "server": {
    "androidScheme": "https"
  },
  "plugins": {
    "SplashScreen": {
      "launchAutoHide": false
    }
  }
}
```

### 📝 Campos Importantes

| Campo | Descrição | Exemplo |
|-------|-----------|---------|
| `appId` | Identificador único do app (formato reverse domain) | `com.empresa.app` |
| `appName` | Nome exibido no celular | `"Meu App Incrível"` |
| `webDir` | Pasta onde o build web é gerado | `"dist"` ou `"build"` |
| `server.androidScheme` | Protocolo usado internamente | Sempre `"https"` |

> [!WARNING]
> O `appId` **NÃO pode ser alterado** depois de publicar na Play Store! Escolha com cuidado.

---

## 5. CONFIGURAÇÃO DO VITE PARA MOBILE

Edite o `vite.config.js` para garantir compatibilidade com Android antigo:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // ⬇️ CRITICAL: Garante compatibilidade com Android 8+ (2018+)
    target: 'es2018',
    cssTarget: 'chrome61',
    rollupOptions: {
      output: {
        manualChunks: undefined  // Bundle único, mais estável no WebView
      }
    }
  }
})
```

### 🎯 O que cada campo faz:

| Campo | Valor | Por quê |
|-------|-------|---------|
| `target` | `'es2018'` | JavaScript compatível com Android 8.0+ |
| `cssTarget` | `'chrome61'` | CSS compatível com WebView antigo |
| `manualChunks` | `undefined` | Evita problemas de carregamento no WebView |

> [!TIP]
> Se quiser suportar Android 6.0 (API 23), use `target: 'es2017'` e `cssTarget: 'chrome58'`.

---

## 6. CRIAÇÃO DO PROJETO ANDROID

### Adicionar plataforma Android

```bash
npx cap add android
```

Isso cria a pasta `android/` com toda a estrutura nativa do projeto Android.

### Estrutura gerada:

```
android/
├── app/
│   ├── build.gradle              ← Config de build do app
│   ├── src/main/
│   │   ├── AndroidManifest.xml   ← Permissões e configs do app
│   │   ├── java/.../             ← Código Java (MainActivity)
│   │   ├── assets/               ← Web assets copiados aqui
│   │   └── res/                  ← Ícones, cores, strings
├── build.gradle                  ← Config global do Gradle
├── variables.gradle              ← Versões do SDK e bibliotecas
├── settings.gradle               ← Módulos do projeto
├── gradle.properties             ← Propriedades do Gradle
├── gradlew / gradlew.bat         ← Wrapper do Gradle (executável)
└── gradle/wrapper/               ← Gradle wrapper files
```

---

## 7. CONFIGURAÇÃO DO ANDROID NATIVO

### 7.1 `android/variables.gradle` — Versões do SDK

```gradle
ext {
    minSdkVersion = 23              // Android 6.0 (mínimo recomendado)
    compileSdkVersion = 35          // Versão de compilação (última estável)
    targetSdkVersion = 35           // Versão alvo (requisito Google Play)

    // Bibliotecas AndroidX
    androidxAppCompatVersion = '1.7.0'
    androidxCoordinatorLayoutVersion = '1.2.0'
    coreSplashScreenVersion = '1.0.1'
    androidxActivityVersion = '1.8.0'
    androidxCoreVersion = '1.15.0'
    androidxWebkitVersion = '1.12.1'

    // Testes
    junitVersion = '4.13.2'
    androidxJunitVersion = '1.2.1'
    androidxEspressoCoreVersion = '3.6.1'
}
```

### 🎯 Tabela de Compatibilidade

| `minSdkVersion` | Android Mínimo | Ano | Dispositivos Cobertos |
|-----------------|---------------|------|----------------------|
| 21 | 5.0 Lollipop | 2014 | ~99.5% |
| 23 | 6.0 Marshmallow | 2015 | ~99% |
| **26** | **8.0 Oreo** | **2018** | **~97%** |
| 28 | 9.0 Pie | 2018 | ~95% |

> [!NOTE]
> Para celulares de 2018 em diante, `minSdkVersion = 26` cobre tudo. Se quiser máxima cobertura, use `23`.

### 7.2 `android/app/build.gradle` — Config do App

```gradle
apply plugin: 'com.android.application'

android {
    namespace "com.seudominio.meuapp"    // ← SEU PACKAGE
    compileSdk rootProject.ext.compileSdkVersion

    defaultConfig {
        applicationId "com.seudominio.meuapp"  // ← SEU PACKAGE
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
        versionCode 1                    // ← Incrementar a cada release
        versionName "1.0.0"              // ← Versão legível
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}

repositories {
    flatDir {
        dirs '../capacitor-cordova-android-plugins/src/main/libs', 'src/main/libs'
    }
}

apply from: 'capacitor.build.gradle'

dependencies {
    implementation fileTree(include: ['*.jar'], dir: 'libs')
    implementation "androidx.appcompat:appcompat:$androidxAppCompatVersion"
    implementation "androidx.coordinatorlayout:coordinatorlayout:$androidxCoordinatorLayoutVersion"
    implementation "androidx.core:core-splashscreen:$coreSplashScreenVersion"
    implementation project(':capacitor-android')
    testImplementation "junit:junit:$junitVersion"
    androidTestImplementation "androidx.test.ext:junit:$androidxJunitVersion"
    androidTestImplementation "androidx.test.espresso:espresso-core:$androidxEspressoCoreVersion"
    implementation project(':capacitor-cordova-android-plugins')
}
```

### 7.3 `android/build.gradle` — Config Global

```gradle
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.7.3'  // AGP version
    }
}

apply from: "variables.gradle"

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}
```

### 7.4 `android/settings.gradle`

```gradle
include ':app'
include ':capacitor-android'
project(':capacitor-android').projectDir = new File('../node_modules/@capacitor/android/capacitor')
include ':capacitor-cordova-android-plugins'
project(':capacitor-cordova-android-plugins').projectDir = new File('../capacitor-cordova-android-plugins')

apply from: 'capacitor.settings.gradle'
```

### 7.5 `android/gradle.properties`

```properties
org.gradle.jvmargs=-Xmx1536m
android.useAndroidX=true
android.enableJetifier=true
```

### 7.6 `android/app/src/main/AndroidManifest.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- ⬇️ Adicione permissões conforme necessário -->
    <!-- <uses-permission android:name="android.permission.INTERNET" /> -->
    <!-- <uses-permission android:name="android.permission.CAMERA" /> -->

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">

        <activity
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:exported="true"
            android:label="@string/title_activity_main"
            android:launchMode="singleTask"
            android:name=".MainActivity"
            android:theme="@style/AppTheme.NoActionBar">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="${applicationId}.fileprovider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths" />
        </provider>
    </application>
</manifest>
```

### 7.7 `MainActivity.java` — Mínimo necessário

```java
package com.seudominio.meuapp;  // ← SEU PACKAGE

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {}
```

> [!TIP]
> O `MainActivity.java` fica em: `android/app/src/main/java/com/seudominio/meuapp/MainActivity.java`
> A estrutura de pastas precisa refletir exatamente o package name.

---

## 8. BUILD DO PROJETO WEB

### Antes de buildar, verifique:

```bash
# Verificar se não há erros de lint
npm run lint

# Build do projeto web
npm run build
```

### Confirmar o build:

```powershell
# Verificar se a pasta dist foi gerada
dir dist/

# Deve conter:
# - index.html
# - assets/ (JS, CSS, imagens)
```

> [!CAUTION]
> Se o build falhar, **NÃO prossiga**. Corrija TODOS os erros antes de continuar.

---

## 9. SINCRONIZAÇÃO COM ANDROID

### Sincronizar web → Android

```bash
npx cap sync android
```

Este comando faz 3 coisas:
1. ✅ Copia `dist/` → `android/app/src/main/assets/public/`
2. ✅ Copia `capacitor.config.json` → `android/app/src/main/assets/`
3. ✅ Atualiza os plugins nativos do Capacitor

### ⚠️ Quando re-sincronizar:

Sempre rode `npx cap sync android` quando:
- Alterar qualquer código do projeto web
- Instalar/remover plugins do Capacitor
- Mudar a `capacitor.config.json`

---

## 10. GERAÇÃO DO APK

### 🔧 Método 1: Via Linha de Comando (Recomendado)

```powershell
# Entrar na pasta android
cd android

# Build de Debug (para teste)
.\gradlew assembleDebug

# Build de Release (para distribuição)
.\gradlew assembleRelease

# Voltar para a raiz
cd ..
```

### 📍 Onde encontrar o APK gerado:

| Tipo | Caminho |
|------|---------|
| **Debug** | `android/app/build/outputs/apk/debug/app-debug.apk` |
| **Release** | `android/app/build/outputs/apk/release/app-release-unsigned.apk` |

### 🖥️ Método 2: Via Android Studio

1. Abra o projeto no Android Studio:
   ```bash
   npx cap open android
   ```
2. Menu: **Build → Generate Signed Bundle / APK**
3. Selecione **APK**
4. Configure a keystore (ver seção 11)
5. Clique em **Finish**

---

## 11. ASSINATURA DO APK PARA PRODUÇÃO

### 11.1 Gerar um Keystore (Apenas uma vez!)

```powershell
keytool -genkeypair -v -keystore minha-chave-release.keystore -alias minha-chave -keyalg RSA -keysize 2048 -validity 10000
```

Será pedido:
- **Senha do keystore** (anote e guarde!)
- **Senha da chave** (pode ser a mesma)
- **Nome, Organização, Cidade, Estado, País**

> [!CAUTION]
> **NUNCA PERCA ESTA CHAVE!** Sem ela, você não consegue atualizar o app na Play Store.
> Guarde em local seguro (pendrive, cofre digital, etc.)
> **NUNCA commite o .keystore no Git!**

### 11.2 Assinar o APK

```powershell
# 1. Alinhar o APK (otimização)
zipalign -v 4 android/app/build/outputs/apk/release/app-release-unsigned.apk app-release-aligned.apk

# 2. Assinar com apksigner
apksigner sign --ks minha-chave-release.keystore --out app-release-final.apk app-release-aligned.apk

# 3. Verificar assinatura
apksigner verify app-release-final.apk
```

### 11.3 Assinatura Automática via Gradle (Recomendado)

Adicione ao `android/app/build.gradle`, DENTRO do bloco `android {}`:

```gradle
signingConfigs {
    release {
        storeFile file('../../minha-chave-release.keystore')
        storePassword 'SUA_SENHA'
        keyAlias 'minha-chave'
        keyPassword 'SUA_SENHA'
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    }
}
```

> [!WARNING]
> Em produção, use variáveis de ambiente ao invés de senhas no código:
> ```gradle
> storePassword System.getenv("KEYSTORE_PASSWORD")
> keyPassword System.getenv("KEY_PASSWORD")
> ```

---

## 12. DISTRIBUIÇÃO E INSTALAÇÃO

### 📲 Instalar direto no celular

```bash
# Via cabo USB (com depuração USB ativada)
adb install app-release-final.apk

# Ou simplesmente envie o APK por WhatsApp/email
# e abra no celular para instalar
```

### 🏪 Publicar na Google Play Store

1. Crie uma conta de desenvolvedor em [play.google.com/console](https://play.google.com/console)
2. Crie um novo app
3. Faça upload do APK assinado (ou AAB - Android App Bundle)
4. Preencha os dados (descrição, screenshots, classificação)
5. Publique!

> [!TIP]
> Para a Play Store, prefira gerar um **AAB** ao invés de APK:
> ```bash
> cd android && .\gradlew bundleRelease && cd ..
> ```
> O AAB fica em: `android/app/build/outputs/bundle/release/app-release.aab`

---

## 🔄 RESUMO DO FLUXO COMPLETO

```
┌─────────────────────────────────────────────────────────┐
│                    FLUXO DE BUILD                       │
│                                                         │
│  1. npm run build        → Compila o projeto web        │
│  2. npx cap sync android → Sincroniza com Android       │
│  3. cd android           → Entra na pasta Android       │
│  4. .\gradlew assembleRelease → Gera o APK              │
│  5. Assinar o APK        → Para distribuição             │
│  6. Instalar/Publicar    → Enviar para celulares         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Comando Único (Copie e Cole):

```powershell
npm run build && npx cap sync android && cd android && .\gradlew assembleRelease && cd ..
```

---

> 📌 **Este guia foi validado e testado com o projeto BabyGo Rifas (Vite + React + Capacitor 7)**  
> 📌 **Funciona para qualquer projeto web moderno que use Vite, Webpack, CRA, Next.js (exportado), ou HTML puro**
