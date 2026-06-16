# Implementação da Lógica de Notificações

Neste projeto, eu realizei três intervenções principais para fazer o sistema ser "Premium" e totalmente dinâmico. Você pode consultar os arquivos de código na mesma pasta deste tutorial para ver a estrutura completa.

## 1. O Emissor (O Simulador)
**Arquivo de Referência:** `Simulator_Code.tsx` (antigo `app/(home)/page.tsx`)

O Simulador é a página Web que atira a requisição HTTPS para os servidores da OneSignal, que por sua vez encontram o aparelho Android.
- **Dica de Ouro:** Antigamente, a audiência geral no OneSignal chamava-se `Subscribed Users`. Nas contas novas mudou para `Total Subscriptions` ou `Active Users`. No código, nós forçamos o disparo para todos esses nomes. Se você errar o nome do segmento, a OneSignal entrega para "0 aparelhos".
- **Ícones Dinâmicos:** Através do parâmetro `large_icon` no Payload da API, enviamos a URL de imagens hospedadas (Kiwify, Cakto, Sino). O celular baixa a imagem no momento que a notificação chega.
- **Cor de Fundo:** O parâmetro `android_accent_color` (ex: `FF3A4B3C`) pinta a bolinha de fundo da notificação nativa.

## 2. O Recebedor (O Aplicativo)
**Arquivo de Referência:** `App_Receiver_Code.tsx` (antigo `app/receiver/page.tsx`)

No app que fica instalado no celular, a única obrigação do código é Inicializar o Capacitor OneSignal Plugin e pedir a permissão.
- `OneSignal.initialize("SEU_APP_ID")`: Conecta o app.
- `OneSignal.Notifications.requestPermission(true)`: Abre o alerta nativo do Android pedindo permissão do usuário.
- O código que criamos também intercepta a notificação se o app estiver **Aberto na Tela** e dispara uma chuva de Confetes (`canvas-confetti`) tocando um áudio `kaching.mp3` localmente.

## 3. O Ícone da Silhueta (Padrão do Android)
**Arquivo de Referência:** `ic_stat_onesignal_default.xml`

A partir do Android 5.0, a "Silhueta" que aparece na barra de topo **não pode ter cor**, precisa ser 100% branca e ter o fundo transparente. Se você não colocar um ícone oficial, o Android mostra um sino cinza feio ou um quadrado branco estourado.
- Esse arquivo vetorial XML foi colocado dentro da pasta nativa: `android/app/src/main/res/drawable/ic_stat_onesignal_default.xml`.
- O empacotador (`build-apk.ps1`) é responsável por ler essa pasta e injetar o ícone no Android Studio nativamente durante a compilação do APK.
