import React, { useEffect, useState, useCallback } from 'react';
import clsx from 'clsx';
import { cubicBezier, useAnimate } from 'framer-motion';

export default function ScrollPrompt({ className }) {
  const [scrollTop, setScrollTop] = useState(0);
  const [textScope, animateText] = useAnimate();
  const [lineScope, animateLine] = useAnimate();

  const show = useCallback(async () => {
    if (!lineScope.current) return;
    await animateText(textScope.current, { opacity: 1 }, { duration: 0.25 });
    await animateLine(lineScope.current, { height: 120 }, { duration: 0.25 });
    await animateLine(
      lineScope.current,
      { y: 10 },
      {
        duration: 0.75,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: cubicBezier(0.0, 0.0, 0.2, 1),
      },
    );
  }, [animateLine, animateText, lineScope, textScope]);

  const hide = useCallback(async () => {
    if (!lineScope.current) return;
    await animateLine(lineScope.current, { height: 0 }, { duration: 0.25 });
    await animateLine(lineScope.current, { y: 0 });
    await animateText(textScope.current, { opacity: 0 }, { duration: 0.25 });
  }, [animateLine, animateText, lineScope, textScope]);

  useEffect(() => {
    if (scrollTop === 0) {
      setTimeout(() => {
        show();
      }, 2000);
    } else {
      hide();
    }
  }, [hide, scrollTop, show]);

  useEffect(() => {
    const onScroll = (e) => {
      setScrollTop(e.target.documentElement.scrollTop);
    };
    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollTop]);

  return (
    <div className={clsx('overflow-hidden', className)}>
      <div className="flex flex-col h-36 items-center text-white">
        <p ref={textScope} className="text-lg mb-2 opacity-0">
          Scroll
        </p>
        <div
          ref={lineScope}
          className="w-px h-0 bg-white will-change-transform"
        />
      </div>
    </div>
  );
}
