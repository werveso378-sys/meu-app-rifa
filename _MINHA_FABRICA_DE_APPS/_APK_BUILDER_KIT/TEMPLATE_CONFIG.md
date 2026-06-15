# 📝 TEMPLATE DE CONFIGURAÇÃO — Copie e Adapte

> **Todos os arquivos de configuração necessários para transformar um projeto web em APK.**
> Copie cada arquivo, substitua os valores marcados com `[MUDAR]` e está pronto.

---

## 📋 ÍNDICE

1. [capacitor.config.json](#1-capacitorconfigjson)
2. [vite.config.js (Vite + React)](#2-viteconfigjs)
3. [vite.config.js (Vite + Vue)](#3-viteconfigjs-vue)
4. [webpack.config.js (Webpack)](#4-webpackconfigjs)
5. [android/variables.gradle](#5-androidvariablesgradle)
6. [android/build.gradle (root)](#6-androidbuildgradle-root)
7. [android/app/build.gradle](#7-androidappbuildgradle)
8. [android/settings.gradle](#8-androidsettingsgradle)
9. [android/gradle.properties](#9-androidgradleproperties)
10. [android/gradle-wrapper.properties](#10-gradle-wrapperproperties)
11. [AndroidManifest.xml](#11-androidmanifestxml)
12. [MainActivity.java](#12-mainactivityjava)
13. [.gitignore (adições para Android)](#13-gitignore)
14. [bump-version.js (script de versão)](#14-bump-versionjs)
15. [package.json (scripts necessários)](#15-packagejson-scripts)

---

## 1. `capacitor.config.json`

```json
{
  "appId": "com.SEUDOMINIO.SEUAPP",
  "appName": "NOME_DO_APP",
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

**Valores para mudar:**
| Campo | O que colocar | Exemplo |
|-------|--------------|---------|
| `appId` | Identificador único reverse-domain | `com.minhaempresa.meuapp` |
| `appName` | Nome que aparece no celular | `"Meu App Incrível"` |
| `webDir` | Pasta do build web | `"dist"` (Vite) ou `"build"` (CRA) |

---

## 2. `vite.config.js` (Vite + React)

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2018',
    cssTarget: 'chrome61',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
```

---

## 3. `vite.config.js` (Vite + Vue)

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2018',
    cssTarget: 'chrome61',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
```

---

## 4. `webpack.config.js` (se usar Webpack)

Adicione ao `output`:
```javascript
module.exports = {
  output: {
    publicPath: './',
    // ... resto da config
  },
  target: ['web', 'es2018'],
  // ... resto da config
}
```

---

## 5. `android/variables.gradle`

```gradle
ext {
    minSdkVersion = 24
    compileSdkVersion = 36
    targetSdkVersion = 36

    androidxActivityVersion = '1.11.0'
    androidxAppCompatVersion = '1.7.1'
    androidxCoordinatorLayoutVersion = '1.3.0'
    androidxCoreVersion = '1.17.0'
    androidxFragmentVersion = '1.8.9'
    coreSplashScreenVersion = '1.2.0'
    androidxWebkitVersion = '1.14.0'

    junitVersion = '4.13.2'
    androidxJunitVersion = '1.3.0'
    androidxEspressoCoreVersion = '3.7.0'

    cordovaAndroidVersion = '14.0.1'
}
```

**⚠️ NOTA:** Estas versões são de Junho/2026. Ao usar em novos projetos, rode `npx cap add android` que ele gera com as versões mais recentes automaticamente.

---

## 6. `android/build.gradle` (root)

```gradle
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.13.0'
        // Se usar Firebase, descomente:
        // classpath 'com.google.gms:google-services:4.4.4'
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

---

## 7. `android/app/build.gradle`

```gradle
apply plugin: 'com.android.application'

android {
    namespace = "com.SEUDOMINIO.SEUAPP"
    compileSdk = rootProject.ext.compileSdkVersion

    defaultConfig {
        applicationId "com.SEUDOMINIO.SEUAPP"
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
        versionCode 1
        versionName "1.0.0"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        aaptOptions {
            ignoreAssetsPattern = '!.svn:!.git:!.ds_store:!*.scc:.*:!CVS:!thumbs.db:!picasa.ini:!*~'
        }
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
        dirs '../capacitor-cordova-android-plugins/src/main/libs', 'libs'
    }
}

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

apply from: 'capacitor.build.gradle'

// Se usar Firebase, descomente:
// try {
//     def servicesJSON = file('google-services.json')
//     if (servicesJSON.text) {
//         apply plugin: 'com.google.gms.google-services'
//     }
// } catch(Exception e) {
//     logger.info("google-services.json not found")
// }
```

**Valores para mudar:**
- `namespace` e `applicationId`: Seu package ID (ex: `com.empresa.app`)
- `versionCode`: Incrementar a cada release
- `versionName`: Versão legível (ex: `"1.0.0"`)

---

## 8. `android/settings.gradle`

```gradle
include ':app'
include ':capacitor-cordova-android-plugins'
project(':capacitor-cordova-android-plugins').projectDir = new File('./capacitor-cordova-android-plugins/')

apply from: 'capacitor.settings.gradle'
```

---

## 9. `android/gradle.properties`

```properties
org.gradle.jvmargs=-Xmx1536m
android.useAndroidX=true
android.enableJetifier=true
```

---

## 10. `gradle-wrapper.properties`

Arquivo: `android/gradle/wrapper/gradle-wrapper.properties`

```properties
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-8.14.3-all.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
```

---

## 11. `AndroidManifest.xml`

Arquivo: `android/app/src/main/AndroidManifest.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">

        <activity
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode|navigation|density"
            android:name=".MainActivity"
            android:label="@string/title_activity_main"
            android:theme="@style/AppTheme.NoActionBarLaunch"
            android:launchMode="singleTask"
            android:exported="true">
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

    <!-- Permissões básicas -->
    <uses-permission android:name="android.permission.INTERNET" />

    <!-- Descomente conforme necessário: -->
    <!-- <uses-permission android:name="android.permission.CAMERA" /> -->
    <!-- <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" /> -->
    <!-- <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" /> -->
    <!-- <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" /> -->
    <!-- <uses-permission android:name="android.permission.VIBRATE" /> -->
</manifest>
```

---

## 12. `MainActivity.java`

Arquivo: `android/app/src/main/java/com/SEUDOMINIO/SEUAPP/MainActivity.java`

```java
package com.SEUDOMINIO.SEUAPP;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {}
```

**⚠️ A estrutura de pastas (java/com/SEUDOMINIO/SEUAPP/) deve refletir exatamente o package ID.**

---

## 13. `.gitignore` (adições para Android)

Adicione ao seu `.gitignore`:

```gitignore
# Android
android/.gradle/
android/app/build/
android/build/
android/capacitor-cordova-android-plugins/build/

# Keystores (NUNCA commitar!)
*.keystore
*.jks
key.properties

# IDE
.idea/
*.iml

# Local Properties
android/local.properties
```

---

## 14. `bump-version.js`

Script para atualizar versão automaticamente:

```javascript
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const newVersion = args[0];

if (!newVersion) {
  console.error("Uso: node bump-version.js <nova-versao>");
  console.error("Exemplo: node bump-version.js 1.0.2");
  process.exit(1);
}

// 1. Atualiza package.json
const pkgPath = path.resolve('./package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.version = newVersion;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
console.log(`✅ package.json atualizado para ${newVersion}`);

// 2. Atualiza build.gradle do Android
const gradlePath = path.resolve('./android/app/build.gradle');
if (fs.existsSync(gradlePath)) {
  let gradleContent = fs.readFileSync(gradlePath, 'utf8');

  const versionCodeMatch = gradleContent.match(/versionCode\s+(\d+)/);
  if (versionCodeMatch) {
    const currentCode = parseInt(versionCodeMatch[1], 10);
    const newCode = currentCode + 1;

    gradleContent = gradleContent.replace(/versionCode\s+\d+/, `versionCode ${newCode}`);
    gradleContent = gradleContent.replace(/versionName\s+".*"/, `versionName "${newVersion}"`);

    fs.writeFileSync(gradlePath, gradleContent);
    console.log(`✅ build.gradle atualizado: versionCode ${newCode}, versionName "${newVersion}"`);
  }
} else {
  console.warn("⚠️ android/app/build.gradle não encontrado. (Ignorando)");
}

console.log("\n🚀 Versão atualizada! Agora rode: npm run build && npx cap sync android");
```

---

## 15. `package.json` (scripts necessários)

Adicione estes scripts ao seu `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "cap:sync": "npx cap sync android",
    "cap:open": "npx cap open android",
    "apk:debug": "npm run build && npx cap sync android && cd android && gradlew assembleDebug && cd ..",
    "apk:release": "npm run build && npx cap sync android && cd android && gradlew assembleRelease && cd ..",
    "bump": "node bump-version.js"
  }
}
```

**Com isso, basta rodar:**
```bash
# Build completo de debug
npm run apk:debug

# Build completo de release
npm run apk:release

# Atualizar versão
npm run bump 1.0.3
```

---

> 📌 **Todos os templates são baseados no projeto RifasBabyGo validado e funcionando.**
> 📌 **Adaptáveis para React, Vue, Angular, Svelte ou HTML puro.**
