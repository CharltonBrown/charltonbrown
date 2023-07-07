import React from 'react';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex flex-col text-2xl">
      <span>Charlton Brown</span>
      <span>Architecture & Interiors</span>
    </Link>
  );
}
