import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import clsx from 'clsx';

import fadeVariants from '@/components/fade-in-block/fadeVariants';

function Address({ text }) {
  return <div dangerouslySetInnerHTML={{ __html: text }} />;
}

function Email({ emailAddress }) {
  return <a href={`mailto:${emailAddress}`}>{emailAddress}</a>;
}

function Telephone({ telephoneNumber }) {
  return <a href={`tel:${telephoneNumber}`}>{telephoneNumber}</a>;
}

function ExternalLink({ url, text }) {
  return (
    <a href={url} target="_blank">
      {text}
    </a>
  );
}

export default function FooterBlock({ heading, body, className, index }) {
  return (
    <motion.div
      variants={fadeVariants}
      className={clsx(
        'flex flex-col justify-center text-sm md:text-xl pr-8',
        className,
      )}
    >
      <h2
        className={clsx(
          'border-t border-gallery text-gray text-lg pt-4 mb-4 md:mb-8',
          index === 0 && 'border-t-0 md:border-t',
        )}
      >
        {heading}
      </h2>
      {body.map((item) => {
        // eslint-disable-next-line no-underscore-dangle
        switch (item._modelApiKey) {
          case 'address':
            return (
              <div key={item.id}>
                <Address text={item.text} />
              </div>
            );
          case 'email':
            return (
              <div key={item.id}>
                <Email emailAddress={item.emailAddress} />
              </div>
            );
          case 'telephone':
            return (
              <div key={item.id}>
                <Telephone telephoneNumber={item.telephoneNumber} />
              </div>
            );
          case 'external_link':
            return (
              <div key={item.id}>
                <ExternalLink url={item.url} text={item.text} />
              </div>
            );
          case 'link':
            return (
              <div key={item.id}>
                <Link href={item.href}>{item.text}</Link>
              </div>
            );
          default:
            return null;
        }
      })}
    </motion.div>
  );
}
