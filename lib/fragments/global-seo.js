const globalSeo = `
  site: _site {
    favicon: faviconMetaTags {
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
