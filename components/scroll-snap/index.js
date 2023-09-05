import React, { useEffect } from 'react';
import clsx from 'clsx';
import { useContextSelector } from 'use-context-selector';

import FadeInBlock from '@/components/fade-in-block';
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
      id="scrollSnapParent"
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
  useEffect(() => {
    const scrollSnapChild = document.getElementById('scrollSnap');

    // Scroll to top of another scroll snapped page
    if (scrollSnapChild) {
      scrollSnapChild.scrollIntoView({ behavior: 'auto' });
    }
  }, []);

  return (
    <div id="scrollSnap" className="snap-start overflow-hidden">
      <FadeInBlock className={className}>{children}</FadeInBlock>
    </div>
  );
};
Child.displayName = 'Child';
ScrollSnap.Child = Child;

export default ScrollSnap;
