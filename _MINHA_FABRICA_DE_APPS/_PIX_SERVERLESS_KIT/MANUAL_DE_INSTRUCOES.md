# Manual de Instruções: Kit Pix Serverless

Este manual é para o humano (desenvolvedor/dono do projeto) configurar o ambiente na nuvem após a IA ter implementado o código do kit.

## 1. Configuração na Vercel (Variáveis de Ambiente)
Após subir o código para o GitHub e conectar na Vercel, o backend Serverless precisa de chaves para funcionar. Vá até as **Settings** do seu projeto na Vercel > **Environment Variables** e adicione:

- `FIREBASE_SERVICE_ACCOUNT`: O JSON inteiro da conta de serviço do Firebase (minificado, em uma única linha).
- `MP_ACCESS_TOKEN`: Seu Access Token de Produção do Mercado Pago.
- `VAPID_PUBLIC_KEY` e `VAPID_PRIVATE_KEY`: Suas chaves para Notificações Web Push (caso use o painel web para receber sons).

*Dica: Após adicionar as chaves na Vercel, clique na aba "Deployments" e clique em "Redeploy" para que as funções peguem as novas chaves.*

## 2. Configurando o Webhook no Mercado Pago
Vá no painel de Desenvolvedor do Mercado Pago, em "Notificações / Webhooks" e configure a URL apontando para a sua Vercel:
**URL:** `https://[SEU-DOMINIO-VERCEL.COM]/api/webhook/mercadopago`
**Eventos a assinar:** `Pagamentos (payment)`.

## 3. Configurando o Faxineiro Automático (Totalmente Grátis)
No código que a IA instalou, existe a rota `/api/cron/sweep`. Essa rota cancela os Pix não pagos que já expiraram.
Para ela rodar de graça sem estourar o limite de Crons da Vercel:
1. Crie uma conta gratuita no [UptimeRobot.com](https://uptimerobot.com).
2. Adicione um "New Monitor" do tipo **HTTP(s)**.
3. Cole a URL: `https://[SEU-DOMINIO-VERCEL.COM]/api/cron/sweep`.
4. Defina o intervalo para **5 minutos**.
Pronto! O UptimeRobot fará o papel de um CronJob eterno e gratuito batendo na sua API de 5 em 5 minutos.

## 4. O Sistema Inteligente de Checkpoint
Este projeto e os futuros projetos que usam este kit contam com o arquivo `AI_SAFE_WORKFLOW.md`. Ele proíbe a IA de ficar corrigindo bugs gerados por ela mesma em cima de código quebrado. A IA deve **sempre** retornar o backup do Git (reset) e tentar uma nova estratégia. Isso salva o seu tempo.
