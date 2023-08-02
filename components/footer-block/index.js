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

export default function FooterBlock({ heading, body, className }) {
  return (
    <motion.div
      variants={fadeVariants}
      className={clsx('flex flex-col justify-center text-xl pr-8', className)}
    >
      <h2 className="border-t border-gallery text-gray text-lg pt-4 mb-8">
        {heading}
      </h2>
      {body.map((item) => {
        // eslint-disable-next-line no-underscore-dangle
        switch (item._modelApiKey) {
          case 'address':
            return (
              <div>
                <Address text={item.text} />
              </div>
            );
          case 'email':
            return (
              <div>
                <Email emailAddress={item.emailAddress} />
              </div>
            );
          case 'telephone':
            return (
              <div>
                <Telephone telephoneNumber={item.telephoneNumber} />
              </div>
            );
          case 'external_link':
            return (
              <div>
                <ExternalLink url={item.url} text={item.text} />
              </div>
            );
          case 'link':
            return (
              <div>
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
