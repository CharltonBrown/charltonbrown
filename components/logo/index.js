import React from 'react';
import Link from 'next/link';

import FootnoteThree from '@/components/icons/footnotes/footnote-3';

export default function Logo() {
  return (
    <Link href="/" className="relative flex flex-col text-xl">
      <FootnoteThree className="absolute top-0 -left-3 w-2 h-2 stroke-white" />
      <h2>Charlton Brown</h2>
      <h3>Architecture & Interiors</h3>
    </Link>
  );
}
