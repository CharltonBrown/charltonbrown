/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'www.datocms-assets.com',
      'images.yapily.com',
      'countryflagsapi.com',
    ],
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
};

module.exports = nextConfig;
