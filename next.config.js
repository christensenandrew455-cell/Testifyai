/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep your redirects here
  async redirects() {
    return [
      // Add any future redirects if needed
    ];
  },

  // Disable SWC minifier to avoid missing binary errors
  swcMinify: false,

  // Experimental: skip SWC compilation if binaries are missing
  experimental: {
    forceSwcTransforms: false,
  },
};

module.exports = nextConfig;
