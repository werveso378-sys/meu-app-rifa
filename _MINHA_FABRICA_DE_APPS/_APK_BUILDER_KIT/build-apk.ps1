# ============================================================
# 🔧 BUILD-APK.PS1 — Script Automatizado de Build APK
# ============================================================
# USO:
#   .\build-apk.ps1                 → Build Debug
#   .\build-apk.ps1 -Release        → Build Release
#   .\build-apk.ps1 -Version "1.2.0"→ Bump version + Build Debug
#   .\build-apk.ps1 -Release -Version "1.2.0" → Bump + Build Release
#   .\build-apk.ps1 -Clean          → Limpar e rebuildar
# ============================================================

param(
    [switch]$Release,
    [switch]$Clean,
    [string]$Version = ""
)

# Cores para output
function Write-Success { param($msg) Write-Host "✅ $msg" -ForegroundColor Green }
function Write-Error { param($msg) Write-Host "❌ $msg" -ForegroundColor Red }
function Write-Warn { param($msg) Write-Host "⚠️  $msg" -ForegroundColor Yellow }
function Write-Info { param($msg) Write-Host "📌 $msg" -ForegroundColor Cyan }
function Write-Step { param($step, $msg) Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray; Write-Host "  PASSO $step — $msg" -ForegroundColor White; Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray }

$ErrorActionPreference = "Stop"
$startTime = Get-Date

Write-Host ""
Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║     🚀 APK BUILDER — Capacitor Build     ║" -ForegroundColor Magenta
Write-Host "║         Versao 2.0 — Junho 2026          ║" -ForegroundColor Magenta
Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Magenta
Write-Host ""

$buildType = if ($Release) { "Release" } else { "Debug" }
Write-Info "Modo: $buildType"

# ============================================================
# PASSO 0: Verificações do Ambiente
# ============================================================
Write-Step "0" "Verificando ambiente"

# Verificar Node.js
try {
    $nodeVersion = node --version 2>&1
    Write-Success "Node.js: $nodeVersion"
} catch {
    Write-Error "Node.js NAO encontrado! Instale em https://nodejs.org"
    exit 1
}

# Verificar npm
try {
    $npmVersion = npm --version 2>&1
    Write-Success "npm: v$npmVersion"
} catch {
    Write-Error "npm NAO encontrado!"
    exit 1
}

# Verificar Java
try {
    $javaVersion = java -version 2>&1 | Select-Object -First 1
    Write-Success "Java: $javaVersion"
} catch {
    Write-Warn "Java nao encontrado no PATH. O Gradle usara o JDK embutido do Android Studio (se configurado)."
}

# Verificar se é um projeto Capacitor
if (-not (Test-Path "capacitor.config.json")) {
    Write-Error "capacitor.config.json NAO encontrado! Este nao parece ser um projeto Capacitor."
    Write-Info "Rode: npx cap init"
    exit 1
}
Write-Success "capacitor.config.json encontrado"

# Verificar se tem package.json
if (-not (Test-Path "package.json")) {
    Write-Error "package.json NAO encontrado!"
    exit 1
}
Write-Success "package.json encontrado"

# Verificar se pasta android existe
if (-not (Test-Path "android")) {
    Write-Warn "Pasta android/ NAO encontrada. Criando..."
    npx cap add android
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Falha ao criar projeto Android!"
        exit 1
    }
    Write-Success "Projeto Android criado!"
}
Write-Success "Pasta android/ encontrada"

# ============================================================
# PASSO 1: Bump de Versão (se solicitado)
# ============================================================
if ($Version -ne "") {
    Write-Step "1" "Atualizando versao para $Version"

    if (Test-Path "bump-version.js") {
        node bump-version.js $Version
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Falha ao atualizar versao!"
            exit 1
        }
        Write-Success "Versao atualizada para $Version"
    } else {
        Write-Warn "bump-version.js nao encontrado. Atualizando manualmente..."
        $pkg = Get-Content "package.json" | ConvertFrom-Json
        $pkg.version = $Version
        $pkg | ConvertTo-Json -Depth 10 | Set-Content "package.json"
        Write-Success "package.json atualizado para $Version"
    }
} else {
    Write-Step "1" "Versao mantida (sem alteracao)"
    $pkg = Get-Content "package.json" | ConvertFrom-Json
    Write-Info "Versao atual: $($pkg.version)"
}

