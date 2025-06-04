import { type SchemaTypeDefinition } from "sanity";
import { categoryType } from "./categoryType";
import { blockContentType } from "./blockContentType";
import { productType } from "./productType";
import { orderType } from "./orderType";
import { addressType } from "./addressType";
import { orderItemType } from "./orderItemType";
import { brandType } from "./brandTypes";
import { blogType } from "./blogType";
import { blogCategoryType } from "./blogCategoryType";
import { authorType } from "./authorType";
import { productReelType } from "./productReelType";
import productVariantType from "./productVariantType";
import { statusUpdateType } from "./statusUpdateType";
import userCart from "../schemas/userCart";
import userWishlist from "../schemas/userWishlist";
import userAddress from "../schemas/userAddress";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    categoryType,
    blockContentType,
    productType,
    orderType,
    addressType,
    orderItemType,
    brandType,
    blogType,
    blogCategoryType,
    authorType,
    productReelType,
    productVariantType,
    statusUpdateType,
    userCart as SchemaTypeDefinition,
    userWishlist as SchemaTypeDefinition,
    userAddress as SchemaTypeDefinition,
  ],
};
