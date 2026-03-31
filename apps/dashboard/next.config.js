const nextConfig = {
  transpilePackages: ["@ecom/ui", "@ecom/utils", "@ecom/database"],
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "prisma"],
  },
  outputFileTracingIncludes: {
    "/*": ["./node_modules/.prisma/client/**/*"],
  },
};
module.exports = nextConfig;
