const mainNavigationFragment = `
  mainNavigation {
    links {
      ... on ExternalLinkRecord {
        id
        text
        url
      }
      ... on LinkRecord {
        id
        href
        text
      }
    }
  }
`;

export default mainNavigationFragment;
