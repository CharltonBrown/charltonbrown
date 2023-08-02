import React from 'react';

export default function SubNavigation({ children }) {
  return (
    <div className="w-[220px] shrink-0 h-screen sticky top-0 flex flex-col justify-center">
      {children}
    </div>
  );
}
