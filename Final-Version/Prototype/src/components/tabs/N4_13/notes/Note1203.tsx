import React from 'react';
import { useStore } from '../store';
import { NoteSectionComp } from '../Shared';

export const Note1203: React.FC = () => {
  const section = useStore(state => state.sections.find(s => s.id === 'note12_03'));
  
  if (!section) return null;
  return <NoteSectionComp section={section} />;
};