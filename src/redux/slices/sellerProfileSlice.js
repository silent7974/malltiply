import { createSlice } from "@reduxjs/toolkit";
import { sellerApi } from "../services/sellerApi";

const initialState = {
  id: null,
  fullName: "",
  email: "",
  phone: "",
  category: "",
  sellerType: "",
  notificationsEnabled: false,
  profileImage: null,
  profileImageFile: null, // for pending uploads on frontend
  location: { city: "Abuja", street: "", district: "" }, // ✅ add location
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const sellerProfileSlice = createSlice({
  name: "sellerProfile",
  initialState,
  reducers: {
    // client-only local updates
    setProfile(state, action) {
      Object.assign(state, action.payload);
    },
    updateProfilePicture(state, action) {
      state.profileImage = action.payload.previewUrl;
      state.profileImageFile = action.payload.file;
    },
    deleteProfilePicture(state) {
      state.profileImage = null;
      state.profileImageFile = null;
    },
    toggleNotification(state) {
      state.notificationsEnabled = !state.notificationsEnabled;
    },
    resetProfile: () => initialState, 
  },
  extraReducers: (builder) => {
    // ------------------------
    // GET PROFILE
    builder.addMatcher(
      sellerApi.endpoints.getProfile.matchPending,
      (state) => {
        state.status = "loading";
        state.error = null;
      }
    );
    builder.addMatcher(
      sellerApi.endpoints.getProfile.matchFulfilled,
      (state, { payload }) => {
        state.status = "succeeded";
        const p = payload || {};
        state.id = p._id || p.id || null;
        state.fullName = p.fullName || "";
        state.email = p.email || "";
        state.phone = p.phone || "";
        state.category = p.category || "";
        state.sellerType = p.sellerType || "";
        state.profileImage = p.profileImage ?? state.profileImage ?? null;
        state.notificationsEnabled =
          p.notificationsEnabled ?? state.notificationsEnabled;
        state.location = p.location
          ? {
              city: p.location.city || "Abuja",
              street: p.location.street || "",
              district: p.location.district || "",
            }
          : { city: "Abuja", street: "", district: "" };
        state.error = null;
      }
    );
    builder.addMatcher(
      sellerApi.endpoints.getProfile.matchRejected,
      (state, { error }) => {
        state.status = "failed";
        state.error = error?.message || "Failed to fetch profile";
      }
    );

    // ------------------------
    // UPDATE PROFILE
    builder.addMatcher(
      sellerApi.endpoints.updateProfile.matchPending,
      (state) => {
        state.status = "loading";
        state.error = null;
      }
    );
    builder.addMatcher(
      sellerApi.endpoints.updateProfile.matchFulfilled,
      (state, { payload }) => {
        state.status = "succeeded";
        const p = payload || {};
        state.id = p._id || p.id || state.id;
        state.fullName = p.fullName ?? state.fullName;
        state.email = p.email ?? state.email;
        state.phone = p.phone ?? state.phone;
        state.category = p.category ?? state.category;
        state.sellerType = p.sellerType ?? state.sellerType;
        state.profileImage = p.profileImage ?? state.profileImage;
        state.notificationsEnabled =
          p.notificationsEnabled ?? state.notificationsEnabled;
        state.location = p.location
          ? {
              city: p.location.city ?? state.location.city,
              street: p.location.street ?? state.location.street,
              district: p.location.district ?? state.location.district,
            }
          : state.location;
        state.error = null;
      }
    );
    builder.addMatcher(
      sellerApi.endpoints.updateProfile.matchRejected,
      (state, { error }) => {
        state.status = "failed";
        state.error = error?.message || "Failed to update profile";
      }
    );

    // ------------------------
    // DELETE ACCOUNT
    builder.addMatcher(
      sellerApi.endpoints.deleteAccount.matchPending,
      (state) => {
        state.status = "loading";
        state.error = null;
      }
    );
    builder.addMatcher(
      sellerApi.endpoints.deleteAccount.matchFulfilled,
      () => initialState
    );
    builder.addMatcher(
      sellerApi.endpoints.deleteAccount.matchRejected,
      (state, { error }) => {
        state.status = "failed";
        state.error = error?.message || "Failed to delete profile";
      }
    );
  },
});

export const {
  setProfile,
  updateProfilePicture,
  deleteProfilePicture,
  toggleNotification,
  resetProfile,
} = sellerProfileSlice.actions;

export default sellerProfileSlice.reducer