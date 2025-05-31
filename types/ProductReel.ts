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
      url: string;
    }[];
    stock: number;
    price: number;
    slug: {
      current: string;
    };
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