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
      setFeedback("UPS! TEMPATNYA SALAH.. ❌");
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto px-4">
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div style={{ backgroundColor: darkMode ? '#7f1d1d' : '#ef4444', border: '4px solid #000', borderRadius: '2rem', padding: '20px', color: '#fff', textAlign: 'center', boxShadow: '8px 8px 0px #000' }}>
          <p style={{ fontWeight: '900', fontSize: '12px' }}>LEVEL: {level} | SKOR</p>
          <p style={{ fontWeight: '900', fontSize: '55px', margin: 0 }}>{score}</p>
        </div>

        <div style={{ backgroundColor: darkMode ? '#1e293b' : '#fff', border: '4px solid #000', borderRadius: '2rem', padding: '30px', boxShadow: '8px 8px 0px #000', display: 'flex', alignItems: 'center', justifyContent: 'center', gridColumn: 'span 2' }}>
          <p style={{ fontWeight: '900', fontSize: '22px', textAlign: 'center', margin: 0, color: darkMode ? '#38bdf8' : '#1e3a8a' }}>💡 {lastFact}</p>
        </div>
      </div>

      <p style={{ color: darkMode ? '#38bdf8' : '#1e3a8a', fontSize: '28px', fontWeight: '900', marginBottom: '30px', textAlign: 'center' }}>{feedback}</p>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex flex-wrap justify-center gap-10 mb-20">
          <DroppableBin id="b-org" label="ORGANIK" subLabel="Sisa makanan & daun" color="#4ade80" acceptedType="organik" darkMode={darkMode} />
          <DroppableBin id="b-ano" label="ANORGANIK" subLabel="Plastik & kaleng" color="#fbbf24" acceptedType="anorganik" darkMode={darkMode} />
          {level === 2 && (
            <DroppableBin id="b-b3" label="B3" subLabel="Baterai & racun" color="#f87171" acceptedType="B3" darkMode={darkMode} />
          )}
        </div>

        <div style={{ backgroundColor: darkMode ? '#111827' : '#fff', border: '4px dashed #64748b', borderRadius: '4rem', padding: '40px', minHeight: '350px', width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '20px', boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.3)' }}>
          {items.length > 0 ? (
            items.map(item => <DraggableItem key={item.id} {...item} darkMode={darkMode} />)
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