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
import { userAddressType } from "./userAddressType";
import { couponType } from "./couponType";
import { userCartType } from "./userCartType";
import { userWishlistType } from "./userWishlistType";
import { colorGroupType } from "./colorGroup";

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
    userAddressType,
    userWishlistType,
    userCartType,
    couponType,
    colorGroupType,
  ],
};
