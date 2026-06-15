/**
 * MODELO PADRÃO DE ISOLAMENTO DE ROTAS (WEB vs ADMIN APP NATIVO)
 * 
 * Este arquivo é um esqueleto de como você deve montar o seu `App.jsx` ou arquivo de rotas principal
 * em qualquer novo projeto que siga a Arquitetura Universal.
 * 
 * OBJETIVO: Garantir que quem baixar o App Android (Capacitor) veja EXCLUSIVAMENTE o Painel Admin,
 * enquanto quem acessar via navegador (Link Web) veja a Loja/Produto/Frontend.
 */

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';

// --- Importação de Páginas Genéricas ---
import ClientFrontend from './pages/ClientFrontend'; // A página onde o cliente compra
import AdminDashboard from './pages/AdminDashboard'; // O painel onde você controla tudo

function App() {
  const [isNativeApp, setIsNativeApp] = useState(false);

  useEffect(() => {
    // 1. O Pulo do Gato: Detecta se está rodando dentro do Capacitor (APK/Android)
    if (Capacitor.isNativePlatform()) {
      setIsNativeApp(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Rota do Cliente (Só renderiza se NÃO for um App Nativo) */}
        {!isNativeApp && (
          <Route path="/" element={<ClientFrontend />} />
        )}

        {/* Rota do Admin (Se for App Nativo, esta é a ÚNICA tela visível. Se for Web, exige acessar /admin) */}
        <Route 
          path={isNativeApp ? "/" : "/admin"} 
          element={<AdminDashboard />} 
        />

        {/* Redirecionamento de segurança */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
