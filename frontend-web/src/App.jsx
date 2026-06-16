import React, { useState, useEffect } from 'react';
import { listenToSettings, listenToTickets } from './services/databaseService';
import { reserveNumbersAsMimo } from './services/databaseService';
import CheckoutModal from './components/CheckoutModal';
import './App.css';

function App() {
  const [tickets, setTickets] = useState([]);
  const [settings, setSettings] = useState({ totalNumbers: 100, pixPrice: 40.0 });
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPromoPopup, setShowPromoPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const playClickSound = () => {
    if (settings.soundsEnabled !== false) {
      new Audio("https://actions.google.com/sounds/v1/ui/button_click.ogg").play().catch(()=>{});
    }
  };

  const playNotificationSound = () => {
    if (settings.soundsEnabled !== false) {
      new Audio("https://actions.google.com/sounds/v1/alarms/bell_ring.ogg").play().catch(()=>{});
    }
  };

  const playSuccessSound = () => {
    if (settings.soundsEnabled !== false) {
      new Audio("https://actions.google.com/sounds/v1/cartoon/cartoon_success_fanfare.ogg").play().catch(()=>{});
    }
  };

  useEffect(() => {
    if (settings.popupActive && settings.popupMessage) {
      setShowPromoPopup(true);
      playNotificationSound();
    } else {
      setShowPromoPopup(false);
    }
  }, [settings.popupActive, settings.popupMessage]);

  useEffect(() => {
    const unsubSettings = listenToSettings((data) => {
      setSettings(data);
    });
    const unsubTickets = listenToTickets((data) => {
      setTickets(data);
    });

    return () => {
      unsubSettings();
      unsubTickets();
    };
  }, []);

  const toggleNumber = (num) => {
    const isAssigned = tickets.find(t => t.number === num)?.ownerName;
    if (isAssigned) return;

    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else {
      setSelectedNumbers([...selectedNumbers, num]);
    }
    playClickSound();
  };

  const handleConfirmAssignment = async (name, phone, type) => {
    try {
      if (type === 'MIMO') {
        // Salva os números com MIMO no Firebase
        await reserveNumbersAsMimo(selectedNumbers, name, phone);
      }
      // Para PIX, os números já foram salvos pela API create-mp.js
      setShowModal(false);
      setSelectedNumbers([]);
      playSuccessSound();
      setSuccessMessage(
        type === 'MIMO' 
          ? `Seus números foram reservados com sucesso!\nObrigado por colaborar com a Chá Rifa Baby! 🧸`
          : `Obrigado por colaborar com a Chá Rifa Baby! 🧸`
      );
      setShowSuccessPopup(true);
    } catch (error) {
      console.error('Erro ao salvar reserva:', error);
      setSuccessMessage('Ocorreu um erro ao salvar sua reserva. Tente novamente.');
      setShowSuccessPopup(true);
    }
  };

  return (
    <div className="app-container">
      {/* Background Stars CSS animation */}
      <div className="stars-background">
        {Array.from({ length: 30 }).map((_, i) => (
          <div 
            key={i} 
            className="star" 
            style={{ 
              left: `${Math.random() * 100}%`, 
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s` 
            }} 
          />
        ))}
      </div>

      {/* Floating Image Stars */}
      <img src="/anim_star_1.png" style={{ position: 'absolute', top: '100px', left: '10%', width: '20px', animation: 'twinkle 2s infinite alternate' }} alt="star" className="anim-star" />
      <img src="/anim_star_2.png" style={{ position: 'absolute', top: '250px', right: '10%', width: '24px', animation: 'twinkle 3s infinite alternate' }} alt="star" className="anim-star" />
      <img src="/anim_star_4.png" style={{ position: 'absolute', top: '600px', left: '5%', width: '16px', animation: 'twinkle 4s infinite alternate' }} alt="star" className="anim-star" />

      {/* Header Section */}
      <div className="header-section">
        <div className="title-box">
          <img src="/anim_crown.png" alt="crown" className="anim-crown" />
          <h2 className="serif">chá rifa</h2>
          <h1>BABY</h1>
          <img src="/anim_tie.png" alt="tie" className="anim-tie" />
        </div>
        <img src="/anim_bear_balloons.png" alt="bear balloons" className="anim-bear-balloons" />
        <img src="/anim_balloon.png" alt="balloon" className="anim-balloon" />
        <div className="bottle-container">
          <img src="/anim_bottle.png" alt="bottle" className="anim-bottle" />
          <img src="/anim_star_box.png" alt="star box" className="anim-star-box" />
        </div>
      </div>

      {/* Prizes Section */}
      <div className="prizes-section">
        <div className="prize-card">
          <div className="prize-header">
            <div className="prize-pos">1º</div>
            <div className="prize-title">PRÊMIO</div>
          </div>
          <div className="prize-value-container">R$150</div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '18px' }}>🏆</span>
          </div>
        </div>
        <div className="prize-card">
          <div className="prize-header">
            <div className="prize-pos">2º</div>
            <div className="prize-title">PRÊMIO</div>
          </div>
          <div className="prize-value-container">R$100</div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '18px' }}>🎁</span>
          </div>
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid-container">
        {Array.from({ length: settings.totalNumbers }, (_, i) => i + 1).map(num => {
          const ticket = tickets.find(t => t.number === num);
          const isAssigned = !!ticket?.ownerName;
          const isSelected = selectedNumbers.includes(num);

          let className = "number-box";
          if (isAssigned) className += " assigned";
          if (isSelected) className += " selected";

          return (
            <div key={num} className={className} onClick={() => toggleNumber(num)}>
              {isAssigned || isSelected ? (
                <img 
                  src={(ticket?.paymentType === "PIX") ? "/rosto_urso_gravata.png" : "/rosto_urso.png"} 
                  alt="urso" 
                  className="number-image" 
                />
              ) : (
                <span className="number-text">{num}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Confirm Button */}
      {selectedNumbers.length > 0 && (
        <div className="confirm-btn-container">
          <button className="confirm-btn" onClick={() => setShowModal(true)}>
            CONFIRMAR ({selectedNumbers.length})
          </button>
        </div>
      )}

      {/* Instructions Section */}
      <div className="instructions-wrapper">
        <div className="instructions-badge">Como irá funcionar?</div>
        <div className="instructions-card">
          <p className="instructions-text">
            Cada número vale um pacote de fralda + mimo,<br/>
            entrega será feita no dia 25 de julho.
          </p>
          <p className="instructions-date">O sorteio do prêmio será no dia 29 de julho.</p>
          <div className="instructions-pix-note">Via Pix: solicite a chave e mande o comprovante.</div>
          
          <img src="/anim_bag.png" alt="bag" className="anim-bag" />
          <img src="/anim_bear_sitting.png" alt="bear" className="anim-bear-sitting" />
        </div>
      </div>

      {/* Two Ways Section */}
      <div className="instructions-wrapper">
        <div className="instructions-badge">VOCÊ PODE PARTICIPAR DE 2 FORMAS:</div>
        <div className="two-ways-card">
          <div className="way-col">
            <img src="/anim_diaper_1.png" alt="diaper" className="anim-diaper" />
            <div className="way-title">1) DOAR</div>
            <div className="way-badge">FRALDA+MIMO</div>
            <div className="way-desc">Cada número =<br/>1 pacote de fralda<br/>+ 1 mimo</div>
          </div>
          <div className="vertical-divider"></div>
          <div className="way-col">
            <img src="/anim_pix.png" alt="pix" className="anim-pix-icon" />
            <div className="way-title">2) PIX</div>
            <div className="way-price">R${(settings.pixPrice || 0).toFixed(2)}</div>
            <div className="way-desc">Cada número<br/>escolhido</div>
          </div>
        </div>
      </div>

      {showModal && (
        <CheckoutModal 
          selectedNumbers={selectedNumbers}
          pixPrice={settings.pixPrice}
          onDismiss={() => setShowModal(false)}
          onConfirm={handleConfirmAssignment}
        />
      )}

      {showPromoPopup && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ backgroundColor: '#F8F5EC', border: '2px solid #4C6A2B' }}>
            <h3 className="modal-title" style={{ fontSize: '28px' }}>🎁 Promoção!</h3>
            <p style={{ textAlign: 'center', fontSize: '16px', color: '#5A3E26', fontWeight: '500', marginBottom: '16px' }}>
              {settings.popupMessage}
            </p>
            <button className="btn-primary" style={{ width: '100%' }} onClick={() => setShowPromoPopup(false)}>
              Legal, entendi!
            </button>
          </div>
        </div>
      )}

      {/* Pop-up de Sucesso estilizado */}
      {showSuccessPopup && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ backgroundColor: '#F8F5EC', border: '2px solid #4C6A2B', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🧸</div>
            <h3 className="modal-title" style={{ fontSize: '22px' }}>Tudo Certo!</h3>
            <p style={{ fontSize: '15px', color: '#5A3E26', fontWeight: '500', marginBottom: '20px', whiteSpace: 'pre-line' }}>
              {successMessage}
            </p>
            <button className="btn-primary" style={{ width: '100%' }} onClick={() => setShowSuccessPopup(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
