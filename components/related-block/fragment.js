const relatedFragment = `
  related {
    title
    url
    image {
      responsiveImage(imgixParams: {fm: jpg, w: 1500 }) {
        ...responsiveImageFragment
      }
    }
  }
`;

export default relatedFragment;
