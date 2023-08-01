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
        motif {
          svg {
            url
          }
        }
      }
    }
  }
`;

export default mainNavigationFragment;
