import React from 'react';
import Link from 'next/link';

export default function ServerError() {
  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center px-10 text-center">
      <p className="font-savoyBold text-xs uppercase tracking-widest text-gray mb-4">
        500
      </p>
      <h1 className="font-savoyBold text-4xl mb-6">Something went wrong</h1>
      <p className="font-savoyRegular text-gray mb-8">
        An unexpected error has occurred. Please try again later.
      </p>
      <Link
        href="/"
        className="font-savoyBold text-xs uppercase tracking-widest underline"
      >
        Return to homepage
      </Link>
    </div>
  );
}
