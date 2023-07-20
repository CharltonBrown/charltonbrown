import React from 'react';
import { StructuredText } from 'react-datocms';
import richTextStyles from './rich-text.module.css';

const RichText = ({ text }) => (
  <div className={richTextStyles.richText}>
    <StructuredText data={text} />
  </div>
);

export default RichText;
