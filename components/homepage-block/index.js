import React from 'react';

import Container from '@/components/container';
import FadeInBlock from '@/components/fade-in-block';
import FootnoteOne from '@/components/icons/footnotes/footnote-1';

const HomepageBlock = ({ children, includeFootnote }) => {
  const inner = React.Children.map(children, (child) =>
    child.type.displayName === 'Inner' ? child : null,
  );

  return (
    <div className="relative md:h-screen flex items-center justify-center py-8 mb-24 md:mb-0">
      <Container>
        <FadeInBlock className="mb-24 mb-24 md:mb-0">{inner}</FadeInBlock>
        {includeFootnote && (
          <div className="absolute bottom-0 w-full h-[21px] inset-x-0">
            <FadeInBlock>
              <FootnoteOne className="w-4 h-[21px] mx-auto" />
            </FadeInBlock>
          </div>
        )}
      </Container>
    </div>
  );
};

const Inner = ({ children }) => (
  <div className="max-w-3xl mx-auto py-8 md:px-7 lg:px-10 text-left md:text-center">
    {children}
  </div>
);

Inner.displayName = 'Inner';
HomepageBlock.Inner = Inner;

export default HomepageBlock;
