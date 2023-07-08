import React from 'react';
import clsx from 'clsx';

import useElementOnScreen from '@/hooks/useElementOnScreen';

export default function Footer() {
  const [containerRef, isVisible] = useElementOnScreen({
    root: null,
    rootMargin: '0px',
    theshold: 1.0,
  });

  return (
    <>
      <div
        ref={containerRef}
        className="relative bg-black h-4 w-full pb-[calc(100vh)]"
      />
      <footer
        className={clsx(
          isVisible ? 'visible' : 'invisible',
          'fixed bottom-0 w-full h-screen  p-5 md:p-7 lg:p-10 bg-alabaster',
        )}
      >
        <div className="flex flex-col h-full">
          <div className="grow sm:grid sm:grid-cols-3 md:grid-cols-4 gap-16">
            <div className="flex flex-col justify-center text-xl">
              <h2 className="border-t border-gallery text-gray text-lg pt-4 mb-8">
                Address
              </h2>
              <p>2 Back Lane, Hampstead</p>
              <p>London NW3 1HL</p>
            </div>
            <div className="flex flex-col justify-center  text-xl">
              <h2 className="border-t border-gallery text-gray text-lg pt-4 mb-8">
                Contact
              </h2>
              <p>
                <a href="mailto:office@charltonbrown.com">
                  office@charltonbrown.com
                </a>
              </p>
              <p>
                <a href="tel:+44 (0)20 7794 1234">+44 (0)20 7794 1234</a>
              </p>
            </div>
            <div className="hidden lg:flex flex-col justify-center  text-xl">
              <h2 className="border-t border-gallery text-gray text-lg pt-4 mb-8">
                Information
              </h2>
              <p>
                <a href="/practice/">The practice</a>
              </p>
              <p>
                <a href="/practice/people/">People</a>
              </p>
            </div>
            <div className="flex flex-col justify-center text-xl">
              <h2 className="border-t border-gallery text-gray text-lg pt-4 mb-8">
                Social media
              </h2>
              <p>
                <a
                  href="https://www.instagram.com/charltonbrown_/"
                  target="_blank"
                >
                  Instagram opens in a new tab.
                </a>
              </p>
              <p>
                <a
                  href="https://www.linkedin.com/company/charlton-brown-architects"
                  target="_blank"
                >
                  LinkedIn, opens in a new tab.
                </a>
              </p>
            </div>
          </div>
          <p className="shrink">bottom nav here</p>
        </div>
      </footer>
    </>
  );
}
