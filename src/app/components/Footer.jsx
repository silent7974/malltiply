import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <>
        {/* Footer Section */}
        <div>
          {/* Dropdown Sections */}
          <div className="text-black font-[montserrat] font-medium text-[12px] mt-[16px]">
            {/* Company Info */}
            <details className="group border-b border-black/10 cursor-pointer">
              <summary className="flex justify-between w-full px-[16px] h-[36px] items-center font-medium">
                About
                <svg
                  className="w-[12px] h-[12px] text-black/50 group-open:rotate-180 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <ul className="bg-[#F2F2F2] px-[16px] py-[8px] space-y-[8px] font-[inter] font-normal text-[12px] text-black">
                <li>
                  Malltiply is a marketplace for fashion products from verified local sellers in Abuja.
                </li>
              </ul>
            </details>

            {/* Customer Service */}
            <details className="group border-b border-black/10 cursor-pointer">
              <summary className="flex w-full px-[16px] h-[36px] justify-between items-center font-medium">
                Support
                <svg
                  className="w-[12px] h-[12px] text-black/50 group-open:rotate-180 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <ul className="bg-[#F2F2F2] px-[16px] py-[8px] space-y-[8px] font-[inter] font-normal text-[12px] text-black">
                <li>How ordering works</li>
                <li>Returns & refunds</li>
                <li>Shipping within Abuja</li>
                <li>Contact support</li>
              </ul>
            </details>

            <details className="group border-b border-black/10 cursor-pointer">
              <summary className="flex w-full px-[16px] h-[36px] justify-between items-center font-medium">
                Sellers
                <svg
                  className="w-[12px] h-[12px] text-black/50 group-open:rotate-180 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <ul className="bg-[#F2F2F2] px-[16px] py-[8px] space-y-[8px] font-[inter] font-normal text-[12px] text-black">
                <li>Sell on Malltiply</li>
                <li>Seller guidelines</li>
              </ul>
            </details>

            <details className="group border-b border-black/10 cursor-pointer">
              <summary className="flex w-full px-[16px] h-[36px] justify-between items-center font-medium">
                Legal
                <svg
                  className="w-[12px] h-[12px] text-black/50 group-open:rotate-180 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <ul className="bg-[#F2F2F2] px-[16px] py-[8px] space-y-[8px] font-[inter] font-normal text-[12px] text-black">
                <li>Terms of use</li>
                <li>Privacy policy</li>
              </ul>
            </details>
          </div>

          {/* Second part of footer */}
          <div className="bg-[#EEEEEE] py-[16px]">
            <div className="flex justify-center items-center gap-[48px]">
              <Image src="/instagram.svg" alt="Instagram" width={16} height={16} />
              <Image src="/twitter.svg" alt="Twitter" width={16} height={16} />
              <Image src="/tiktok.svg" alt="TikTok" width={16} height={16} />
            </div>

            <div className="font-[inter] text-[12px] font-light text-[#7B7979] text-center mt-[24px]">
              <p>© 2025 Aliki Global Services™ </p>
              <div className="mt-[24px] font-normal text-black/40 space-x-[24px]">
              Malltiply is operated by Aliki Global Services
              </div>
            </div>

          </div>
        </div>
    </>
  );
}