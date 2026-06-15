# Kit de Permissões e Notificações Universais

Este kit contém os arquivos necessários para habilitar permissões avançadas (Localização, "Desenhar sobre outros apps") e Notificações obrigatórias em seus novos projetos da Fábrica de Apps.

## Arquivos Inclusos
- `src/hooks/useAppPermissions.js`: O hook React que pede todas as permissões sequencialmente e bloqueia o app se as notificações forem negadas.
- `android_native_plugin/OverlayPermissionPlugin.java`: O plugin Java nativo para Capacitor que gerencia a permissão "Draw over other apps".
- `android_native_plugin/ic_stat_bear.xml`: O ícone padrão de notificação (substitua conforme o projeto).

## Como Integrar em um Novo Projeto:

1. **Frontend (React)**
   - Copie o arquivo `useAppPermissions.js` para a pasta `src/hooks/` do seu novo projeto.
   - Abra o seu `src/App.jsx` e chame o hook:
     ```javascript
     import { useAppPermissions } from './hooks/useAppPermissions';
     
     function AppInner() {
       useAppPermissions(); // Inicializar permissões
       // ...resto do código
     }
     ```

2. **Backend/Nativo (Android)**
   - Instale a geolocalização no projeto: `npm install @capacitor/geolocation`
   - Copie `OverlayPermissionPlugin.java` para a pasta: `android/app/src/main/java/com/SEU_APP_ID/`
   - Registre o plugin no seu `MainActivity.java`:
     ```javascript
     import android.os.Bundle;
     public class MainActivity extends BridgeActivity {
         @Override
         public void onCreate(Bundle savedInstanceState) {
             registerPlugin(OverlayPermissionPlugin.class);
             super.onCreate(savedInstanceState);
         }
     }
     ```
   - Copie `ic_stat_bear.xml` para a pasta `android/app/src/main/res/drawable/`. Pode renomear e mudar o path do SVG no futuro para a logo de cada app.

3. **Configuração de AndroidManifest.xml**
   - Adicione dentro de `<application>`:
     ```xml
     <meta-data android:name="com.google.firebase.messaging.default_notification_icon" android:resource="@drawable/ic_stat_bear" />
     <meta-data android:name="com.google.firebase.messaging.default_notification_color" android:resource="@color/colorPrimary" />
     ```
   - Adicione nas `<uses-permission>`:
     ```xml
     <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
     <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
     <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
     <uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
     ```

Pronto! Ao buildar, o novo projeto já nascerá blindado com essas lógicas universais.
