/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Standard Next.js SSR mode for Vercel
  // Production optimizations
  productionBrowserSourceMaps: false,
  compress: true,

  // Image optimization - using unoptimized for Amplify compatibility
  images: {
    unoptimized: true,
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        moduleIds: "deterministic",
        runtimeChunk: "single",
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk
            vendor: {
              name: "vendor",
              chunks: "all",
              test: /node_modules/,
              priority: 20,
            },
            // Common chunk
            common: {
              name: "common",
              minChunks: 2,
              chunks: "all",
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
            // UI components
            ui: {
              name: "ui",
              test: /[\\/]src[\\/]components[\\/]ui[\\/]/,
              chunks: "all",
              priority: 15,
            },
            // Chart libraries (heavy)
            charts: {
              name: "charts",
              test: /[\\/]node_modules[\\/](recharts|d3)/,
              chunks: "all",
              priority: 25,
            },
          },
        },
      };
    }

    // Tree shaking
    // config.optimization.usedExports = true;

    return config;
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  },

  // Experimental features for performance
  experimental: {
    optimizeCss: false,
    optimizePackageImports: [
      "recharts",
      "lucide-react",
      "@radix-ui/react-icons",
    ],
    // turbopack: {}, // Empty config to silence Turbopack/webpack conflict in Next.js 16
  },

  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Ignore build errors for rapid deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
