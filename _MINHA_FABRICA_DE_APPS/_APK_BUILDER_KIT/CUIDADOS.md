# ⚠️ CUIDADOS E PROBLEMAS COMUNS — Build de APK

> **Documento de Referência para Troubleshooting**  
> Leia este documento ANTES de iniciar o build e SEMPRE que encontrar um erro.

---

## 📋 ÍNDICE

1. [Cuidados ANTES do Build](#1-cuidados-antes-do-build)
2. [Erros Mais Comuns e Soluções](#2-erros-mais-comuns-e-soluções)
3. [Cuidados com a Keystore](#3-cuidados-com-a-keystore)
4. [Cuidados com Compatibilidade](#4-cuidados-com-compatibilidade)
5. [Cuidados com Performance](#5-cuidados-com-performance)
6. [Cuidados com o WebView](#6-cuidados-com-o-webview)
7. [Checklist de Segurança](#7-checklist-de-segurança)
8. [Fluxo de Diagnóstico](#8-fluxo-de-diagnóstico)

---

## 1. CUIDADOS ANTES DO BUILD

### 🔴 NUNCA faça:
- ❌ Build sem rodar `npm run build` primeiro
- ❌ Pular o `npx cap sync android`
- ❌ Commitar o arquivo `.keystore` no Git
- ❌ Usar senhas em texto plano no `build.gradle` em produção
- ❌ Alterar o `appId` depois de publicar na Play Store
- ❌ Deletar a pasta `android/` sem necessidade (perde configs customizadas)
- ❌ Misturar versões do `@capacitor/core` e `@capacitor/android`

### 🟢 SEMPRE faça:
- ✅ Verificar se `npm run build` completa sem erros
- ✅ Rodar `npx cap sync android` antes de cada build
- ✅ Manter as versões do Capacitor sincronizadas (core, cli, android)
- ✅ Fazer backup da keystore em local seguro
- ✅ Incrementar `versionCode` a cada nova release
- ✅ Testar no emulador ANTES de instalar no celular real
- ✅ Verificar a pasta `dist/` contém `index.html` e `assets/`

---

## 2. ERROS MAIS COMUNS E SOLUÇÕES

### 2.1 `"JAVA_HOME is not set"` ou `"Unsupported class file major version"`

**Causa:** Java/JDK não configurado ou versão incompatível.

**Solução:**
```powershell
# Verificar versão do Java
java -version

# Deve mostrar versão 17 ou 21
# Se não, configure o JAVA_HOME:
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
```

Ou adicione permanentemente nas variáveis de ambiente do Windows.

---

### 2.2 `"Could not determine the dependencies of task ':app:compileDebugJavaWithJavac'"`

**Causa:** Gradle desatualizado ou problemas de cache.

**Solução:**
```powershell
cd android

# Limpar cache do Gradle
.\gradlew clean

# Tentar novamente
.\gradlew assembleDebug

cd ..
```

Se persistir:
```powershell
# Deletar cache completo
Remove-Item -Recurse -Force android\.gradle
Remove-Item -Recurse -Force android\app\build

# Rebuild
cd android && .\gradlew assembleDebug && cd ..
```

---

### 2.3 `"Missing dist directory"` ou `"Web assets directory not found"`

**Causa:** A pasta `dist/` não existe ou está vazia.

**Solução:**
```powershell
# 1. Fazer o build do projeto web
npm run build

# 2. Verificar se dist/ existe
dir dist/

# 3. Só depois sincronizar
npx cap sync android
```

---

### 2.4 `"Package android.support.* does not exist"`

**Causa:** Plugin antigo usando bibliotecas Support ao invés de AndroidX.

**Solução:**
```powershell
# Instalar o Jetifier
npm install jetifier

# Executar migração
npx jetify

# Re-sincronizar
npx cap sync android
```

E verificar se `android/gradle.properties` contém:
```properties
android.useAndroidX=true
android.enableJetifier=true
```

---

### 2.5 `"SDK location not found"` ou `"ANDROID_HOME not set"`

**Causa:** Android SDK não configurado no sistema.

**Solução:**
```powershell
# Criar arquivo local.properties na pasta android/
echo "sdk.dir=C\:\\Users\\SEU_USUARIO\\AppData\\Local\\Android\\Sdk" > android\local.properties
```

Ou configure `ANDROID_HOME` nas variáveis de ambiente (ver GUIA_COMPLETO.md, seção 1).

---

### 2.6 `"Error: Cannot find module '@capacitor/android'"` ou plugins não encontrados

**Causa:** `node_modules` ausente ou corrompido.

**Solução:**
```powershell
# Reinstalar dependências
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install

# Re-sincronizar
npx cap sync android
```

---

### 2.7 `"Execution failed for task ':capacitor-cordova-android-plugins:...'"` (AGP/ProGuard)

**Causa:** Versão do Android Gradle Plugin (AGP) incompatível com ProGuard antigo.

**Solução:**

Editar `android/app/build.gradle`, troque:
```gradle
// ❌ ANTIGO (causa erro em AGP 9+)
proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'

// ✅ NOVO (compatível com todas as versões)
proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
```

---

### 2.8 App abre mas mostra tela branca

**Causa:** Caminhos relativos no HTML ou problemas de roteamento.

**Soluções:**
1. Verificar se `vite.config.js` tem `base: './'` (ou deixar como padrão)
2. No React Router, usar `<HashRouter>` ao invés de `<BrowserRouter>`:
   ```jsx
   // ✅ CORRETO para Capacitor
   import { HashRouter } from 'react-router-dom';
   
   // ❌ EVITAR em apps Capacitor
   import { BrowserRouter } from 'react-router-dom';
   ```
3. Verificar se `dist/index.html` existe e não está vazio

---

### 2.9 App não carrega recursos (CSS, JS, imagens)

**Causa:** Caminhos absolutos que não funcionam no WebView.

**Solução:**
- Usar caminhos relativos (`./`) ao invés de absolutos (`/`)
- No Vite, verificar se `base` está correto no `vite.config.js`
- Garantir que as imagens estão em `public/` ou sendo importadas via `import`

---

### 2.10 `"Gradle build daemon disappeared unexpectedly"` (Out of Memory)

**Causa:** Pouca memória alocada para o Gradle.

**Solução:**
Editar `android/gradle.properties`:
```properties
# Aumentar memória (padrão: 1536m)
org.gradle.jvmargs=-Xmx2048m -XX:+HeapDumpOnOutOfMemoryError
```

---

## 3. CUIDADOS COM A KEYSTORE

### 🔐 Regras de Ouro da Keystore

| Regra | Detalhes |
|-------|---------|
| **Guarde em local seguro** | Pendrive, cofre digital, Google Drive criptografado |
| **Anote as senhas** | Keystore password + Key password (podem ser diferentes) |
| **Anote o alias** | O nome da chave dentro do keystore |
| **NUNCA commite no Git** | Adicione ao `.gitignore`: `*.keystore`, `*.jks` |
| **Faça backup** | Se perder, nunca mais poderá atualizar o app na Play Store |
| **Validade longa** | Use `-validity 10000` (27+ anos) |

### Adicionar ao `.gitignore`:
```
# Keystore
*.keystore
*.jks
key.properties
```

---

## 4. CUIDADOS COM COMPATIBILIDADE

### APIs do Browser que NÃO funcionam no Android WebView:

| API | Status | Alternativa |
|-----|--------|-------------|
| `window.print()` | ❌ Não funciona | Gerar PDF com jsPDF |
| `navigator.share()` | ⚠️ Parcial | Plugin `@capacitor/share` |
| `Notification API` | ❌ Não funciona | Plugin `@capacitor/push-notifications` |
| `navigator.geolocation` | ⚠️ Requer permissão | Plugin `@capacitor/geolocation` |
| `window.open()` | ⚠️ Pode não abrir | Plugin `@capacitor/browser` |
| `localStorage` | ✅ Funciona | Funciona normalmente |
| `fetch / XMLHttpRequest` | ✅ Funciona | Funciona com CORS |
| `CSS Variables` | ✅ Funciona | Funciona normalmente |
| `CSS Grid / Flexbox` | ✅ Funciona | Funciona normalmente |

### Versões CSS/JS por Android:

| Android | Chrome WebView | ES Support | CSS Support |
|---------|---------------|------------|-------------|
| 8.0 (2018) | Chrome 61-64 | ES2017 | Grid, Variables, Flexbox |
| 9.0 (2018) | Chrome 69-74 | ES2018 | Tudo acima + mais |
| 10+ (2019+) | Chrome 74+ | ES2020+ | Tudo moderno |
| 12+ (2021+) | Chrome 90+ | ES2022+ | Tudo moderno |

---

## 5. CUIDADOS COM PERFORMANCE

### ⚡ Otimizações Importantes:

1. **Imagens**: Use formatos WebP ao invés de PNG/JPEG (50-70% menor)
2. **Bundle Size**: Mantenha o bundle abaixo de 5MB se possível
3. **Lazy Loading**: Use `React.lazy()` para componentes pesados
4. **Fontes**: Use `font-display: swap` para evitar FOIT
5. **Animações**: Use `transform` e `opacity` (são GPU-accelerated)
6. **Evite**: `setInterval` com menos de 16ms, animações CSS complexas

### Verificar tamanho do bundle:

```powershell
# Verificar tamanho da pasta dist
(Get-ChildItem -Recurse dist | Measure-Object -Property Length -Sum).Sum / 1MB
# Deve estar abaixo de 10MB idealmente
```

---

## 6. CUIDADOS COM O WEBVIEW

### Configurações importantes no `capacitor.config.json`:

```json
{
  "server": {
    "androidScheme": "https",
    "allowNavigation": ["*.seudominio.com"]
  },
  "android": {
    "allowMixedContent": false,
    "captureInput": true,
    "webContentsDebuggingEnabled": false
  }
}
```

| Config | Produção | Debug |
|--------|----------|-------|
| `webContentsDebuggingEnabled` | `false` | `true` |
| `allowMixedContent` | `false` | `true` (se necessário) |

> [!WARNING]
> **SEMPRE** desabilite `webContentsDebuggingEnabled` em builds de produção!
> Com ele ativado, qualquer pessoa pode inspecionar seu app via Chrome DevTools.

---

## 7. CHECKLIST DE SEGURANÇA

Antes de publicar:

- [ ] Keystore guardada em local seguro (NÃO no Git)
- [ ] `webContentsDebuggingEnabled` = `false`
- [ ] Nenhuma senha/token exposta no código fonte
- [ ] Console.log removidos ou desabilitados em produção
- [ ] HTTPS configurado no servidor backend
- [ ] Permissões mínimas no AndroidManifest.xml
- [ ] ProGuard habilitado (opcional, mas recomendado):
  ```gradle
  buildTypes {
      release {
          minifyEnabled true  // ← Ativar em produção
      }
  }
  ```

---

## 8. FLUXO DE DIAGNÓSTICO

Quando algo der errado, siga este fluxo:

```
ERRO ENCONTRADO
    │
    ├─ É erro de BUILD WEB? (npm run build falha)
    │   └─ Corrija erros de sintaxe, imports, etc.
    │
    ├─ É erro de SYNC? (npx cap sync falha)
    │   └─ Verifique: dist/ existe? node_modules ok? capacitor versions?
    │
    ├─ É erro de GRADLE? (gradlew assembleRelease falha)
    │   ├─ Java/JDK → Configure JAVA_HOME
    │   ├─ SDK não encontrado → Configure ANDROID_HOME
    │   ├─ Dependências → gradlew clean e rebuild
    │   └─ ProGuard → Atualize referência (ver 2.7)
    │
    ├─ APK instala mas TELA BRANCA?
    │   ├─ Verificar dist/index.html
    │   ├─ Usar HashRouter (React)
    │   └─ Verificar caminhos relativos
    │
    └─ APK instala mas CRASH?
        ├─ Conectar via USB + chrome://inspect
        ├─ Verificar Console para erros JS
        └─ Verificar permissões no AndroidManifest
```

---

> 📌 **Salve este documento como referência permanente. Ele cobre 95% dos problemas encontrados.**
