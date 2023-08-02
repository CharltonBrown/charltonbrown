const textImageBlockFragment = `
  textImageBlock {
    id
    body
    heading
    id
    imageAlignment
    image {
      responsiveImage(imgixParams: {fm: jpg, fit: crop, w: 1000, h: 1000 }) {
        ...responsiveImageFragment
      }
    }
  }
`;

export default textImageBlockFragment;
