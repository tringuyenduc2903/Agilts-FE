import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: process.env.NEXT_CLIENT_URL as string,
      lastModified: new Date(),
    },
    {
      url: `${process.env.NEXT_CLIENT_URL}/products/motor-cycle`,
      lastModified: new Date(),
    },
    {
      url: `${process.env.NEXT_CLIENT_URL}/products/square-parts`,
      lastModified: new Date(),
    },
    {
      url: `${process.env.NEXT_CLIENT_URL}/products/accessories`,
      lastModified: new Date(),
    },
    {
      url: `${process.env.NEXT_CLIENT_URL}/stores`,
      lastModified: new Date(),
    },
    {
      url: `${process.env.NEXT_CLIENT_URL}/our-services`,
      lastModified: new Date(),
    },
    {
      url: `${process.env.NEXT_CLIENT_URL}/contact-us`,
      lastModified: new Date(),
    },
    {
      url: `${process.env.NEXT_CLIENT_URL}/about-us`,
      lastModified: new Date(),
    },
  ];
}
