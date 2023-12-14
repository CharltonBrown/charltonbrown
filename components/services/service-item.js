import React, { useEffect, useCallback } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useAnimate } from 'framer-motion';
import clsx from 'clsx';

import Accordion from '@/components/services/accordion';
import richTextStyles from '@/components/rich-text/rich-text.module.css';
import { useBreakpoint } from '@/hooks/tailwind';
import useScrollIntoView from '@/hooks/useScrollIntoView';
import timeout from '@/lib/utils/timeout';

export default function ServiceItem({
  title,
  headline,
  intro,
  onClick,
  open,
  accordion,
  image,
}) {
  const [scrollRef, setShouldScrollTo] = useScrollIntoView();
  const isLgScreen = useBreakpoint('lg');
  const [introScope, animateIntro] = useAnimate();
  const [bodyScope, animateBody] = useAnimate();
  const [borderScope, animateBorder] = useAnimate();

  const showIntro = useCallback(async () => {
    await animateIntro(
      introScope.current,
      { height: 'auto', opacity: 1 },
      { duration: 0.25 },
    );
  }, [animateIntro, introScope]);

  const hideIntro = useCallback(async () => {
    await animateIntro(
      introScope.current,
      { height: 0, opacity: 0 },
      { duration: 0.25, delay: 0.25 },
    );
  }, [animateIntro, introScope]);

  const showBody = useCallback(async () => {
    await animateBody(
      bodyScope.current,
      { height: 'auto', opacity: 1 },
      { duration: 0.25 },
    );
  }, [animateBody, bodyScope]);

  const hideBody = useCallback(async () => {
    await animateBody(
      bodyScope.current,
      { height: 0, opacity: 0 },
      { duration: 0.25, delay: 0.25 },
    );
  }, [animateBody, bodyScope]);

  const showBorder = useCallback(async () => {
    await animateBorder(
      borderScope.current,
      { width: '100%' },
      { duration: 0.25 },
    );
  }, [animateBorder, borderScope]);

  const hideBorder = useCallback(async () => {
    await animateBorder(
      borderScope.current,
      { width: '50%' },
      { duration: 0.25 },
    );
  }, [animateBorder, borderScope]);

  const handleToggle = useCallback(async () => {
    if (isLgScreen && open) {
      await showBorder();
      await showIntro();
      await showBody();
      await timeout(500);
      await setShouldScrollTo(true);
      return;
    }

    if (isLgScreen && !open) {
      await hideBody();
      await hideBorder();
      await hideIntro();
      return;
    }

    if (open) {
      await showIntro();
      await showBody();
      await timeout(500);
      await setShouldScrollTo(true);
      return;
    }

    await hideBody();
    await hideIntro();
  }, [
    hideBody,
    hideBorder,
    hideIntro,
    isLgScreen,
    open,
    setShouldScrollTo,
    showBody,
    showBorder,
    showIntro,
  ]);

  useEffect(() => {
    handleToggle();
  }, [open, handleToggle]);

  const handleClick = () => {
    onClick();
  };

  return (
    <article
      className={clsx(
        'mb-10 scroll-mt-10 md:scroll-mt-32 lg:scroll-mt-48',
        open && 'lg:mb-32',
      )}
      ref={scrollRef}
    >
      <div className="lg:flex justify-end">
        <div className="mb-12 lg:w-1/2">
          <h2 className="text-2xl mb-4">
            <button
              type="button"
              onClick={handleClick}
              className="flex w-full justify-between items-center hover:opacity-50 transition text-left"
            >
              {title}
              <PlusIcon
                className={clsx(
                  'w-6 h-6 border rounded-full transition',
                  open && 'rotate-45',
                )}
              />
            </button>
          </h2>
          <div
            dangerouslySetInnerHTML={{
              __html: headline,
            }}
            className={clsx(richTextStyles.richText, 'mb-4 max-w-prose')}
          />
          <div
            dangerouslySetInnerHTML={{
              __html: intro,
            }}
            className={clsx(
              richTextStyles.richText,
              'h-0 opacity-0 overflow-hidden max-w-prose',
            )}
            ref={introScope}
          />
        </div>
      </div>
      <div className="lg:flex justify-end">
        <div className="border-t lg:w-1/2" ref={borderScope}>
          <div className="h-0 opacity-0 overflow-clip" ref={bodyScope}>
            <Accordion
              items={accordion}
              serviceImage={image}
              onClose={!!open}
              openService={open}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
