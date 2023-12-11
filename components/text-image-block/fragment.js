const textImageBlockFragment = `
  textImageBlock {
    id
    body
    heading
    id
    imageAlignment
    image {
      responsiveImage(imgixParams: {auto: format, fit: crop, w: 1000, h: 1000 }) {
        ...responsiveImageFragment
      }
    }
  }
`;

export default textImageBlockFragment;
