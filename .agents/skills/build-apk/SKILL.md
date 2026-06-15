---
name: build-apk
description: Compiles the APK directly without opening Android Studio. Uses the npm run build:apk command.
version: 1.0.0
---

# Build APK

Executes a professional APK compilation process, analyzing the project architecture and automatically handling missing assets.

## Instructions
1. **Analyze Architecture:** Verify the project structure to see what's needed for the Android build. If the `android` directory is missing, set up Capacitor (`npx cap add android`) using the existing professional tools (no Android Studio).
2. **Check App Icon:** Analyze the project assets. If there is no custom app icon defined for the Android project, you MUST automatically create an icon for the app (e.g., using your `generate_image` tool and applying it via tools like `@capacitor/assets`).
3. **Compile:** Run the professional build process (`npm run build:apk` or equivalent) in the `frontend` directory using the `run_command` tool.
4. **Deliver:** Wait for the build to finish successfully and inform the user about the generated APK path: `frontend\android\app\build\outputs\apk\debug\app-debug.apk` (or `release` if requested).
