"use client";

import { useDispatch, useSelector } from "react-redux";
import StoreHeader from "@/app/seller/components/store/StoreHeader";
import { useUpdateMyStoreMutation, useGetMyStoreQuery } from "@/redux/services/storeApi";
import StoreAppearance from "@/app/seller/components/store/StoreAppearance";
import StoreStory from "@/app/seller/components/store/StoreStory";
import StoreCategories from "@/app/seller/components/store/StoreCategories";
import BrandTheme from "@/app/seller/components/store/BrandTheme";
import StoreFooter from "@/app/seller/components/store/StoreFooter";
import { useRouter } from "next/navigation"
import { hydrateFromStore } from "@/redux/slices/storeSlice"
import { useEffect, useRef } from "react"

export default function StorePage() {
  const dispatch = useDispatch();
  const [updateStore] = useUpdateMyStoreMutation();
  const storeDraft = useSelector((s) => s.store);
  const router = useRouter()

  const videoFileRef = useRef(null);   // <-- add this
  const bannerFileRef = useRef(null);  // <-- add this

  const { data: store } = useGetMyStoreQuery();

  useEffect(() => {
    if (store) {
      dispatch(hydrateFromStore(store));
    }
  }, [store]);

  async function handleSave() {
    try {
      const payload = { ...storeDraft }; // copy everything from draft

      // start with existing media
      let media = storeDraft.bannerMedia ? [...storeDraft.bannerMedia] : [];

      // ----- handle banner upload -----
      if (bannerFileRef.current) {
        const bannerFile = bannerFileRef.current;
        const bannerRes = await uploadImageToCloudinary(bannerFile, "ags/stores/banners");

        // remove previous image if exists
        media = media.filter(m => m.type !== "image");

        media.push({ type: "image", url: bannerRes.secure_url });
      }

      // ----- handle video upload -----
      if (videoFileRef.current) {
        const videoFile = videoFileRef.current;
        const videoRes = await uploadVideoToCloudinary(videoFile, "ags/stores/videos");

        // remove previous video if exists
        media = media.filter(m => m.type !== "video");

        media.push({ type: "video", url: videoRes.secure_url, duration: videoRes.duration });
      }

      payload.bannerMedia = media;

      // story
      payload.highlights = storeDraft.storyImages.map(i => ({
        image: i.url,
        caption: "",
      }));

      const res = await updateStore(payload).unwrap();
      router.push(`/stores/${res.slug}`);

      alert("Store saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save store. See console for details.");
    }
}


  return (
    <div className="pb-[72px]">
      <StoreHeader />

      <StoreAppearance 
        videoFileRef={videoFileRef}
        bannerFileRef={bannerFileRef}
      />

      <StoreCategories />

      <StoreStory />

      <BrandTheme />

      <StoreFooter />

      {/* Sticky save */}
      <div
        className="fixed bottom-0 left-0 right-0 h-[56px]
        bg-[#F8F9FA] px-[16px]
        border-t border-black/20 flex items-center"
      >
        <button
          onClick={handleSave}
          className="w-full h-[40px] rounded-[4px]
          bg-[#005770] text-[#F8F9FA]
          font-inter font-semibold text-[16px]"
        >
          Save changes
        </button>
      </div>
    </div>
  );
}

async function uploadImageToCloudinary(file, folder = "ags/stores") {
  const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", "ags_unsigned_upload")
  formData.append("folder", folder)

  const res = await fetch(url, { method: "POST", body: formData })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message || "Image upload failed")
  }
  return res.json()
}

async function uploadVideoToCloudinary(file, folder = "ags/stores/videos") {
  const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", "ags_unsigned_upload")
  formData.append("folder", folder)

  const res = await fetch(url, { method: "POST", body: formData })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message || "Video upload failed")
  }
  return res.json()
}
