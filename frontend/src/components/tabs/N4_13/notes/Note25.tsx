import React from 'react';
import { useStore } from '../store';
import { NoteSectionComp } from '../Shared';

export const Note25: React.FC = () => {
  const section = useStore(state => state.sections.find(s => s.id === 'note25'));
  
  if (!section) return null;
  return <NoteSectionComp section={section} />;
};