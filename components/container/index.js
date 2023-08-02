import React from 'react';
import clsx from 'clsx';

export default function Container({ children, className }) {
  return (
    <div className={clsx('w-full p-5 md:p-8 lg:p-10', className)}>
      {children}
    </div>
  );
}
