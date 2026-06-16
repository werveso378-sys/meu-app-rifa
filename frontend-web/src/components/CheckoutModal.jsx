import React, { useState } from 'react';
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
      setChargeId(result.chargeId);
    } else {
      setPixCodeGenerated(`Erro: ${result.error || 'Falha ao gerar PIX'}`);
    }
    setIsLoading(false);
  };

  const handleVerifyPayment = async () => {
    if (!chargeId) return;
    setIsVerifying(true);
    const result = await checkPaymentStatus(chargeId);
    setIsVerifying(false);

    if (result && result.approved) {
      alert("Pagamento confirmado com sucesso!");
      onConfirm(name, phone, 'PIX'); // Conclui e fecha o modal
    } else {
      alert("Desculpe, o pagamento ainda não foi identificado. Por favor, certifique-se de que o pagamento foi concluído e tente novamente em alguns instantes.");
    }
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
              <h4 style={{ textAlign: 'center', color: '#4C6A2B', marginBottom: '8px' }}>Verifique seus dados</h4>
              <div style={{ backgroundColor: '#FBF9F1', padding: '12px', borderRadius: '12px', fontSize: '14px', marginBottom: '16px' }}>
                <p style={{ margin: '4px 0' }}><strong>Nome:</strong> {name}</p>
                <p style={{ margin: '4px 0' }}><strong>WhatsApp:</strong> {phone}</p>
                <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>Certifique-se de que o WhatsApp está correto, pois será usado para contato caso você seja o ganhador!</p>
              </div>

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
                  <div style={{ display: 'flex', width: '100%', gap: '8px' }}>
                    <input 
                      type="text" 
                      readOnly 
                      value={pixCodeGenerated} 
                      className="pix-code-input" 
                      onClick={() => {
                        navigator.clipboard.writeText(pixCodeGenerated);
                        alert('Código PIX copiado!');
                      }}
                      title="Clique para copiar"
                      style={{ cursor: 'pointer', flex: 1 }}
                    />
                    <button 
                      className="btn-primary" 
                      style={{ padding: '0 16px', borderRadius: '12px' }}
                      onClick={() => {
                        navigator.clipboard.writeText(pixCodeGenerated);
                        alert('Código PIX copiado!');
                      }}
                    >
                      Copiar
                    </button>
                  </div>
                  <button className="btn-primary" style={{ width: '100%', marginTop: '16px' }} onClick={handleVerifyPayment} disabled={isVerifying}>
                    {isVerifying ? "VERIFICANDO..." : "VERIFICAR PAGAMENTO"}
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
