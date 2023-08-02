const footerBlockFragment = `
  id
  heading
  body {
    ... on AddressRecord {
      id
      text(markdown: true)
      _modelApiKey
    }
    ... on EmailRecord {
      id
      emailAddress
      _modelApiKey
    }
    ... on ExternalLinkRecord {
      id
      text
      url
      _modelApiKey
    }
    ... on LinkRecord {
      id
      href
      text
      _modelApiKey
    }
    ... on TelephoneRecord {
      id
      telephoneNumber
      _modelApiKey
    }
  }
`;

export default footerBlockFragment;
