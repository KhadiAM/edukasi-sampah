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

      <header className="text-center pt-8 pb-4 px-4 relative z-10">
        <div className="relative inline-block">
          <h1 className={`text-6xl md:text-[80px] font-black uppercase m-0 leading-[0.8] tracking-[-4px] ${darkMode ? 'text-sky-400' : 'text-blue-900'}`} style={{ textShadow: '4px 4px 0px #000' }}>
            PILAH <br/> <span className="text-green-500">SAMPAH</span>
          </h1>
          <div className="absolute -top-4 -right-4 md:-top-5 md:-right-10 bg-amber-400 px-2 py-1 md:px-4 md:py-2 rounded-xl border-4 border-black rotate-12 font-black text-sm md:text-xl shadow-[4px_4px_0px_#000]">YUK!</div>
        </div>
        
        <div className={`inline-block px-4 py-2 md:px-12 md:py-3 rounded-3xl border-4 border-black mt-6 shadow-[4px_4px_0px_#000] md:shadow-[8px_8px_0px_#000] -rotate-1 ${darkMode ? 'bg-slate-700' : 'bg-white'}`}>
          <p className={`font-black text-sm md:text-xl uppercase m-0 ${darkMode ? 'text-sky-400' : 'text-blue-900'}`}>
            ⭐ MISI PENYELAMAT BUMI ⭐
          </p>
        </div>
      </header>
      
      <main className="relative z-10">
        {/* Kirim level dan setLevel ke GameBoard */}
        <GameBoard darkMode={darkMode} level={level} setLevel={setLevel} />
      </main>

      {/* FOOTER SEKARANG DINAMIS */}
      <footer className={`text-center mt-6 pb-6 font-black text-xs md:text-sm uppercase tracking-widest ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
        LEVEL {level}: {level === 1 ? 'SEKOLAH BERSIH 🏫' : 'SANG AHLI LINGKUNGAN 🌍'}
      </footer>
    </div>
  );
}

export default App;