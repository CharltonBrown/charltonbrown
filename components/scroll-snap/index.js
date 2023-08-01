import React, { useEffect, forwardRef } from 'react';
import clsx from 'clsx';
import { useContextSelector } from 'use-context-selector';

import scrollSnapContext from '@/lib/context/scrollSnapContext';

const getChildrenOnDisplayName = (children, displayName) =>
  React.Children.map(children, (child) =>
    child.type.displayName === displayName ? child : null,
  );

const ScrollSnap = forwardRef(({ children, className }, ref) => {
  const child = getChildrenOnDisplayName(children, 'Child');
  const setScrollSnap = useContextSelector(scrollSnapContext, (v) => v[1]);

  useEffect(() => {
    setScrollSnap(() => ({
      active: true,
    }));
    return () => {
      setScrollSnap(() => ({
        active: false,
      }));
    };
  }, [setScrollSnap]);

  return (
    <div
      ref={ref}
      className={clsx(
        className,
        'relative z-10 max-h-screen snap snap-y snap-mandatory overflow-y-scroll',
      )}
    >
      {child}
    </div>
  );
});
ScrollSnap.displayName = ScrollSnap;

const Child = forwardRef(({ children, className }, ref) => {
  return (
    <div className={clsx(className, 'snap-start')} ref={ref}>
      {children}
    </div>
  );
});
Child.displayName = 'Child';
ScrollSnap.Child = Child;

export default ScrollSnap;
