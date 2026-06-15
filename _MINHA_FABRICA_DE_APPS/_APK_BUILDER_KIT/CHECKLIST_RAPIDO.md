# ⚡ CHECKLIST RÁPIDO — Build APK em 5 Minutos

> **Use este checklist quando já souber o processo e quiser apenas seguir os passos rápidos.**

---

## 🆕 PRIMEIRA VEZ (Setup Inicial)

```
□ 1. Instalar Node.js 18+ (nodejs.org)
□ 2. Instalar Android Studio (developer.android.com/studio)
□ 3. Configurar ANDROID_HOME e JAVA_HOME nas variáveis de ambiente
□ 4. npm install @capacitor/core @capacitor/android
□ 5. npm install -D @capacitor/cli
□ 6. Criar capacitor.config.json (copiar do TEMPLATE_CONFIG.md)
□ 7. Configurar vite.config.js para mobile (copiar do TEMPLATE_CONFIG.md)
□ 8. npm run build
□ 9. npx cap add android
□ 10. npx cap sync android
□ 11. cd android && .\gradlew assembleDebug && cd ..
□ 12. APK está em: android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🔄 ATUALIZAÇÕES (Já tem tudo configurado)

```
□ 1. Fazer alterações no código
□ 2. npm run build
□ 3. npx cap sync android
□ 4. cd android && .\gradlew assembleDebug && cd ..
□ 5. Pegar APK em: android/app/build/outputs/apk/debug/
```

**Ou em uma linha:**
```powershell
npm run build && npx cap sync android && cd android && .\gradlew assembleDebug && cd ..
```

---

## 📦 PARA PRODUÇÃO (APK Assinado)

```
□ 1. node bump-version.js X.Y.Z
□ 2. npm run build
□ 3. npx cap sync android
□ 4. cd android && .\gradlew assembleRelease && cd ..
□ 5. Assinar APK (ou configurar signingConfig no build.gradle)
□ 6. Testar em celular real via USB
□ 7. Distribuir ou publicar na Play Store
```

---

## 🆘 SE DER ERRO

| Problema | Comando |
|----------|---------|
| Build web falha | `npm run build` — corrija erros de código |
| Sync falha | `npm install` → `npx cap sync android` |
| Gradle falha | `cd android && .\gradlew clean && cd ..` → tentar novamente |
| Java não encontrado | Configure `JAVA_HOME` |
| SDK não encontrado | Configure `ANDROID_HOME` |
| Tela branca no app | Use `HashRouter` (React) e `base: './'` (Vite) |
| Limpeza total | Deletar `android/.gradle/` e `android/app/build/` |

---

## 📁 ONDE ESTÃO OS ARQUIVOS

| Arquivo | Caminho |
|---------|---------|
| APK Debug | `android/app/build/outputs/apk/debug/app-debug.apk` |
| APK Release | `android/app/build/outputs/apk/release/app-release-unsigned.apk` |
| AAB (Play Store) | `android/app/build/outputs/bundle/release/app-release.aab` |
| Config Capacitor | `capacitor.config.json` |
| Config Android | `android/variables.gradle` |
| Config App | `android/app/build.gradle` |
| Manifest | `android/app/src/main/AndroidManifest.xml` |
| Web assets | `android/app/src/main/assets/public/` |

---

## 📱 INSTALAR NO CELULAR

```powershell
# Via cabo USB (depuração USB ativada):
adb install android\app\build\outputs\apk\debug\app-debug.apk

# Ou envie o .apk por WhatsApp/Telegram/Email
```

---

> 📌 **Para detalhes, consulte o GUIA_COMPLETO.md**
> 📌 **Para erros, consulte o CUIDADOS.md**
> 📌 **Para entender a lógica, consulte o LOGICA_ARQUITETURA.md**
