import React from 'react';
import { useDraggable } from '@dnd-kit/core';

export default function DraggableItem({ id, name, icon, type, darkMode }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: id, data: { type } });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    zIndex: transform ? 999 : 1,
    touchAction: 'none',
    backgroundColor: darkMode ? '#1e293b' : '#ffffff', 
    color: darkMode ? '#38bdf8' : '#1e3a8a', 
    border: '4px solid #000',
    boxShadow: '6px 6px 0px #000',
    borderRadius: '25px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100px',
    height: '100px',
    padding: '10px',
    cursor: 'grab',
    transition: transform ? 'none' : 'all 0.2s'
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <span style={{ fontSize: '36px', marginBottom: '4px', pointerEvents: 'none' }}>{icon}</span>
      <span style={{ fontWeight: '900', fontSize: '9px', textAlign: 'center', textTransform: 'uppercase', pointerEvents: 'none', lineHeight: '1', maxWidth: '100%' }}>{name}</span>
    </div>
  );
}