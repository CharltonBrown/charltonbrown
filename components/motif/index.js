import React from 'react';
import clsx from 'clsx';
import {
  MotifOne,
  MotifTwo,
  MotifThree,
  MotifFour,
  MotifFive,
} from '@/components/icons/motifs';

export default function Motif({ className, motifId }) {
  const renderMotif = () => {
    const mergedClassName = clsx('border border-black', className);

    switch (motifId) {
      case 'motif-1':
        return <MotifOne className={mergedClassName} />;
      case 'motif-2':
        return <MotifTwo className={mergedClassName} />;
      case 'motif-3':
        return <MotifThree className={mergedClassName} />;
      case 'motif-4':
        return <MotifFour className={mergedClassName} />;
      case 'motif-5':
        return <MotifFive className={mergedClassName} />;
      default:
        return null;
    }
  };

  return renderMotif();
}
