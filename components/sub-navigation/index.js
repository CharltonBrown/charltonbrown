import Link from 'next/link';
import React from 'react';

export default function SubNavigation() {
  return (
    <nav>
      <ul>
        <li>
          <Link href="somehting">Something</Link>
        </li>
      </ul>
    </nav>
  );
}
