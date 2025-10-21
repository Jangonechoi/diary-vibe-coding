/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_GRAPHQL_ENDPOINT:
      process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ||
      "https://main-practice.codebootcamp.co.kr/graphql",
  },
};

export default nextConfig;
