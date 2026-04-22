import React from 'react';
import { useStore } from '../store';
import { NoteSectionComp } from '../Shared';

export const Note20pay: React.FC = () => {
  const section = useStore(state => state.sections.find(s => s.id === 'note20_pay'));
  
  if (!section) return null;
  return <NoteSectionComp section={section} />;
};