/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true, // Disable the default image optimization API
  },
};

export default nextConfig;
