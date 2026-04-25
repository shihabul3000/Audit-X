import React from 'react';
import { useStore } from '../store';
import { NoteSectionComp } from '../Shared';

export const Note20: React.FC = () => {
  const section = useStore(state => state.sections.find(s => s.id === 'note20'));
  
  if (!section) return null;
  return <NoteSectionComp section={section} />;
};