# ============================================================
# PASSO 2: Build do Projeto Web
# ============================================================
Write-Step "2" "Buildando projeto web"

# Limpar dist/ antigo se existir
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Info "dist/ antigo removido"
}

npm run build 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Error "BUILD WEB FALHOU! Corrija os erros acima antes de continuar."
    exit 1
}

# Verificar se dist/ foi criado
if (-not (Test-Path "dist/index.html")) {
    Write-Error "dist/index.html NAO encontrado apos o build!"
    Write-Info "Verifique se o 'outDir' no vite.config.js esta configurado como 'dist'"
    exit 1
}

$distSize = (Get-ChildItem -Recurse "dist" | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Success "Build web concluido! Tamanho do dist/: $([math]::Round($distSize, 2)) MB"

# ============================================================
# PASSO 3: Sincronização com Android
# ============================================================
Write-Step "3" "Sincronizando com Android"

npx cap sync android 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Error "SYNC FALHOU! Verifique as dependencias do Capacitor."
    exit 1
}
Write-Success "Sincronizacao concluida!"

# ============================================================
# PASSO 4: Clean (se solicitado)
# ============================================================
if ($Clean) {
    Write-Step "4" "Limpando build anterior"

    Push-Location "android"
    .\gradlew clean 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Warn "Clean nao completou perfeitamente (pode ser OK na primeira vez)"
    } else {
        Write-Success "Clean concluido!"
    }
    Pop-Location
} else {
    Write-Step "4" "Clean pulado (use -Clean para forcar)"
}

# ============================================================
# PASSO 5: Gerar APK
# ============================================================
Write-Step "5" "Gerando APK ($buildType)"

Push-Location "android"

if ($Release) {
    .\gradlew assembleRelease 2>&1
} else {
    .\gradlew assembleDebug 2>&1
}

$buildResult = $LASTEXITCODE
Pop-Location

if ($buildResult -ne 0) {
    Write-Error "BUILD APK FALHOU!"
    Write-Info "Dicas:"
    Write-Info "  1. Verifique se JAVA_HOME esta configurado"
    Write-Info "  2. Rode com -Clean para limpar cache"
    Write-Info "  3. Verifique o CUIDADOS.md para troubleshooting"
    exit 1
}

Write-Success "APK gerado com sucesso!"

# ============================================================
# PASSO 6: Localizar e exibir resultado
# ============================================================
Write-Step "6" "Resultado Final"

if ($Release) {
    $apkPath = "android\app\build\outputs\apk\release\app-release-unsigned.apk"
    $apkSignedPath = "android\app\build\outputs\apk\release\app-release.apk"

    if (Test-Path $apkSignedPath) {
        $apkPath = $apkSignedPath
    }
} else {
    $apkPath = "android\app\build\outputs\apk\debug\app-debug.apk"
}

if (Test-Path $apkPath) {
    $apkSize = (Get-Item $apkPath).Length / 1MB
    $endTime = Get-Date
    $duration = $endTime - $startTime

    Write-Host ""
    Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║           ✅ BUILD COMPLETO!              ║" -ForegroundColor Green
    Write-Host "╠══════════════════════════════════════════╣" -ForegroundColor Green
    Write-Host "║  APK: $apkPath" -ForegroundColor White
    Write-Host "║  Tamanho: $([math]::Round($apkSize, 2)) MB" -ForegroundColor White
    Write-Host "║  Tipo: $buildType" -ForegroundColor White
    Write-Host "║  Tempo: $([math]::Round($duration.TotalSeconds, 1))s" -ForegroundColor White
    Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""

    # Copiar APK para pasta raiz com nome amigável
    $friendlyName = "MeuApp-v$($pkg.version)-$($buildType.ToLower()).apk"
    Copy-Item $apkPath $friendlyName -Force
    Write-Success "APK copiado para: $friendlyName"
    Write-Host ""
} else {
    Write-Error "APK nao encontrado em $apkPath"
    Write-Info "Verifique manualmente: dir android\app\build\outputs\apk\"
    exit 1
}
