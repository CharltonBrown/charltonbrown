import React, { useState } from 'react';
import clsx from 'clsx';

export default function Burger({ className, onClick, navTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const genericHamburgerLine = `h-px w-6 my-1 ${
    navTheme === 'light' ? 'bg-white' : 'bg-black'
  } transition ease transform duration-300`;

  const handleClick = () => {
    setIsOpen(!isOpen);
    onClick();
  };

  return (
    <button
      type="button"
      className={clsx(
        className,
        'flex flex-col h-12 w-10 justify-center items-center group',
      )}
      onClick={() => handleClick()}
    >
      <div
        className={`${genericHamburgerLine} ${
          isOpen
            ? 'rotate-45 translate-y-[9px] opacity-50 group-hover:opacity-100'
            : 'opacity-50 group-hover:opacity-100'
        }`}
      />
      <div
        className={`${genericHamburgerLine} ${
          isOpen ? 'opacity-0' : 'opacity-50 group-hover:opacity-100'
        }`}
      />
      <div
        className={`${genericHamburgerLine} ${
          isOpen
            ? '-rotate-45 -translate-y-[9px] opacity-50 group-hover:opacity-100'
            : 'opacity-50 group-hover:opacity-100'
        }`}
      />
    </button>
  );
}
