import React, { useState, useEffect } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { trashData } from '../data/trashData';
import DraggableItem from './DraggableItem';
import DroppableBin from './DroppableBin';

export default function GameBoard({ darkMode, level, setLevel }) {
  const [items, setItems] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("Ayo bersihkan sekolah! 💪");
  const [lastFact, setLastFact] = useState("Tarik sampah ke tong yang benar ya!");
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [lives, setLives] = useState(3);

  // FUNGSI SUARA (Pastikan file ada di folder /public)
  const playSound = (isSuccess) => {
    const audio = new Audio(isSuccess ? '/success.mp3' : '/wrong.mp3');
    audio.play().catch((err) => console.log("Audio play blocked atau file tidak ada", err));
  };

  // FUNGSI ACAK (SHUFFLE)
  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const initLevel = (lvl) => {
    let selectedItems = [];
    if (lvl === 1) {
      // Level 1: Tanpa B3, ambil 8 item secara acak
      const filtered = trashData.filter(item => item.type !== 'B3');
      selectedItems = shuffleArray(filtered).slice(0, 8);
      setFeedback("LEVEL 1: PILAH SAMPAH DASAR! 📋");
    } else {
      // Level 2: Semua jenis sampah, diacak
      selectedItems = shuffleArray(trashData);
      setFeedback("LEVEL 2: AWAS ADA SAMPAH B3! ⚠️");
    }
    setItems(selectedItems);
  };

  // Jalankan saat level berubah
  useEffect(() => {
    initLevel(level);
  }, [level]);

  // RESET GAME TANPA RELOAD (Biar Dark Mode Aman)
  const handlePlayAgain = () => {
    setScore(0);
    setLevel(1);
    setIsGameFinished(false);
    setLastFact("Tarik sampah ke tong yang benar ya!");
    setLives(3);
    initLevel(1);
  };

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const item = items.find(i => i.id === active.id);
    const binType = over.data.current.acceptedType;

    if (item.type === binType) {
      // SUARA BERHASIL
      playSound(true);
      setScore(prev => prev + 10);
      setFeedback(`HEBAT! ${item.name.toUpperCase()} BENAR! ✨`);
      setLastFact(item.fact);
      
      const newItems = items.filter(i => i.id !== active.id);
      setItems(newItems);
      
      if (newItems.length === 0) {
        if (level === 1) {
          setFeedback("LEVEL 1 SELESAI! SIAP KE LEVEL 2? 🚀");
        } else {
          setIsGameFinished(true);
          setFeedback("SEMUA LEVEL SELESAI! 🏆");
        }
      }
    } else {
      // SUARA SALAH
      playSound(false);
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setItems([]); // Kosongkan item sementara biar tidak bisa di-drag lagi
          setFeedback("KAMU KEHABISAN NYAWA! 😭 MULAI LAGI DARI LEVEL 1");
          setTimeout(() => {
            setScore(0);
            setLevel(1);
            setLives(3);
            setLastFact("Tarik sampah ke tong yang benar ya!");
            setIsGameFinished(false);
            initLevel(1);
          }, 2500);
        } else {
          setFeedback("UPS! TEMPATNYA SALAH.. ❌");
        }
        return newLives <= 0 ? 0 : newLives;
      });
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto px-4">
      <div className="w-full flex flex-col md:flex-row gap-4 mb-4 md:mb-8">
        <div className={`flex-1 ${darkMode ? 'bg-red-900' : 'bg-red-500'} border-4 border-black rounded-3xl p-3 md:p-5 text-white shadow-[4px_4px_0px_#000] md:shadow-[8px_8px_0px_#000]`}>
          <div className="flex justify-around items-center h-full">
            <div className="text-center">
              <p className="font-black text-[10px] md:text-sm m-0 tracking-widest">LEVEL: {level}</p>
              <p className="font-black text-3xl md:text-5xl m-0 leading-none">{score}</p>
            </div>
            <div className="text-center flex flex-col items-center">
              <p className="font-black text-[10px] md:text-sm m-0 tracking-widest">NYAWA</p>
              <div className="text-xl md:text-3xl mt-1 tracking-widest flex gap-1 bg-white/30 px-3 py-1 rounded-full shadow-inner">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span key={i} style={{ 
                    opacity: i < lives ? 1 : 0.3, 
                    filter: i < lives ? 'drop-shadow(2px 2px 0px rgba(0,0,0,0.5))' : 'grayscale(100%)' 
                  }}>❤️</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={`flex-[2] ${darkMode ? 'bg-slate-800 text-sky-400' : 'bg-white text-blue-900'} border-4 border-black rounded-3xl p-4 md:p-6 shadow-[4px_4px_0px_#000] md:shadow-[8px_8px_0px_#000] flex items-center justify-center`}>
          <p className="font-black text-sm md:text-2xl text-center m-0 leading-tight">💡 {lastFact}</p>
        </div>
      </div>

      <p className={`font-black text-lg md:text-2xl mb-4 md:mb-8 text-center ${darkMode ? 'text-sky-400' : 'text-blue-900'}`}>{feedback}</p>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex flex-wrap justify-center gap-4 md:gap-10 mb-6 md:mb-12 w-full">
          <DroppableBin id="b-org" label="ORGANIK" subLabel="Sisa makanan & daun" color="#4ade80" acceptedType="organik" darkMode={darkMode} />
          <DroppableBin id="b-ano" label="ANORGANIK" subLabel="Plastik & kaleng" color="#fbbf24" acceptedType="anorganik" darkMode={darkMode} />
          {level === 2 && (
            <DroppableBin id="b-b3" label="B3" subLabel="Baterai & racun" color="#f87171" acceptedType="B3" darkMode={darkMode} />
          )}
        </div>

        <div className={`w-full flex flex-wrap justify-center items-center gap-3 md:gap-5 min-h-[150px] md:min-h-[350px] p-4 md:p-10 border-4 border-dashed border-slate-500 rounded-[2rem] md:rounded-[4rem] shadow-[inset_0_4px_20px_rgba(0,0,0,0.3)] ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
          {items.length > 0 ? (
            items.map(item => <DraggableItem key={item.id} {...item} darkMode={darkMode} />)
          ) : lives <= 0 ? (
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '40px', fontWeight: '900', color: '#ef4444', marginBottom: '10px', textShadow: '4px 4px 0px #000' }} className="text-red-500">GAME OVER! 😭</h2>
              <p style={{ color: darkMode ? '#fff' : '#475569', fontWeight: '900', fontSize: '20px' }}>Sedang mengulang dari Level 1...</p>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              {!isGameFinished ? (
                <>
                  <h2 style={{ fontSize: '40px', fontWeight: '900', color: '#3b82f6', marginBottom: '20px' }}>LEVEL 1 BERHASIL! 👏</h2>
                  <button onClick={() => setLevel(2)} style={{ backgroundColor: '#22c55e', color: 'white', padding: '18px 45px', borderRadius: '50px', fontWeight: '900', border: '4px solid #000', cursor: 'pointer', fontSize: '22px', boxShadow: '4px 4px 0px #000' }}>LANJUT LEVEL 2 ➡️</button>
                </>
              ) : (
                <>
                  <h2 style={{ fontSize: '48px', fontWeight: '900', color: '#22c55e', marginBottom: '10px' }}>MISI SELESAI! 🏅</h2>
                  <p style={{ color: darkMode ? '#fff' : '#475569', fontWeight: '700', marginBottom: '30px' }}>Terima kasih sudah menjaga bumi tetap bersih!</p>
                  <button onClick={handlePlayAgain} style={{ backgroundColor: '#3b82f6', color: 'white', padding: '18px 45px', borderRadius: '50px', fontWeight: '900', border: '4px solid #000', cursor: 'pointer', fontSize: '22px', boxShadow: '4px 4px 0px #000' }}>MAIN LAGI 🚀</button>
                </>
              )}
            </div>
          )}
        </div>
      </DndContext>
    </div>
  );
}