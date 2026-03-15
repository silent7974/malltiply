import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  city: { type: String, default: "Abuja" },
  street: { type: String },
  district: { type: String },
});

const SellerSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    passwordHash: { type: String, required: true },
    category: { type: String, required: true },

    profileImage: {
      type: String,
      default: "",
    },

    location: {
      type: AddressSchema,
      required: true,
    },


    notificationsEnabled: {
      type: Boolean,
      default: false,
    },

    sellerType: {
      type: String,
      enum: ["normal_seller", "premium_seller"],
      default: "normal_seller",
    },

    resetPasswordToken: String,
    resetPasswordExpires: Date,


    // premium-only references
    storeSlug: String,
    brandName: String,
  },
  { timestamps: true }
);

export default mongoose.models.Seller || mongoose.model("Seller", SellerSchema);