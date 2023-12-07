const globalSeo = `
  _site {
    favicon {
      url
    }
    faviconMetaTags(variants: appleTouchIcon) {
      attributes
      content
      tag
    }
    globalSeo {
      fallbackSeo {
        description
        title
      }
      titleSuffix
    }
  }
`;

export default globalSeo;
