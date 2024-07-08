import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: process.env.NEXT_CLIENT_URL as string,
      lastModified: new Date(),
      alternates: {
        languages: {
          vi: `${process.env.NEXT_CLIENT_URL}/vi`,
          en: `${process.env.NEXT_CLIENT_URL}/en`,
        },
      },
    },
    {
      url: `${process.env.NEXT_CLIENT_URL}/products`,
      lastModified: new Date(),
      alternates: {
        languages: {
          vi: `${process.env.NEXT_CLIENT_URL}/vi/products`,
          en: `${process.env.NEXT_CLIENT_URL}/en/products`,
        },
      },
    },
    {
      url: `${process.env.NEXT_CLIENT_URL}/stores`,
      lastModified: new Date(),
      alternates: {
        languages: {
          vi: `${process.env.NEXT_CLIENT_URL}/vi/stores`,
          en: `${process.env.NEXT_CLIENT_URL}/en/stores`,
        },
      },
    },
    {
      url: `${process.env.NEXT_CLIENT_URL}/our-services`,
      lastModified: new Date(),
      alternates: {
        languages: {
          vi: `${process.env.NEXT_CLIENT_URL}/vi/our-services`,
          en: `${process.env.NEXT_CLIENT_URL}/en/our-services`,
        },
      },
    },
    {
      url: `${process.env.NEXT_CLIENT_URL}/contact-us`,
      lastModified: new Date(),
      alternates: {
        languages: {
          vi: `${process.env.NEXT_CLIENT_URL}/vi/contact-us`,
          en: `${process.env.NEXT_CLIENT_URL}/en/contact-us`,
        },
      },
    },
    {
      url: `${process.env.NEXT_CLIENT_URL}/about-us`,
      lastModified: new Date(),
      alternates: {
        languages: {
          vi: `${process.env.NEXT_CLIENT_URL}/vi/about-us`,
          en: `${process.env.NEXT_CLIENT_URL}/en/about-us`,
        },
      },
    },
  ];
}
