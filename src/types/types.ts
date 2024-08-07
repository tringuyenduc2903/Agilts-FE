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
  id: number | string;
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
  version: string;
  weight: string | null;
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
      key: string;
      value: string;
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
  reviewable_preview: {
    name: string;
  };
  updated_at: string;
};
export type Cart = ProductOption & {
  name: string;
  quantity: number;
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
