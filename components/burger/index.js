import React from 'react';
import clsx from 'clsx';

export default function Burger({ className, onClick, navTheme }) {
  const genericHamburgerLine = `h-px w-6 my-1 ${
    navTheme === 'light' ? 'bg-white' : 'bg-black'
  } transition ease transform duration-300 opacity-50 group-hover:opacity-100`;

  const handleClick = () => {
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
      <div className={genericHamburgerLine} />
      <div className={genericHamburgerLine} />
      <div className={genericHamburgerLine} />
    </button>
  );
}
