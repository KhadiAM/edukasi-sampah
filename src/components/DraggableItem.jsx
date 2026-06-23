import React from 'react';
import { useDraggable } from '@dnd-kit/core';

export default function DraggableItem({ id, name, icon, type, darkMode }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: id, data: { type } });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    zIndex: transform ? 999 : 1,
    touchAction: 'none',
    transition: transform ? 'none' : 'all 0.2s'
  };

  return (
    <div ref={setNodeRef} style={style} className={`flex flex-col items-center justify-center w-[75px] h-[75px] sm:w-[90px] sm:h-[90px] md:w-[100px] md:h-[100px] p-1 md:p-2 cursor-grab border-[3px] md:border-4 border-black rounded-[15px] md:rounded-[25px] shadow-[3px_3px_0px_#000] md:shadow-[6px_6px_0px_#000] ${darkMode ? 'bg-slate-800 text-sky-400' : 'bg-white text-blue-900'}`} {...listeners} {...attributes}>
      <span className="text-2xl sm:text-3xl md:text-4xl mb-1 pointer-events-none">{icon}</span>
      <span className="font-black text-[6px] sm:text-[7px] md:text-[9px] text-center uppercase pointer-events-none leading-tight max-w-full">{name}</span>
    </div>
  );
}