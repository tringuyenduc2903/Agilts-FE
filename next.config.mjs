/** @type {import('next').NextConfig} */
const nextConfig = {
  crossOrigin: 'anonymous',
  images: {
    deviceSizes: [380, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // limit of 25 imageSizes values
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // limit of 50 domains values (deprecated)
    // path: '/_next/image',
    // loader can be 'default', 'imgix', 'cloudinary', 'akamai', or 'custom'
    loader: 'default',
    // file with `export default function loader({src, width, quality})`
    loaderFile: '',
    // disable static imports for image files
    disableStaticImages: false,
    // minimumCacheTTL is in seconds, must be integer 0 or more
    minimumCacheTTL: 60,
    // ordered list of acceptable optimized image formats (mime types)
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    // set the Content-Security-Policy header
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // sets the Content-Disposition header (inline or attachment)
    contentDispositionType: 'inline',
    // limit of 50 objects
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_HOST_IMAGES,
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
    instrumentationHook: true,
  },
  async redirects() {
    return [
      {
        source: '/products',
        destination: '/products/motor-cycle',
        permanent: true,
      },
      {
        source: '/user/settings',
        destination: '/user/settings/password-and-security',
        permanent: true,
      },
      {
        source: '/user/account',
        destination: '/user/account/documents',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
