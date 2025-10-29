/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/ads.txt', // the path visitors hit
        destination: 'https://srv.adstxtmanager.com/19390/thetestifyai.com', // Ezoic Ads.txt Manager
        permanent: true, // 301 redirect
      },
    ];
  },
};

module.exports = nextConfig;
