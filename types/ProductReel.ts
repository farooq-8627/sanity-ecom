import { Product } from "@/sanity.types";

export interface ProductReel {
  _id: string;
  video: {
    url: string;
  };
  product: {
    _id: string;
    name: string;
    description: string;
    images: {
      asset?: {
        _ref: string;
        _type: "reference";
        _weak?: boolean;
      };
      hotspot?: {
        x?: number;
        y?: number;
        height?: number;
        width?: number;
      };
      crop?: {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
      };
      _type: "image";
      _key: string;
    }[];
    stock: number;
    price: number;
    slug: {
      current: string;
    };
    discount?: number;
  };
  likes: number;
  views: number;
  comments: {
    _id: string;
    user: {
      name: string;
      image: string;
    };
    comment: string;
    createdAt: string;
  }[];
  shareCount: number;
  tags: string[];
} 