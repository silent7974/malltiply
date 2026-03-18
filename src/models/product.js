import mongoose from "mongoose";

const VariantColumnSchema = new mongoose.Schema(
  {
    color: String,
    quantity: Number,
    price: Number,
    sku: String,
  },
  { _id: false, strict: false }
);

const ProductSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      index: true,
    },

    // 🔗 STORE CONNECTION
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      index: true,
    },

    productName: String,
    description: String,
    quantity: Number,
    price: Number,
    category: String,
    subCategory: String,
    subType: String,
    sku: String,
    slug: { type: String, unique: true, index: true },

    variants: {
      color: String,
      size: String,
      measurement: String,
    },

    images: [
      {
        url: String,
        public_id: String,
      },
    ],

    adVideo: {
      url: String,
      public_id: String,
      duration: Number,
      width: Number,
      height: Number,
    },

    variantColumns: [VariantColumnSchema],
  },
  { timestamps: true, strict: false }
);

// 🔍 SEARCH INDEX
ProductSchema.index({
  productName: "text",
  description: "text",
  category: "text",
  subCategory: "text",
  subType: "text",
  "variants.color": "text",
  "variants.size": "text",
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);