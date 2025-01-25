/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // Use standalone for dynamic pages with export
  images: {
    unoptimized: true, // Disable the default image optimization API
  },
};

export default nextConfig;
