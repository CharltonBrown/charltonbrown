import React from 'react';
import converter from 'number-to-words';

import FadeInBlock from '@/components/fade-in-block';
import richTextStyles from '@/components/rich-text/rich-text.module.css';
import Container from '@/components/container';
import PlaceholderImage from '@/components/placeholder-image';

function Step({ body, title, count }) {
  return (
    <FadeInBlock>
      <Container>
        <article className="md:h-screen flex flex-col md:pt-[200px]">
          <div className="flex items-center mb-6">
            <span className="md:text-xl text-silver font-sans min-w-[40px] block md:pr-8">
              <span className="hidden md:inline">Stage</span> {count}
            </span>
            <h3 className="text-xl lg:text-2xl">{title}</h3>
          </div>
          <div className="flex flex-col md:flex-row pb-12">
            <div className="text-left grow">
              <div
                dangerouslySetInnerHTML={{
                  __html: body,
                }}
                className={richTextStyles.richText}
              />
            </div>
          </div>
        </article>
      </Container>
    </FadeInBlock>
  );
}

export default function ServiceBlock({
  title,
  intro,
  introHeading,
  steps,
  image,
}) {
  return (
    <section className="flex flex-col md:flex-row md:relative md:items-start even:md:flex-row-reverse">
      <div className="text-left md:sticky top-0 md:pt-[200px] md:w-7/12 md:h-screen">
        <PlaceholderImage
          className="md:w-full md:h-screen md:object-cover md:absolute inset-0"
          width={image.responsiveImage.width}
          height={image.responsiveImage.height}
          src={image.responsiveImage.src}
          alt={image.responsiveImage.alt}
        />
        <div className="hidden md:block absolute w-full h-[600px] top-0 bg-gradient-to-b from-black/90" />
        <Container>
          <h2 className="text-2xl lg:text-5xl md:text-white font-savoyBold relative">
            {title}
          </h2>
        </Container>
      </div>
      <ol className="md:w-5/12">
        <li>
          <FadeInBlock>
            <Container>
              <article className="md:h-screen flex flex-col md:pt-[200px]">
                <h3 className="text-3xl mb-8 lg:text-4xl font-savoyBold">
                  {introHeading}
                </h3>
                <div className="flex flex-col md:flex-row pb-12">
                  <div className="text-left grow">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: intro,
                      }}
                      className={richTextStyles.richText}
                    />
                  </div>
                </div>
              </article>
            </Container>
          </FadeInBlock>
        </li>
        {steps.map((step, index) => (
          <li key={step.id} className="mb-2 md:mb-24">
            <Step
              title={step.title}
              body={step.body}
              image={step.image}
              count={converter.toWords(index + 1)}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
