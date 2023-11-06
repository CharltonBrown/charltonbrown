import React from 'react';
import clsx from 'clsx';
import { StructuredText } from 'react-datocms';
import richTextStyles from './rich-text.module.css';

const RichText = ({ text, className }) => (
  <div className={clsx(richTextStyles.richText, className)}>
    <StructuredText data={text} />
  </div>
);

export default RichText;
