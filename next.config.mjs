/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
console.log(backendUrl);
const withNextIntl = createNextIntlPlugin();
const cspHeader = `
    default-src 'self';
    script-src 'self' ${backendUrl} 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;
const nextConfig = {
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
