import { useEffect } from 'react';
import { Capacitor, registerPlugin } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Geolocation } from '@capacitor/geolocation';

const OverlayPermission = registerPlugin('OverlayPermission');

export function useAppPermissions() {
  useEffect(() => {
    const requestPermissions = async () => {
      // Request permissions only on Native Platforms
      if (Capacitor.getPlatform() !== 'android') return;

      try {
        // 1. Request Push Notifications Permission (Obrigatória)
        let pushStatus = await PushNotifications.checkPermissions();
        if (pushStatus.receive !== 'granted') {
          pushStatus = await PushNotifications.requestPermissions();
        }
        
        if (pushStatus.receive === 'granted') {
          await PushNotifications.register();
        } else {
          // Permissão Obrigatória
          alert('A permissão de notificações é obrigatória para o funcionamento correto (ex: avisos de Pix e vendas). Por favor, ative nas configurações do seu celular.');
        }

        // 2. Request Location Permission
        let geoStatus = await Geolocation.checkPermissions();
        if (geoStatus.location !== 'granted' && geoStatus.location !== 'denied') {
          await Geolocation.requestPermissions();
        }

        // 3. Request Overlay Permission (Draw over other apps)
        if (OverlayPermission) {
            const overlayStatus = await OverlayPermission.checkOverlayPermission();
            if (!overlayStatus.granted) {
              await OverlayPermission.requestOverlayPermission();
            }
        }

      } catch (error) {
        console.error('Error requesting app permissions:', error);
      }
    };

    requestPermissions();
  }, []);
}
