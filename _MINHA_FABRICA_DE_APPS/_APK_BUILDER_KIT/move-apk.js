import fs from 'fs';
import path from 'path';

// Pega o nome da pasta raiz do projeto
const projectRoot = path.resolve(process.cwd(), '..');
const projectName = path.basename(projectRoot);

// Caminhos do APK gerado pelo Capacitor/Android Studio
const apkDebugPath = path.join(process.cwd(), 'android', 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
const apkReleasePath = path.join(process.cwd(), 'android', 'app', 'build', 'outputs', 'apk', 'release', 'app-release.apk');
const apkReleaseUnsignedPath = path.join(process.cwd(), 'android', 'app', 'build', 'outputs', 'apk', 'release', 'app-release-unsigned.apk');

// Destino na raiz do projeto (Exato nome do projeto, sem sufixos extras)
const destDebug = path.join(projectRoot, `${projectName}.apk`);
const destRelease = path.join(projectRoot, `${projectName}.apk`);

function copyApk(src, dest, type) {
  if (fs.existsSync(src)) {
    console.log(`\n📦 Encontrado APK de ${type}: ${src}`);
    try {
      fs.copyFileSync(src, dest);
      console.log(`✅ APK copiado para a raiz com sucesso: ${dest}\n`);
    } catch (err) {
      console.error(`❌ Erro ao copiar o APK: ${err.message}`);
    }
  } else {
    // console.log(`ℹ️ Nenhum APK de ${type} encontrado no caminho padrão.`);
  }
}

// Tenta copiar o Debug e o Release
copyApk(apkDebugPath, destDebug, 'Debug');
copyApk(apkReleasePath, destRelease, 'Release');
copyApk(apkReleaseUnsignedPath, destRelease, 'Release (Unsigned)');
