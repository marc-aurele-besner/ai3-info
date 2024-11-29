/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["three"],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    // Enable WebAssembly experiments
    config.experiments = { ...config.experiments, asyncWebAssembly: true };

    return config;
  },
};

export default nextConfig;
