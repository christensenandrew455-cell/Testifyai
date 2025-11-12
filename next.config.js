/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep your redirects
  async redirects() {
    return [
      // You can add any future redirects here if needed
    ];
  },

  // 👇 Add these fixes for the missing SWC binary issue
  swcMinify: false, // disables SWC minifier
  experimental: {
    forceSwcTransforms: false, // skips SWC compilation if missing
  },
};

module.exports = nextConfig;
