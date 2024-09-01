import { ReactElement } from 'react';
export type Params = {
  id: string;
  locale: string;
};
export type Login = {
  email: string;
  password: string;
  remember: boolean;
};
export type Register = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};
export type User = {
  id: string | number;
  name: string;
  birthday: string;
  gender: 0 | 1 | 2;
  gender_preview: string;
  email: string;
  email_verified_at: string;
  phone_number: string;
  phone_number_verified_at: string;
  two_factor_confirmed_at: string;
  deleted_at: string;
  created_at: string;
  updated_at: string;
  two_factor?: boolean;
};

export type Address = {
  id: number;
  country: string;
  province: string;
  district: string;
  ward: string;
  address_detail: string;
  address_preview: string;
  type: number;
  type_preview: string;
  default: boolean;
  created_at: string;
  updated_at: string;
};

export type Branch = {
  id: number | string;
  name: string;
  image: SingleImage;
  phone_number: number | string;
  address: Address;
  deleted_at: string;
  created_at: string;
  updated_at: string;
};

export type Document = {
  id: number;
  type: number;
  type_preview: string;
  number: number;
  issued_name: string;
  issuance_date: string;
  expiry_date: string;
  default: boolean;
  customer_id: number;
  created_at: string;
  updated_at: string;
};

export type Social = {
  [key: string]: {
    name: string;
    element: ReactElement;
  };
};
export type SocialProvider = {
  id: number;
  customer_id: number;
  provider_id: number;
  provider_name: string;
  created_at: string;
  updated_at: string;
};
type KeyObject = {
  [key: string]: string;
};
export type ProductFilter = {
  name: string;
  label: string;
  data: string | number | KeyObject;
};
export type SingleImage = {
  image: string;
  alt: string;
};
export type ProductOption = {
  color: string;
  created_at: string;
  id: number;
  images: SingleImage[];
  price: {
    raw: number;
    preview: string;
  };
  value_added_tax: number;
  product_id: string | number;
  quantity: number;
  sku: string;
  specifications: [
    {
      key: string;
      value: string;
    }
  ];
  status: string;
  type: string;
  updated_at: string;
  version: string | null;
  volume?: string | number | null;
  width?: string | number | null;
  weight?: string | number | null;
  length?: string | number | null;
  height?: string | number | null;
};
export type Product = {
  id: number;
  name: string;
  search_url: string;
  description: string;
  must_direct_purchase: boolean;
  manufacturer: string;
  options_min_price: {
    raw: number;
    preview: string;
  };
  options_max_price: {
    raw: number;
    preview: string;
  };
  images: SingleImage[];
  videos: [
    {
      image: string;
      title: string;
      description: string;
      video: {
        provider: string;
        id: string;
        url: string;
      };
    }
  ];
  options: ProductOption[];
  reviews_avg_rate: string;
  reviews_count: number | string;
  categories: [
    {
      id: number;
      name: string;
      pivot: {
        product_id: number;
        category_id: number;
      };
      deleted_at: string;
      created_at: string;
      updated_at: string;
    }
  ];
  enabled: boolean;
  visibility: string;
  type: string;
  status: string;
  specifications: [
    {
      title: string;
      description: string;
    }
  ];
  deleted_at: string;
  created_at: string;
  updated_at: string;
  seo: {
    id: number;
    title: string;
    description: string;
    image: string;
    author: any;
    robots: any;
    created_at: string;
    updated_at: string;
  };
};

export type Review = {
  id: number | string;
  content: string;
  created_at: string;
  images: SingleImage[] | [];
  rate: number;
  response: {
    id: number;
    content: string;
    created_at: string;
    images: string[] | [];
    rate: number | null;
    updated_at: string;
    reviewable_preview: {
      name: string;
    };
  } | null;
  parent_preview: {
    search_url: string;
    name: string;
    option_id: number;
    sku: string;
    color: string | null;
    version: string | null;
    volume: string | null;
  };
  reviewable_preview: {
    name: string;
  };
  updated_at: string;
};
export type Cart = {
  id: number;
  customer_id: number;
  amount: number;
  option_id: number;
  option: ProductOption & {
    product: Product;
  };
  created_at: string;
  updated_at: string;
};
export type Wishlist = {
  id: number;
  product_preview: {
    id: number;
    name: string;
    option_id: number;
    sku: string;
    color: string;
    categories: string[];
    images: SingleImage[];
  };
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: 1;
  address?: {
    address_detail: string;
    address_preview: string;
    country: string;
    created_at: string;
    default: boolean;
    deleted_at: string | null;
    district: string;
    id: number;
    province: string;
    type: number;
    updated_at: string;
    ward: string;
  };
  identification?: {
    created_at: string;
    customer_id: number;
    default: boolean;
    deleted_at: string | null;
    expiry_date: string;
    id: number;
    issuance_date: string;
    issued_name: string;
    number: string;
    type: number;
    type_preview: string;
    updated_at: string;
  };
  tax: {
    raw: number;
    preview: string;
  };
  shipping_fee: {
    raw: number;
    preview: string;
  };
  handling_fee: {
    raw: number;
    preview: string;
  };
  other_fees: {
    vehicle_registration_support_fee: {
      raw: number;
      preview: string;
    };
    registration_fee: {
      raw: number;
      preview: string;
    };
    license_plate_registration_fee: {
      raw: number;
      preview: string;
    };
  };
  total: {
    raw: number;
    preview: string;
  };
  status: string;
  note: string;
  shipping_type: string;
  transaction_type: string;
  other_fields: {
    vehicle_registration_support: boolean;
    registration_option?: string;
    license_plate_registration_option?: string;
  };
  address_id?: number;
  identification_id?: number;
  customer_id: number;
  invoice_products: [
    {
      id: number;
      price: {
        raw: number;
        preview: string;
      };
      value_added_tax: number;
      amount: number;
      invoice_id: number;
      option: ProductOption & {
        value_added_tax: number;
        product: Product;
      };
      vehicle_id: number | null;
      created_at: string;
      updated_at: string;
    }
  ];
  created_at: string;
  updated_at: string;
};

export type BannerPage = {
  id: number;
  key: string;
  name: string;
  value:
    | [
        {
          image: SingleImage;
          subtitle: string;
          title: string;
          description: string;
          page_name: string;
          banner_description: string;
          actions: {
            title: string;
            link: string;
          };
        }
      ]
    | boolean
    | number;
};
export type FooterTime = {
  title: string;
  description: string;
};
export type FooterBranch = {
  name: string;
  phone_number: string;
  image: SingleImage | null;
  address: {
    country: string;
    province: string;
    district: string;
    ward: string;
    address_detail: string;
    address_preview: string;
  };
};
export type FooterService = {
  title: string;
  link: string;
};
export type FooterPage = {
  id: number;
  key: string;
  name: string;
  value: string | FooterTime[] | FooterBranch | FooterService[];
  active: boolean;
  created_at: string;
  updated_at: string;
};
