import React, { useState } from 'react';
import { createPixPayment } from '../services/paymentService';

export default function CheckoutModal({ selectedNumbers, pixPrice, onDismiss, onConfirm }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [pixCodeGenerated, setPixCodeGenerated] = useState(null);
  const [qrCodeBase64, setQrCodeBase64] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
    } else {
      setPixCodeGenerated(`Erro: ${result.error || 'Falha ao gerar PIX'}`);
    }
    setIsLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">
          {step === 1 && "Seus Dados"}
          {step === 2 && "Revisão dos Números"}
          {step === 3 && "Forma de Colaboração"}
          {step === 4 && (selectedType === 'PIX' ? "Pagamento PIX" : "Sucesso!")}
        </h3>

        <div className="modal-body">
          {step === 1 && (
            <>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Nome Completo" 
                value={name} 
                onChange={e => setName(e.target.value)} 
              />
              <input 
                type="tel" 
                className="form-input" 
                placeholder="WhatsApp (com DDD)" 
                value={phone} 
                onChange={handlePhoneChange} 
              />
            </>
          )}

          {step === 2 && (
            <>
              <p><strong>Olá, {name}!</strong></p>
              <p>Você escolheu os números:</p>
              <div style={{ backgroundColor: '#FBF9F1', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                <strong style={{ color: '#4C6A2B', fontSize: '20px' }}>
                  {selectedNumbers.join(', ')}
                </strong>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <p>Como você prefere contribuir?</p>
              <div className={`payment-card ${selectedType === 'MIMO' ? 'active' : ''}`} onClick={() => { setSelectedType('MIMO'); setStep(4); }}>
                <span className="emoji">🎁</span>
                <span className="text">DOAR FRALDA + MIMO</span>
              </div>
              <div className={`payment-card ${selectedType === 'PIX' ? 'active' : ''}`} onClick={() => { setSelectedType('PIX'); setStep(4); }}>
                <span className="emoji">💸</span>
                <span className="text">PIX (R${totalPix.toFixed(2)})</span>
              </div>
            </>
          )}

          {step === 4 && selectedType === 'PIX' && (
            <>
              {pixCodeGenerated ? (
                <div className="qr-container">
                  <span style={{ fontWeight: 'bold', color: '#4C6A2B' }}>Escaneie o QR Code</span>
                  {qrCodeBase64 ? (
                    <div className="qr-box">
                      <img src={qrCodeBase64} alt="QR Code" />
                    </div>
                  ) : (
                    <div className="qr-box" style={{ backgroundColor: '#ccc' }}>QR Code</div>
                  )}
                  <p style={{ fontSize: '12px', marginTop: '16px' }}>Ou copie o código PIX Copia e Cola:</p>
                  <input type="text" readOnly value={pixCodeGenerated} className="pix-code-input" />
                  <button className="btn-primary" style={{ width: '100%', marginTop: '16px' }} onClick={() => onConfirm(name, phone, 'PIX')}>
                    JÁ PAGUEI / CONCLUIR
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <p>Prefere pagar agora ou agendar para o dia 25 de Julho?</p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                    <button className="btn-cancel" style={{ border: '1px solid #4C6A2B', borderRadius: '25px', flex: 1, color: '#4C6A2B' }} onClick={() => onConfirm(name, phone, 'PIX')}>
                      Dia 25
                    </button>
                    <button className="btn-primary" style={{ flex: 1 }} onClick={generatePix} disabled={isLoading}>
                      {isLoading ? "Aguarde..." : "Agora"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {step === 4 && selectedType === 'MIMO' && (
            <div style={{ textAlign: 'center' }}>
              <p>Tudo certo! Seus números foram reservados para a Fralda + Mimo.</p>
              <button className="btn-primary" style={{ width: '100%', marginTop: '16px' }} onClick={() => onConfirm(name, phone, 'MIMO')}>
                FINALIZAR RESERVA
              </button>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={() => { if (step > 1) setStep(step - 1); else onDismiss(); }}>
            {step > 1 ? "Voltar" : "Cancelar"}
          </button>
          {step < 3 && (
            <button 
              className="btn-primary" 
              disabled={step === 1 && (!name || phone.replace(/\D/g, '').length < 11)}
              onClick={() => setStep(step + 1)}
            >
              Avançar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
