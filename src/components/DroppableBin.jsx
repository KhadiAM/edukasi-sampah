import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export default function DroppableBin({ id, label, subLabel, color, acceptedType, darkMode }) {
  const { isOver, setNodeRef } = useDroppable({ id: id, data: { acceptedType, color } });

  const getBinColor = () => {
    if (!darkMode) return color;
    if (id === 'b-org') return '#1e3a2f';
    if (id === 'b-ano') return '#3e3214';
    if (id === 'b-b3') return '#451a1a';
    return color;
  };

  return (
    <div ref={setNodeRef} className={`relative flex flex-col items-center transition-transform duration-200 ${isOver ? 'scale-105' : 'scale-100'} w-[30%] sm:w-[150px] md:w-[220px] h-[180px] sm:h-[200px] md:h-[280px]`}>
      <div style={{ backgroundColor: getBinColor() }} className="w-[85%] md:w-[190px] h-[15px] md:h-[30px] rounded-t-3xl md:rounded-t-[40px] border-[2px] md:border-4 border-black -mb-[2px] md:-mb-1 z-10"></div>
      <div style={{ backgroundColor: getBinColor() }} className="w-full h-full rounded-b-3xl md:rounded-b-[40px] border-[2px] md:border-4 border-black flex flex-col items-center pt-2 md:pt-5 shadow-[4px_4px_0px_rgba(0,0,0,0.5)] md:shadow-[8px_8px_0px_rgba(0,0,0,0.5)]">
        <div className={`border-[2px] md:border-4 border-black px-1 py-0 md:px-5 md:py-1 rounded-lg md:rounded-2xl mb-1 md:mb-4 ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
          <span className={`font-black text-[8px] sm:text-[10px] md:text-sm ${darkMode ? 'text-sky-400' : 'text-black'}`}>{label}</span>
        </div>
        <div className={`border-[2px] md:border-3 border-black p-1 md:p-2 rounded-lg md:rounded-xl w-[90%] md:w-[85%] ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
          <p className={`font-black text-[6px] sm:text-[8px] md:text-[11px] text-center m-0 leading-tight ${darkMode ? 'text-sky-400' : 'text-black'}`}>{subLabel}</p>
        </div>
      </div>
    </div>
  );
}