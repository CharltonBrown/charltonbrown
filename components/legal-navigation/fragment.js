const legalNavigationFragment = `
  legalNavigation {
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

export default legalNavigationFragment;
