import { defineQuery } from "next-sanity";

const BRANDS_QUERY = defineQuery(`*[_type=='brand'] | order(name asc) `);

const LATEST_BLOG_QUERY = defineQuery(
  ` *[_type == 'blog' && isLatest == true]|order(name asc){
      ...,
      blogcategories[]->{
      title
    }
    }`
);

const DEAL_PRODUCTS = defineQuery(
  `*[_type == 'product' && status == 'hot'] | order(name asc){
    ...,"categories": categories[]->title
  }`
);

const PRODUCT_BY_SLUG_QUERY = defineQuery(
  `*[_type == "product" && slug.current == $slug] | order(name asc) [0] {
    ...,
    "variant": variant->{
      title,
      value,
      description
    },
    "brand": brand->{
      title,
      description
    },
    "colorGroup": *[_type == "colorGroup" && references(^._id)][0] {
      _id,
      name,
      "products": products[]-> {
        _id,
        name,
        slug,
        images,
        stock
      }
    }
  }`
);

const REEL_BY_PRODUCT_SLUG_QUERY = defineQuery(
  `*[_type == "productReel" && product->slug.current == $slug][0] {
    _id,
    video {
      "url": asset->url
    }
  }`
);

const BRAND_QUERY = defineQuery(`*[_type == "product" && slug.current == $slug]{
  "brandName": brand->title
}`);

const MY_ORDERS_QUERY = defineQuery(`*[_type == 'order' && customer.clerkUserId == $userId] | order(createdAt desc) {
  ...,
  items[] {
    ...,
    product-> {
      _id,
      name,
      images,
      price,
      slug
    }
  }
}`);

const GET_ALL_BLOG = defineQuery(
  `*[_type == 'blog'] | order(publishedAt desc)[0...$quantity]{
  ...,  
     blogcategories[]->{
    title
}
    }
  `
);

const SINGLE_BLOG_QUERY = defineQuery(
  `*[_type == "blog" && slug.current == $slug][0]{
  ..., 
    author->{
    name,
    image,
  },
  blogcategories[]->{
    title,
    "slug": slug.current,
  },
}`
);

const BLOG_CATEGORIES = defineQuery(
  `*[_type == "blog"]{
     blogcategories[]->{
    ...
    }
  }`
);

const OTHERS_BLOG_QUERY = defineQuery(`*[
  _type == "blog"
  && defined(slug.current)
  && slug.current != $slug
]|order(publishedAt desc)[0...$quantity]{
...
  publishedAt,
  title,
  mainImage,
  slug,
  author->{
    name,
    image,
  },
  categories[]->{
    title,
    "slug": slug.current,
  }
}`);

const GET_USER_WISHLIST = defineQuery(`*[_type == "userWishlist" && userId == $userId][0] {
  ...,
  items[] {
    ...,
    product-> {
      _id,
      name,
      images,
    }
  }
}`);

const GET_USER_CART = defineQuery(
  `*[_type == "userCart" && clerkUserId == $userId][0]{
    _id,
    clerkUserId,
    items[] {
      _key,
      product->{
        _id,
        _type,
        name,
        slug,
        images,
        description,
        price,
        discount,
        categories,
        stock,
        brand,
        status,
        variant,
        isFeatured,
        hasSizes,
        sizes
      },
      quantity,
      size
    }
  }`);

const GET_USER_ADDRESSES = defineQuery(`*[_type == "userAddresses" && clerkUserId == $userId][0] {
  _id,
  _type,
  clerkUserId,
  addresses[] {
    _key,
    addressName,
    fullName,
    phoneNumber,
    addressLine1,
    addressLine2,
    city,
    state,
    pincode,
    isDefault
  }
}`);
export {
  BRANDS_QUERY,
  LATEST_BLOG_QUERY,
  DEAL_PRODUCTS,
  PRODUCT_BY_SLUG_QUERY,
  BRAND_QUERY,
  MY_ORDERS_QUERY,
  GET_ALL_BLOG,
  SINGLE_BLOG_QUERY,
  BLOG_CATEGORIES,
  OTHERS_BLOG_QUERY,
  REEL_BY_PRODUCT_SLUG_QUERY,
  GET_USER_WISHLIST,
  GET_USER_CART,
  GET_USER_ADDRESSES,
};