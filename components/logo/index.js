import React from 'react';
import Link from 'next/link';

import FootnoteThree from '@/components/icons/footnotes/footnote-3';

export default function Logo() {
  return (
    <Link href="/" className="relative flex flex-col pl-3 text-2xl">
      <FootnoteThree className="absolute top-0 left-0 w-2 h-2 stroke-white" />
      <span>Charlton Brown</span>
      <span>Architecture & Interiors</span>
    </Link>
  );
}
