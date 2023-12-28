/**
 * @type {import('next').NextConfig}
 */
const withPWA = require('next-pwa')

// const nextConfig = {
//   reactStrictMode: false,
//   pwa: {
//     dest: 'public',
//     register: true,
//     skipWaiting: true,
//     disable: process.env.NODE_ENV === 'development',
//   },
// }

const nextConfig = {
  reactStrictMode: false,
  ...withPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
  }),
}

module.exports = nextConfig
