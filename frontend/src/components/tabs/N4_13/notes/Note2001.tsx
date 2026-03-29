import React from 'react';
import { useStore } from '../store';
import { NoteSectionComp } from '../Shared';

export const Note2001: React.FC = () => {
  const section = useStore(state => state.sections.find(s => s.id === 'note20_01'));
  
  if (!section) return null;
  return <NoteSectionComp section={section} />;
};