# Configuração Inicial: Firebase e OneSignal

Para fazer o sistema de notificações Push funcionar perfeitamente no Android, você precisa conectar o Firebase (mensageria do Google) ao OneSignal (disparador).

## 1. Configurando o Firebase
1. Acesse o [Console do Firebase](https://console.firebase.google.com/) e clique em **Criar Projeto**.
2. Dê um nome ao seu projeto (ex: RifaApp). Não precisa ativar o Google Analytics.
3. Dentro do projeto criado, clique no ícone do **Android** para adicionar um aplicativo.
4. **IMPORTANTE:** Coloque o nome exato do seu pacote Android (ex: `com.seuapp.rifa`).
5. Clique em registrar e baixe o arquivo **`google-services.json`**.
6. Vá no menu lateral esquerdo em **Engajamento > Messaging (Cloud Messaging)**.
7. Clique na engrenagem (Configurações do Projeto) > **Cloud Messaging**.
8. Ative a **API Cloud Messaging (Legacy/V1)** e copie a sua **Chave do Servidor (Server Key)** e o **ID do Remetente (Sender ID)**.

## 2. Configurando o OneSignal
1. Acesse o [OneSignal](https://onesignal.com/) e crie um novo App/Website.
2. Escolha a plataforma **Google Android (FCM)**.
3. Cole a **Server Key** e o **Sender ID** que você pegou no Firebase.
4. Conclua e escolha o SDK nativo ou Capacitor (não importa muito a opção escolhida aqui, pois a configuração principal já foi feita).
5. Vá nas Configurações (Settings) > **Keys & IDs**.
6. Aqui está a "Alma" do negócio! Copie dois dados vitais:
   - **OneSignal App ID**
   - **REST API Key** (Você precisa clicar em 'Generate' e dar um nome, ex: 'Api Simulador')

## 3. Preparando o Código do App
1. Pegue o arquivo **`google-services.json`** baixado do Firebase e coloque-o EXATAMENTE na pasta `android/app/` do seu projeto.
2. Sem esse arquivo, o Capacitor não consegue fazer a ponte entre o celular e o Firebase.

Com isso feito, a parte de servidores está pronta. A próxima etapa é usar o `PROMPT_IA.md` para mandar a Inteligência Artificial fazer o resto.
