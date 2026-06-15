import { spawn } from 'child_process';
import puppeteer from 'puppeteer';

(async () => {
  console.log('\n🚀 Iniciando o ambiente de teste (Simulador de Dispositivos)...');
  
  // Inicia o Vite
  const viteProcess = spawn('npm', ['run', 'dev'], { 
    stdio: 'inherit', 
    shell: true,
    cwd: process.cwd()
  });

  // Aguarda alguns segundos para o Vite subir
  console.log('⏳ Aguardando o servidor iniciar...');
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log('📱 Abrindo o simulador no navegador...');
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null, // Permite que a janela abra livremente
      args: ['--start-maximized', '--app=http://localhost:5173/simulator.html']
    });

    console.log('✅ Simulador aberto! Feche a janela do simulador para encerrar o servidor.');

    // Captura quando o usuário fecha o navegador
    browser.on('disconnected', () => {
      console.log('\n🛑 Simulador fechado pelo usuário.');
      console.log('Desligando o servidor Vite...');
      viteProcess.kill('SIGINT'); // Encerra o processo do vite
      process.exit(0);
    });

    // Se o processo do node for interrompido no terminal (Ctrl+C), também fecha o browser e o Vite
    process.on('SIGINT', () => {
      browser.close().catch(() => {});
      viteProcess.kill('SIGINT');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Erro ao abrir o Puppeteer:', error);
    viteProcess.kill('SIGINT');
    process.exit(1);
  }
})();
