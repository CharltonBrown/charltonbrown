const relatedFragment = `
  related {
    title
    url
    image {
      responsiveImage(imgixParams: {auto: format, w: 1500 }) {
        ...responsiveImageFragment
      }
    }
  }
`;

export default relatedFragment;
