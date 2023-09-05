import React, { useRef } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

import FootnoteThree from '@/components/icons/footnotes/footnote-3';
import useIsOverlapping from '@/hooks/useIsOverlapping';

export default function Logo() {
  const ref = useRef();
  const { isOverlapping } = useIsOverlapping({
    rootRef: ref,
    targetClass: 'overlappingTarget',
    inside: true,
  });

  return (
    <Link
      href="/"
      className={clsx(
        'relative flex flex-col text-xl transition',
        isOverlapping && 'text-white',
      )}
      ref={ref}
    >
      <FootnoteThree className="absolute top-0 -left-3 w-2 h-2 stroke-white" />
      <h2>Charlton Brown</h2>
      <h3>Architecture & Interiors</h3>
    </Link>
  );
}
