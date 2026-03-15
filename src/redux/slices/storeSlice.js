import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // media previews
  videoPreviewUrl: null,
  videoMuted: true,
  bannerPreviewUrl: null,

  // story
  storyHeadline: "",
  storyDescription: "",
  storyImages: [],

  // categories
  categories: {
    suggested: [],
    fromProducts: [],
  },

  // 🎨 brand theme
  brandColor: "#000000",

  // 🧾 footer
  storeTagline: "",
  socials: {
    instagram: "",
    tiktok: "",
    twitter: "",
  },

  // meta
  hasUnsavedChanges: false,
};

const storeSlice = createSlice({
  name: "storeBuilder",
  initialState,
  reducers: {
  setVideo(state, action) {
    state.videoPreviewUrl = {
      url: action.payload.previewUrl,
    };
    state.videoMuted = true;
    state.hasUnsavedChanges = true;
  },

    removeVideo(state) {
      state.videoPreviewUrl = null;
      state.videoMuted = true;
      state.hasUnsavedChanges = true;
    },

    toggleVideoMute(state) {
      state.videoMuted = !state.videoMuted;
    },

    setBanner(state, action) {
      state.bannerPreviewUrl = {
        url: action.payload.previewUrl,
      };
      state.hasUnsavedChanges = true;
    },

    removeBanner(state) {
      state.bannerPreviewUrl = null;
      state.hasUnsavedChanges = true;
    },

    setStoryHeadline(state, action) {
      state.storyHeadline = action.payload.slice(0, 60);
      state.hasUnsavedChanges = true;
    },

    setStoryDescription(state, action) {
      state.storyDescription = action.payload.slice(0, 160);
      state.hasUnsavedChanges = true;
    },

    addStoryImage(state, action) {
      if (state.storyImages.length < 3) {
        state.storyImages.push({ url: action.payload });
        state.hasUnsavedChanges = true;
      }
    },

    removeStoryImage(state, action) {
      state.storyImages.splice(action.payload, 1);
      state.hasUnsavedChanges = true;
    },

    setStoreCategories(state, action) {
      state.categories = action.payload;
      state.hasUnsavedChanges = true;
    },

    setBrandColor(state, action) {
      state.brandColor = action.payload;
      state.hasUnsavedChanges = true;
    },

    setStoreTagline(state, action) {
      state.storeTagline = action.payload.slice(0, 60);
      state.hasUnsavedChanges = true;
    },

    setSocial(state, action) {
      const { platform, value } = action.payload;
      state.socials[platform] = value;
      state.hasUnsavedChanges = true;
    },

    hydrateFromStore(state, action) {
      const store = action.payload;

      // appearance
      state.videoMuted = store.videoMuted ?? true;
      state.bannerPreviewUrl = store.bannerMedia?.find(m => m.type === "image")
      ? { url: store.bannerMedia.find(m => m.type === "image").url }
      : null;

      state.videoPreviewUrl = store.bannerMedia?.find(m => m.type === "video")
        ? { url: store.bannerMedia.find(m => m.type === "video").url }
        : null;

      state.bannerMedia = store.bannerMedia || [];

      // story
      state.storyHeadline = store.storyHeadline || "";
      state.storyDescription = store.storyDescription || "";
      state.storyImages = store.highlights?.map(h => ({ url: h.image })) || [];

      // categories (reverse flatten)
      state.categories = {
        suggested: store.categories?.slice(0, 2) || [],
        fromProducts: store.categories?.slice(2) || [],
      };

      // theme
      state.brandColor = store.brandColor || "#000000";

      // footer
      state.storeTagline = store.storeTagline || "";
      state.socials = store.socials || {};

      state.hasUnsavedChanges = false;
    },

    resetDraft() {
      return initialState;
    },
  },
});

export const {
  setVideo,
  removeVideo,
  toggleVideoMute,
  setBanner,
  removeBanner,

  setStoryHeadline,
  setStoryDescription,
  addStoryImage,
  removeStoryImage,

  setStoreCategories,
  setBrandColor,
  resetDraft,

  setStoreTagline,
  setSocial,

  hydrateFromStore
  
} = storeSlice.actions;

export default storeSlice.reducer