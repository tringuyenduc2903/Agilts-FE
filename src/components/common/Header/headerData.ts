type TranslateFunction = (key: string) => string;

export const generateRoutes = (t: TranslateFunction) => {
  return [
    {
      name: t('home'),
      link: '/',
      isLink: true,
      isDropdown: false,
      dropdownName: '',
      lineHeight: 32,
      dropdown: [],
    },
    {
      name: t('pages'),
      link: '',
      isLink: false,
      isDropdown: true,
      dropdownName: 'pages',
      lineHeight: 32,
      dropdown: [
        {
          link: 'about-us',
          name: t('about-us'),
          isLink: true,
          isDropdown: false,
          dropdown: [],
        },
        {
          link: 'our-services',
          name: t('our-services'),
          isLink: true,
          isDropdown: false,
          dropdown: [],
        },
        {
          link: 'contact-us',
          name: t('contact-us'),
          isLink: true,
          isDropdown: false,
          dropdown: [],
        },
      ],
    },
    {
      name: t('shop'),
      link: '/shop',
      isLink: true,
      lineHeight: 32,
      isDropdown: false,
      dropdown: [],
    },
  ];
};
