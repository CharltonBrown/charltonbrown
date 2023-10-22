import React from 'react';
import clsx from 'clsx';

export default function ContentGutter({ children, className }) {
  return <div className={clsx('pt-52 lg:pl-60', className)}>{children}</div>;
}
