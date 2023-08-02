import React, { useEffect } from 'react';
import clsx from 'clsx';
import { useContextSelector } from 'use-context-selector';
// import { useInView } from 'react-intersection-observer';

import scrollSnapContext from '@/lib/context/scrollSnapContext';

const getChildrenOnDisplayName = (children, displayName) =>
  React.Children.map(children, (child) => {
    if (!child) return null;
    return child.type.displayName === displayName ? child : null;
  });

const ScrollSnap = ({ children, className }) => {
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
      className={clsx(
        className,
        'relative z-10 max-h-screen snap snap-y snap-mandatory overflow-y-scroll',
      )}
    >
      {child}
    </div>
  );
};
ScrollSnap.displayName = ScrollSnap;

const Child = ({ children, className }) => {
  // const { ref, inView, entry } = useInView({
  //   /* Optional options */
  //   threshold: 0,
  // });

  // console.log({ inView, entry });
  return <div className={clsx(className, 'snap-start')}>{children}</div>;
};
Child.displayName = 'Child';
ScrollSnap.Child = Child;

export default ScrollSnap;
