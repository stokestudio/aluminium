import React from 'react';

const sizes = { '1x': '', '2x': '@2x', '3x': '@3x' };
const srcSet = src => {
  const splitAt = src.lastIndexOf('.');
  const srcParts = [src.substring(0, splitAt), src.substring(splitAt)];
  const srcForSize = size => srcParts.join(sizes[size]);
  return Object
    .keys(sizes)
    .map(size => `${srcForSize(size)} ${size}`)
    .join(', ');
};

const Image = props => (
  // eslint-disable-next-line jsx-a11y/img-has-alt
  <img {...props} srcSet={srcSet(props.src)}  />
);

export default Image;
