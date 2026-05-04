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
    <div ref={setNodeRef} style={{ position: 'relative', width: '160px', height: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: '0.2s', transform: isOver ? 'scale(1.05)' : 'scale(1)' }}>
      <div style={{ backgroundColor: getBinColor(), width: '130px', height: '20px', borderRadius: '30px 30px 0 0', border: '4px solid #000', marginBottom: '-4px', zIndex: 10 }}></div>
      <div style={{ backgroundColor: getBinColor(), width: '100%', height: '100%', borderRadius: '0 0 30px 30px', border: '4px solid #000', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '15px', boxShadow: '6px 6px 0px rgba(0,0,0,0.5)' }}>
        <div style={{ backgroundColor: darkMode ? '#0f172a' : '#fff', border: '3px solid #000', padding: '3px 15px', borderRadius: '15px', marginBottom: '10px' }}>
          <span style={{ fontWeight: '900', fontSize: '12px', color: darkMode ? '#38bdf8' : '#000' }}>{label}</span>
        </div>
        <div style={{ backgroundColor: darkMode ? '#0f172a' : '#fff', border: '3px solid #000', padding: '5px', borderRadius: '10px', width: '85%' }}>
          <p style={{ fontWeight: '900', fontSize: '10px', textAlign: 'center', margin: 0, color: darkMode ? '#38bdf8' : '#000' }}>{subLabel}</p>
        </div>
      </div>
    </div>
  );
}