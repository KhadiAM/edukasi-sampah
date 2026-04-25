import React, { useState } from 'react';
import GameBoard from './components/GameBoard';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [level, setLevel] = useState(1); // Pindahin state level ke sini

  const backgroundStyle = {
    minHeight: '100vh',
    paddingBottom: '50px',
    fontFamily: '"Arial Black", sans-serif',
    transition: '0.5s ease',
    position: 'relative',
    overflowX: 'hidden',
    backgroundColor: darkMode ? '#020617' : '#f0f9ff',
    backgroundImage: darkMode 
      ? 'radial-gradient(#1e293b 2px, transparent 2px)' 
      : 'radial-gradient(#cbd5e1 2px, transparent 2px)',
    backgroundSize: '40px 40px',
  };

  return (
    <div style={backgroundStyle}>
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}</style>

      {/* TOMBOL MODE */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
        <button onClick={() => setDarkMode(!darkMode)} style={{ width: '65px', height: '65px', borderRadius: '20px', border: '5px solid #000', backgroundColor: darkMode ? '#1e293b' : '#fff', fontSize: '35px', cursor: 'pointer', boxShadow: '6px 6px 0px #000' }}>
          {darkMode ? '🌙' : '☀️'}
        </button>
      </div>

      <header style={{ textAlign: 'center', padding: '50px 20px', position: 'relative', zIndex: 1 }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <h1 style={{ fontSize: '80px', fontWeight: '900', color: darkMode ? '#38bdf8' : '#1e3a8a', textTransform: 'uppercase', margin: '0', textShadow: '8px 8px 0px #000', lineHeight: '0.8', letterSpacing: '-4px' }}>
            PILAH <br/> <span style={{ color: '#22c55e' }}>SAMPAH</span>
          </h1>
          <div style={{ position: 'absolute', top: '-20px', right: '-40px', backgroundColor: '#fbbf24', padding: '5px 15px', borderRadius: '10px', border: '4px solid #000', transform: 'rotate(15deg)', fontWeight: '900', fontSize: '20px', boxShadow: '4px 4px 0px #000' }}>YUK!</div>
        </div>
        <br />
        <div style={{ display: 'inline-block', padding: '15px 50px', borderRadius: '25px', border: '5px solid #000', backgroundColor: darkMode ? '#334155' : '#fff', marginTop: '30px', boxShadow: '8px 8px 0px #000', transform: 'rotate(-1deg)' }}>
          <p style={{ fontWeight: '900', fontSize: '20px', textTransform: 'uppercase', margin: 0, color: darkMode ? '#38bdf8' : '#1e3a8a' }}>
            ⭐ MISI PENYELAMAT BUMI ⭐
          </p>
        </div>
      </header>
      
      <main style={{ position: 'relative', zIndex: 1 }}>
        {/* Kirim level dan setLevel ke GameBoard */}
        <GameBoard darkMode={darkMode} level={level} setLevel={setLevel} />
      </main>

      {/* FOOTER SEKARANG DINAMIS */}
      <footer style={{ textAlign: 'center', marginTop: '60px', color: darkMode ? '#475569' : '#94a3b8', fontWeight: '900', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5em', paddingBottom: '30px' }}>
        LEVEL {level}: {level === 1 ? 'SEKOLAH BERSIH 🏫' : 'SANG AHLI LINGKUNGAN 🌍'}
      </footer>
    </div>
  );
}

export default App;