/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    authToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNjQ1NTczNTM0LCJleHAiOjE2NDgxNjU1MzR9.3gFpWTz4Y_ga-E1dqGvIhv5de6WfKJr36qPUP3U0AII",
    userApiId: "135",
  },
};

module.exports = nextConfig;
