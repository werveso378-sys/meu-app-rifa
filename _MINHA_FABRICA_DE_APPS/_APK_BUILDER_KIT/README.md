# 📦 _APK_BUILDER_KIT

## Kit Completo para Transformar Qualquer Projeto Web em APK Android

> **Versão 2.0** — Junho 2026  
> **Testado e validado com o projeto RifasBabyGo**  
> **Compatível com Android 7.0+ (2016) até Android 16+ (2026+)**

---

## 📁 Conteúdo desta Pasta

| Arquivo | Descrição | Quando Usar |
|---------|-----------|------------|
| 📖 **[GUIA_COMPLETO.md](./GUIA_COMPLETO.md)** | Guia passo-a-passo detalhado do início ao fim | Primeira vez fazendo build |
| ⚠️ **[CUIDADOS.md](./CUIDADOS.md)** | Problemas comuns, troubleshooting e segurança | Quando algo der errado |
| 🧠 **[LOGICA_ARQUITETURA.md](./LOGICA_ARQUITETURA.md)** | Como tudo funciona por trás (a lógica completa) | Para entender o sistema |
| 📝 **[TEMPLATE_CONFIG.md](./TEMPLATE_CONFIG.md)** | Templates de todos os arquivos de configuração | Quando iniciar novo projeto |
| 🤖 **[PROMPT_PARA_IA.md](./PROMPT_PARA_IA.md)** | Prompts prontos para pedir à IA gerar builds | Para usar com qualquer IA |
| ⚡ **[CHECKLIST_RAPIDO.md](./CHECKLIST_RAPIDO.md)** | Checklist rápido para quem já sabe o processo | Builds do dia-a-dia |
| 🔧 **[build-apk.ps1](./build-apk.ps1)** | Script PowerShell automatizado de build | Automatizar o processo |

---

## 🚀 Início Rápido

### Opção 1: Usando o Script Automatizado (Windows)
```powershell
# Copie build-apk.ps1 para a raiz do seu projeto e rode:
.\build-apk.ps1              # Build Debug
.\build-apk.ps1 -Release     # Build Release
.\build-apk.ps1 -Clean       # Limpar e rebuildar
```

### Opção 2: Usando a IA
1. Abra o **[PROMPT_PARA_IA.md](./PROMPT_PARA_IA.md)**
2. Copie o prompt que se encaixa no seu caso
3. Cole na sua IA favorita (Gemini, ChatGPT, Claude)
4. Siga as instruções geradas

### Opção 3: Manual
1. Leia o **[GUIA_COMPLETO.md](./GUIA_COMPLETO.md)** do início ao fim
2. Siga os passos
3. Consulte **[CUIDADOS.md](./CUIDADOS.md)** se der erro

---

## 🎯 Stack Suportada

| Tecnologia | Versão | Status |
|-----------|--------|--------|
| **Vite** | 6.x — 8.x | ✅ Testado |
| **React** | 18.x — 19.x | ✅ Testado |
| **Vue** | 3.x | ✅ Compatível |
| **Angular** | 17+ | ✅ Compatível |
| **Svelte** | 4+ | ✅ Compatível |
| **HTML/CSS/JS puro** | — | ✅ Compatível |
| **Next.js** (export estático) | 14+ | ✅ Compatível |
| **Capacitor** | 7.x — 8.x | ✅ Testado |
| **Gradle** | 8.4 — 8.14+ | ✅ Testado |
| **Android SDK** | API 24-36 | ✅ Testado |

---

## 📋 Pré-requisitos

- ✅ Node.js 18+ instalado
- ✅ Android Studio instalado
- ✅ `ANDROID_HOME` configurado
- ✅ `JAVA_HOME` configurado (ou JDK do Android Studio)

---

## 💡 Como usar em outro projeto

1. **Copie esta pasta** (`_APK_BUILDER_KIT/`) para o novo projeto
2. **Abra o TEMPLATE_CONFIG.md** e copie os templates
3. **Substitua** os valores marcados com `[MUDAR]`
4. **Siga o CHECKLIST_RAPIDO.md** ou use o script `build-apk.ps1`

---

> Criado por Werveson — Projeto RifasBabyGo © 2026
