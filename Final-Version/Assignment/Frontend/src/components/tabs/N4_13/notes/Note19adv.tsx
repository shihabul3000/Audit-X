import React from 'react';
import { useStore } from '../store';
import { NoteSectionComp } from '../Shared';

export const Note19adv: React.FC = () => {
  const section = useStore(state => state.sections.find(s => s.id === 'note19_adv'));
  
  if (!section) return null;
  return <NoteSectionComp section={section} />;
};