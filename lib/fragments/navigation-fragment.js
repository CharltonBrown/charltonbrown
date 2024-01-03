import footerBlockFragment from '@/components/footer-block/fragment';

const navigationFragment = `
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
          motifId
        }
      }
    }
  }
  allProjectTypes {
    typeTitle
    id
    slug
  }
  aboutUsNavigation {
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
  footer {
    blocks {
      ${footerBlockFragment}
    }
  }
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

export default navigationFragment;
