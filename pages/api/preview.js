// eslint-disable-next-line consistent-return
const preview = async (req, res) => {
  // Please set the CMS_DATOCMS_PREVIEW_SECRET env variable
  // on Vercel/Netlify, or everyone will be able to enter Preview Mode and
  // see draft content!

  const secret = 'hampstead';

  // Check the secret and next parameters
  if (secret && req.query.secret !== secret) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({});

  // Redirect to homepage
  res.writeHead(307, { Location: '/' });
  res.end();
};

export default preview;
