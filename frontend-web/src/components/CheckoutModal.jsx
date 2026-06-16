import React, { useState, useEffect } from 'react';
import { createPixPayment, checkPaymentStatus } from '../services/paymentService';

export default function CheckoutModal({ selectedNumbers, pixPrice, onDismiss, onConfirm }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [pixCodeGenerated, setPixCodeGenerated] = useState(null);
  const [qrCodeBase64, setQrCodeBase64] = useState(null);
  const [chargeId, setChargeId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [inlineMessage, setInlineMessage] = useState(null); // { text, type: 'success' | 'error' | 'info' }
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    let interval;
    if (pixCodeGenerated && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && pixCodeGenerated) {
      setInlineMessage({ text: 'Tempo expirado! O QR Code do PIX foi cancelado e os números liberados.', type: 'error' });
    }
    return () => clearInterval(interval);
  }, [pixCodeGenerated, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const totalPix = selectedNumbers.length * pixPrice;

  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 11);
    let formatted = val;
    if (val.length > 2) {
      formatted = `(${val.slice(0, 2)}) ${val.slice(2)}`;
    }
    if (val.length > 7) {
      formatted = `(${val.slice(0, 2)}) ${val.slice(2, 7)}-${val.slice(7)}`;
    }
    setPhone(formatted);
  };

  const generatePix = async () => {
    setIsLoading(true);
    setInlineMessage(null);
    const result = await createPixPayment({
      raffleId: "1",
      customerName: name,
      customerPhone: phone,
      value: totalPix,
      numbers: selectedNumbers
    });
    
    if (result.success && result.payload) {
      setPixCodeGenerated(result.payload);
      setQrCodeBase64(result.qrCode);
      setChargeId(result.chargeId);
    } else {
      setInlineMessage({ text: `Erro ao gerar PIX: ${result.error || 'Falha desconhecida'}`, type: 'error' });
    }
    setIsLoading(false);
  };

  const handleCopyPix = () => {
    if (pixCodeGenerated) {
      navigator.clipboard.writeText(pixCodeGenerated).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }).catch(() => {
        // Fallback for WebView
        const textArea = document.createElement('textarea');
        textArea.value = pixCodeGenerated;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  const handleVerifyPayment = async () => {
    if (!chargeId) return;
    setIsVerifying(true);
    setInlineMessage(null);
    const result = await checkPaymentStatus(chargeId);
    setIsVerifying(false);

    if (result && result.approved) {
      setInlineMessage({ text: 'Pagamento confirmado com sucesso! 🎉', type: 'success' });
      setTimeout(() => {
        onConfirm(name, phone, 'PIX');
      }, 1500);
    } else {
      setInlineMessage({ 
        text: 'O pagamento ainda não foi identificado. Certifique-se de que o pagamento foi concluído e tente novamente em alguns instantes.', 
        type: 'error' 
      });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Step Indicator */}
        <div className="step-indicator">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`step-dot ${step >= s ? 'active' : ''}`} />
          ))}
        </div>

        <h3 className="modal-title">
          {step === 1 && "📝 Seus Dados"}
          {step === 2 && "🔍 Revisão"}
          {step === 3 && "🎁 Forma de Colaboração"}
          {step === 4 && (selectedType === 'PIX' ? "💸 Pagamento PIX" : "🧸 Reserva Confirmada!")}
        </h3>

        <div className="modal-body">
          {step === 1 && (
            <>
              <div className="form-group">
                <label className="form-label">Nome Completo</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Digite seu nome completo" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">WhatsApp (com DDD)</label>
                <input 
                  type="tel" 
                  className="form-input" 
                  placeholder="(00) 00000-0000" 
                  value={phone} 
                  onChange={handlePhoneChange} 
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="review-card">
                <div className="review-item">
                  <span className="review-label">👤 Nome</span>
                  <span className="review-value">{name}</span>
                </div>
                <div className="review-divider" />
                <div className="review-item">
                  <span className="review-label">📱 WhatsApp</span>
                  <span className="review-value">{phone}</span>
                </div>
                <div className="review-divider" />
                <div className="review-item">
                  <span className="review-label">🎯 Números</span>
                  <span className="review-value">{selectedNumbers.length} selecionado(s)</span>
                </div>
              </div>

              <div className="numbers-preview">
                {selectedNumbers.sort((a,b) => a - b).map(n => (
                  <div key={n} className="number-chip">{n}</div>
                ))}
              </div>

              <p className="review-warning">
                ⚠️ Certifique-se de que o WhatsApp está correto, pois será usado para contato caso você seja o ganhador!
              </p>
            </>
          )}

          {step === 3 && (
            <>
              <p className="step-subtitle">Como você prefere contribuir?</p>
              <div className={`payment-card ${selectedType === 'MIMO' ? 'active' : ''}`} onClick={() => { setSelectedType('MIMO'); setStep(4); }}>
                <span className="emoji">🎁</span>
                <div className="payment-card-text">
                  <span className="text">DOAR FRALDA + MIMO</span>
                  <span className="payment-desc">Entrega no dia 25 de julho</span>
                </div>
              </div>
              <div className={`payment-card ${selectedType === 'PIX' ? 'active' : ''}`} onClick={() => { setSelectedType('PIX'); setStep(4); }}>
                <span className="emoji">💸</span>
                <div className="payment-card-text">
                  <span className="text">PIX (R${totalPix.toFixed(2)})</span>
                  <span className="payment-desc">Pagamento instantâneo</span>
                </div>
              </div>
            </>
          )}

          {step === 4 && selectedType === 'PIX' && (
            <>
              {pixCodeGenerated ? (
                <div className="qr-container">
                  <span className="qr-label">Escaneie o QR Code</span>
                  <div style={{ color: timeLeft > 0 ? '#e63946' : '#999', fontWeight: 'bold', fontSize: '24px', margin: '8px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    ⏳ {formatTime(timeLeft)}
                  </div>
                  {qrCodeBase64 ? (
                    <div className="qr-box">
                      <img src={qrCodeBase64} alt="QR Code" />
                    </div>
                  ) : (
                    <div className="qr-box" style={{ backgroundColor: '#ccc' }}>QR Code</div>
                  )}
                  <p className="pix-copy-label">Ou copie o código PIX Copia e Cola:</p>
                  <div style={{ display: 'flex', width: '100%', gap: '8px' }}>
                    <input 
                      type="text" 
                      readOnly 
                      value={pixCodeGenerated} 
                      className="pix-code-input" 
                      onClick={handleCopyPix}
                      title="Clique para copiar"
                      style={{ cursor: 'pointer', flex: 1 }}
                    />
                    <button 
                      className="btn-primary" 
                      style={{ padding: '0 16px', borderRadius: '12px' }}
                      onClick={handleCopyPix}
                    >
                      {copied ? '✅' : 'Copiar'}
                    </button>
                  </div>

                  {/* Inline feedback for copy */}
                  {copied && (
                    <div className="inline-toast success">
                      ✅ Código PIX copiado!
                    </div>
                  )}

                  <button className="btn-primary" style={{ width: '100%', marginTop: '16px' }} onClick={handleVerifyPayment} disabled={isVerifying}>
                    {isVerifying ? "VERIFICANDO..." : "🔍 VERIFICAR PAGAMENTO"}
                  </button>

                  {/* Inline message */}
                  {inlineMessage && (
                    <div className={`inline-toast ${inlineMessage.type}`}>
                      {inlineMessage.text}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <p className="step-subtitle">Prefere pagar agora ou agendar para o dia 25 de Julho?</p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                    <button className="btn-outline" style={{ flex: 1 }} onClick={() => onConfirm(name, phone, 'PIX')}>
                      📅 Dia 25
                    </button>
                    <button className="btn-primary" style={{ flex: 1 }} onClick={generatePix} disabled={isLoading}>
                      {isLoading ? "Aguarde..." : "💸 Agora"}
                    </button>
                  </div>

                  {inlineMessage && (
                    <div className={`inline-toast ${inlineMessage.type}`}>
                      {inlineMessage.text}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {step === 4 && selectedType === 'MIMO' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🧸</div>
              <p className="step-subtitle">Tudo certo! Seus números foram reservados para a Fralda + Mimo.</p>
              <button className="btn-primary" style={{ width: '100%', marginTop: '16px' }} onClick={() => onConfirm(name, phone, 'MIMO')}>
                ✅ FINALIZAR RESERVA
              </button>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={() => { if (step > 1) setStep(step - 1); else onDismiss(); }}>
            {step > 1 ? "← Voltar" : "Cancelar"}
          </button>
          {step < 3 && (
            <button 
              className="btn-primary" 
              disabled={step === 1 && (!name || phone.replace(/\D/g, '').length < 11)}
              onClick={() => setStep(step + 1)}
            >
              Avançar →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
