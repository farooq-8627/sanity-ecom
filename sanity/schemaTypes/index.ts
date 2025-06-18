import { type SchemaTypeDefinition } from "sanity";
import { categoryType } from "./categoryType";
import { blockContentType } from "./blockContentType";
import { productType } from "./productType";
import { orderType } from "./orderType";
import { orderItemType } from "./orderItemType";
import { brandType } from "./brandTypes";
import { blogType } from "./blogType";
import { blogCategoryType } from "./blogCategoryType";
import { authorType } from "./authorType";
import { addressType } from "./addressType";
import { productReelType } from "./productReelType";
import productVariantType from "./productVariantType";
import userAddresses from "../schemas/userAddress";
import { couponType } from "./couponType";
import userCart from "../schemas/userCart";
import userWishlist from "../schemas/userWishlist";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    categoryType,
    blockContentType,
    productType,
    orderType,
    orderItemType,
    brandType,
    blogType,
    blogCategoryType,
    authorType,
    addressType,
    productReelType,
    productVariantType,
    userAddresses as SchemaTypeDefinition,
    userCart as SchemaTypeDefinition,
    userWishlist as SchemaTypeDefinition,
    couponType,
  ],
};
