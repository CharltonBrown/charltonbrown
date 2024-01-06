import React, { useRef } from 'react';
import clsx from 'clsx';

import useIsOverlapping from '@/hooks/useIsOverlapping';

export default function Burger({
  className,
  onClick,
  navTheme,
  disableOverlapping,
}) {
  const ref = useRef();
  const { isOverlapping } = useIsOverlapping({
    rootRef: ref,
    targetClass: 'overlappingTarget',
    inside: true,
  });

  const line = `h-px w-6 my-1 ${
    navTheme === 'light' ? 'bg-white' : 'bg-black'
  } ${
    isOverlapping && !disableOverlapping ? 'bg-white' : 'bg-black'
  } transition ease transform duration-300 opacity-50 group-hover:opacity-100`;

  const handleClick = () => {
    onClick();
  };

  return (
    <button
      ref={ref}
      type="button"
      className={clsx(
        className,
        'flex flex-col h-12 w-10 justify-center items-center group',
      )}
      onClick={() => handleClick()}
    >
      <div className={line} />
      <div className={line} />
      <div className={line} />
    </button>
  );
}
