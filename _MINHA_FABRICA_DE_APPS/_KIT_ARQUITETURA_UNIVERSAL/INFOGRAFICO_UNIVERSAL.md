# 🗺️ Infográfico Arquitetural Universal

Qualquer projeto gerado a partir deste Kit seguirá o fluxo abaixo para garantir escabilidade gratuita, zero gargalos e comunicação em tempo real.

```mermaid
graph TD
    %% Cores e Estilos
    classDef client fill:#3b82f6,stroke:#2563eb,stroke-width:2px,color:#fff;
    classDef admin fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff;
    classDef vercel fill:#000000,stroke:#333,stroke-width:2px,color:#fff;
    classDef firebase fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff;
    classDef mp fill:#0ea5e9,stroke:#0284c7,stroke-width:2px,color:#fff;
    classDef robot fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff;

    %% Atores
    U["👤 Cliente (Navegador Web)"]:::client
    A["📱 Admin (Seu App Android isolado)"]:::admin
    UR["🤖 UptimeRobot (O Faxineiro)"]:::robot

    %% Nuvem / Serviços
    subgraph "Vercel (Frontend e Serverless)"
        V_WEB["🌐 Frontend da Loja"]:::vercel
        V_API_PIX["⚙️ /api/pix/create (Gera Cobrança)"]:::vercel
        V_API_WH["⚡ /api/webhook/pagamento (Instantâneo)"]:::vercel
        V_API_CRON["🧹 /api/cron/sweep (Limpeza)"]:::vercel
    end

    MP["💳 Mercado Pago (Gateways)"]:::mp
    FB["🔥 Firebase Firestore (Banco Real-Time)"]:::firebase

    %% Fluxo de Compra
    U -- "1. Compra Produto" --> V_WEB
    V_WEB -- "2. Chama API" --> V_API_PIX
    V_API_PIX -- "3. Solicita Pix" --> MP
    MP -- "4. Devolve QR Code" --> V_API_PIX
    V_API_PIX -- "5. Grava PENDENTE" --> FB
    V_API_PIX -- "6. Mostra QR Code" --> U

    %% O Milagre do Tempo Real
    MP -- "7. Paga! Dispara Webhook" --> V_API_WH
    V_API_WH -- "8. Muda para PAGO" --> FB
    FB -. "9. Sincroniza Admin (0 delay)" .-> A
    FB -. "10. Libera Acesso Cliente" .-> V_WEB
    
    %% Manutenção Autônoma
    UR -- "Pinga a cada 5m" --> V_API_CRON
    V_API_CRON -- "Cancela Pedidos Expirados" --> FB
```

## Como a Arquitetura Previne Bugs:
1. **Desacoplamento Front vs Admin:** O cliente nunca toca no código do Admin, pois ele roda isolado no seu celular via Capacitor.
2. **Webhooks Serverless:** Se 50 pessoas pagarem ao mesmo tempo, a Vercel acorda 50 webhooks em paralelo que escrevem no Firebase sem formar fila de processamento.
3. **Mágica do Firestore:** O servidor Vercel "morre" rápido para não gerar custos. A responsabilidade de manter o aplicativo Web ou Android atualizado na tela é do websocket passivo do Firebase, que é extremamente leve.
