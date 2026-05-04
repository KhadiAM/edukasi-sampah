import React, { useState, useEffect, useRef } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { trashData } from '../data/trashData';
import DraggableItem from './DraggableItem';
import DroppableBin from './DroppableBin';
import confetti from 'canvas-confetti';

export default function GameBoard({ darkMode, level, setLevel }) {
  const [items, setItems] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("Ayo bersihkan sekolah! 💪");
  const [lastFact, setLastFact] = useState("Tarik sampah ke tong yang benar ya!");
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isPopping, setIsPopping] = useState(false);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const audioRef = useRef(null);

  // FUNGSI SUARA (Pastikan file ada di folder /public)
  const playSound = (type) => {
    let audioSrc = '';
    if (type === 'success') audioSrc = '/success.mp3';
    else if (type === 'wrong') audioSrc = '/wrong.mp3';
    else if (type === 'gameover') audioSrc = '/no-attempt.mp3';
    else if (type === 'victory') audioSrc = '/musik kemangan.mp3';

    if (audioSrc) {
      const audio = new Audio(audioSrc);
      if (type === 'victory' || type === 'gameover') {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        audioRef.current = audio;
      }
      audio.play().catch((err) => console.log("Audio play blocked atau file tidak ada", err));
    }
  };

  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
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
    stopMusic();
    setScore(0);
    setLevel(1);
    setLives(3);
    setIsGameFinished(false);
    setIsGameOver(false);
    setLastFact("Tarik sampah ke tong yang benar ya!");
    initLevel(1);
  };

  const handleRetryLevel = () => {
    stopMusic();
    setLives(3);
    setIsGameOver(false);
    setFeedback(level === 1 ? "LEVEL 1: PILAH SAMPAH DASAR! 📋" : "LEVEL 2: AWAS ADA SAMPAH B3! ⚠️");
    initLevel(level);
  };

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragEnd = (event) => {
    if (isGameOver) return;
    const { active, over } = event;
    if (!over) return;

    const item = items.find(i => i.id === active.id);
    const binType = over.data.current.acceptedType;

    if (item.type === binType) {
      // SUARA BERHASIL
      playSound('success');
      setScore(prev => prev + 10);
      setFeedback(`HEBAT! ${item.name.toUpperCase()} BENAR! ✨`);
      setLastFact(item.fact);
      
      setIsPopping(true);
      setTimeout(() => setIsPopping(false), 400);
      
      const newItems = items.filter(i => i.id !== active.id);
      setItems(newItems);
      
      if (newItems.length === 0) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          zIndex: 9999
        });
        
        if (level === 1) {
          setFeedback("LEVEL 1 SELESAI! SIAP KE LEVEL 2? 🚀");
        } else {
          playSound('victory');
          setIsGameFinished(true);
          setFeedback("SEMUA LEVEL SELESAI! 🏆");
        }
      }
    } else {
      // SUARA SALAH
      const newLives = lives - 1;
      setLives(newLives);

      if (newLives <= 0) {
        playSound('gameover');
        setIsGameOver(true);
        setFeedback("YAH, NYAWA HABIS! 💔");
      } else {
        playSound('wrong');
        setFeedback("UPS! TEMPATNYA SALAH.. ❌");
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 400);
      }
    }
  };

  return (
    <div className={`flex flex-col items-center w-full max-w-6xl mx-auto px-4 ${isShaking ? 'shake-animation' : ''}`}>
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div style={{ backgroundColor: darkMode ? '#7f1d1d' : '#ef4444', border: '4px solid #000', borderRadius: '1.5rem', padding: '10px', color: '#fff', textAlign: 'center', boxShadow: '6px 6px 0px #000' }}>
          <p style={{ fontWeight: '900', fontSize: '12px', margin: 0 }}>LEVEL: {level} | SKOR</p>
          <p className={isPopping ? 'pop-animation' : ''} style={{ fontWeight: '900', fontSize: '40px', margin: 0, lineHeight: '1', transition: 'color 0.2s' }}>{score}</p>
        </div>

        <div style={{ backgroundColor: darkMode ? '#1e293b' : '#fff', border: '4px solid #000', borderRadius: '1.5rem', padding: '10px', boxShadow: '6px 6px 0px #000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontWeight: '900', fontSize: '12px', margin: 0, color: darkMode ? '#38bdf8' : '#1e3a8a' }}>NYAWA</p>
          <div style={{ marginTop: '5px', fontSize: '24px' }}>
            {[...Array(3)].map((_, i) => (
              <span key={i} style={{ opacity: i < lives ? 1 : 0.2, transition: '0.3s', margin: '0 2px', filter: i < lives ? 'none' : 'grayscale(100%)' }}>❤️</span>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: darkMode ? '#1e293b' : '#fff', border: '4px solid #000', borderRadius: '1.5rem', padding: '15px', boxShadow: '6px 6px 0px #000', display: 'flex', alignItems: 'center', justifyContent: 'center', gridColumn: 'span 2' }}>
          <p style={{ fontWeight: '900', fontSize: '18px', textAlign: 'center', margin: 0, color: darkMode ? '#38bdf8' : '#1e3a8a' }}>💡 {lastFact}</p>
        </div>
      </div>

      <p style={{ color: darkMode ? '#38bdf8' : '#1e3a8a', fontSize: '20px', fontWeight: '900', marginBottom: '15px', textAlign: 'center', margin: 0 }}>{feedback}</p>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex flex-wrap justify-center gap-6 mb-6 mt-4">
          <DroppableBin id="b-org" label="ORGANIK" subLabel="Sisa makanan & daun" color="#4ade80" acceptedType="organik" darkMode={darkMode} />
          <DroppableBin id="b-ano" label="ANORGANIK" subLabel="Plastik & kaleng" color="#fbbf24" acceptedType="anorganik" darkMode={darkMode} />
          {level === 2 && (
            <DroppableBin id="b-b3" label="B3" subLabel="Baterai & racun" color="#f87171" acceptedType="B3" darkMode={darkMode} />
          )}
        </div>

        <div style={{ backgroundColor: darkMode ? '#111827' : '#fff', border: '4px dashed #64748b', borderRadius: '2rem', padding: '20px', minHeight: '180px', width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '25px', boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.3)' }}>
          {isGameOver ? (
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '48px', fontWeight: '900', color: '#ef4444', marginBottom: '10px' }}>GAME OVER! 💔</h2>
              <p style={{ color: darkMode ? '#fff' : '#475569', fontWeight: '700', marginBottom: '30px', fontSize: '18px' }}>Jangan menyerah, ayo coba lagi menjaga bumi!</p>
              <button onClick={handleRetryLevel} style={{ backgroundColor: '#ef4444', color: 'white', padding: '15px 40px', borderRadius: '50px', fontWeight: '900', border: '4px solid #000', cursor: 'pointer', fontSize: '20px', boxShadow: '4px 4px 0px #000' }}>COBA LAGI 🔄</button>
            </div>
          ) : items.length > 0 ? (
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