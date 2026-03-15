"use client";

import { useRouter } from "next/navigation";

export default function FirstTimeDashboard() {
  const router = useRouter();

  return (
    <div className="py-4">
      {/* Top Titles */}
      <div>
        <h1 className="text-[20px] font-medium font-montserrat text-black">
          Your Dashboard
        </h1>
        <p className="text-[16px] font-medium font-montserrat text-black/50 mt-1">
          Manage your products and settings here.
        </p>
      </div>

      {/* Honest placeholder */}
      <div className="max-w-[320px] w-full h-[240px] mt-[24px] rounded-[16px] bg-[#E8F0F1] px-[8px] flex flex-col items-center justify-center text-center mx-auto border border-[#005770]/10">
        <h2 className="text-[22px] font-semibold font-montserrat text-black/50">
          Dashboard will show your stats here
        </h2>
        <p className="mt-4 text-[14px] font-inter text-black/40">
          Stats and analytics will be available in v1
        </p>
      </div>

      {/* Honest limitation */}
      <p className="mt-4 text-[12px] font-inter text-black/50 text-center">
        Store pages are available on the Premium plan.
      </p>

      {/* Action Cards */}
      <div
        className="flex overflow-x-auto mt-[56px] space-x-[8px] px-1 pb-2 snap-x snap-mandatory scroll-smooth scrollbar-hide"
      >
        {/* Upload Product */}
        <button
          className="w-[301px] h-[236px] rounded-[16px] bg-[#7B00C3] flex-shrink-0 flex flex-col items-center snap-start"
          onClick={() =>
            router.push("/seller/normal/dashboard/products/form")
          }
        >
          <img
            src="/upload-illustration.svg"
            alt="Upload"
            className="w-[140px] mt-9"
          />
          <p className="mt-3.5 text-[20px] font-semibold font-inter text-white text-center">
            Upload a product
          </p>
        </button>

        {/* Profile Settings */}
        <button
          className="w-[301px] h-[236px] rounded-[16px] bg-[#2A9CBC] flex-shrink-0 flex flex-col items-center snap-start"
          onClick={() =>
            router.push("/seller/normal/dashboard/settings")
          }
        >
          <img
            src="/profile-illustration.svg"
            alt="Profile"
            className="w-[140px] mt-9"
          />
          <p className="mt-3.5 text-[20px] font-semibold font-inter text-white text-center">
            Complete profile settings
          </p>
        </button>
      </div>

      {/* Help */}
      <div className="mt-[56px] space-y-[16px]">
        <h3 className="text-[20px] font-semibold text-center font-inter text-black">
          Need help getting started?
        </h3>
        <p className="text-[12px] text-center font-medium font-inter text-black/70">
          View guides and common questions.
        </p>
        <div className="flex justify-center">
          <button
            className="bg-[#005770] text-white rounded-[4px] px-3 py-2 text-[12px] font-semibold font-inter"
            onClick={() =>
              router.push("/seller/normal/dashboard/help")
            }
          >
            Visit Help Center
          </button>
        </div>
      </div>
    </div>
  );
}