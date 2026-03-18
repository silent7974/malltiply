import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import InfoModal from "./InfoModal";

export default function Footer() {
  const [modal, setModal] = useState(null)

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
                  Malltiply is a marketplace for fashion products from verified local sellers in Abuja. Shop more directly from trusted sellers.
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
                <li onClick={() => setModal("ordering")}>
                  How ordering works
                </li>
                <li onClick={() => setModal("refunds")}>
                  Returns & refunds
                </li>
                <li onClick={() => setModal("shipping")}>
                  Shipping within Abuja
                </li>
                <li onClick={() => setModal("support")}>
                  Contact support
                </li>
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
                <li onClick={() => setModal("guidelines")}>
                  Seller guidelines
                </li>
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
                <li onClick={() => setModal("terms")}>
                  Terms of use
                </li>
                <li onClick={() => setModal("privacy")}>
                  Privacy policy
                </li>
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

        {modal === "refunds" && (
          <InfoModal title="Returns & refunds" onClose={() => setModal(null)}>
            <p className="text-[13px] font-inter text-black mb-3">
              Items can be returned within 24 hours after delivery if they are damaged,
              incorrect, or significantly different from the listing.
            </p>

            <p className="text-[13px] font-inter text-black mb-3">
              Refunds are processed after the seller confirms the returned item.
            </p>

            <p className="text-[13px] font-inter text-black">
              Approved refunds are sent to the bank account provided during the refund request.
            </p>
          </InfoModal>
        )}

        {modal === "ordering" && (
          <InfoModal title="How ordering works" onClose={() => setModal(null)}>
            <p className="text-[13px] font-inter text-black mb-3">
              Browse products with true sizing from local sellers on Malltiply and place your order securely.
            </p>

            <p className="text-[13px] font-inter text-black mb-3">
              After payment, the seller prepares your order and delivery is arranged within Abuja.
            </p>

            <p className="text-[13px] font-inter text-black">
              You will be able to track and receive updates as your order moves from confirmation to delivery.
            </p>
          </InfoModal>
        )}

        {modal === "shipping" && (
          <InfoModal title="Shipping within Abuja" onClose={() => setModal(null)}>
            <p className="text-[13px] font-inter text-black mb-3">
              Malltiply currently delivers within Abuja.
            </p>

            <p className="text-[13px] font-inter text-black mb-3">
              Delivery time is guaranteed within 24 hours, anything below depends on the seller’s processing time and the delivery location
            </p>

            <p className="text-[13px] font-inter text-black">
              You're able to track your order until it reaches your destination
            </p>
          </InfoModal>
        )}

        {modal === "support" && (
          <InfoModal title="Contact support" onClose={() => setModal(null)}>
            <p className="text-[13px] font-inter text-black mb-3">
              Need help with an order or product?
            </p>

            <p className="text-[13px] font-inter text-black mb-3">
              Our support team is available on WhatsApp to assist you with any issues.
            </p>

            <p className="text-[13px] font-inter text-black">
              Tap the WhatsApp support option to start a conversation.
            </p>
          </InfoModal>
        )}

        {modal === "guidelines" && (
          <InfoModal title="Seller guidelines" onClose={() => setModal(null)}>
            <p className="text-[13px] font-inter text-black mb-3">
              Sellers on Malltiply are expected to list accurate product details and deliver orders promptly.
            </p>

            <p className="text-[13px] font-inter text-black mb-3">
              Products must match the images and descriptions provided.
            </p>

            <p className="text-[13px] font-inter text-black">
              Repeated violations may result in account suspension.
            </p>
          </InfoModal>
        )}

        {modal === "terms" && (
          <InfoModal title="Terms of use" onClose={() => setModal(null)}>
            <p className="text-[13px] font-inter text-black mb-3">
              Malltiply is a marketplace connecting buyers with independent sellers.
            </p>

            <p className="text-[13px] font-inter text-black mb-3">
              Sellers are responsible for product accuracy, pricing, and order fulfillment.
            </p>

            <p className="text-[13px] font-inter text-black">
              By using Malltiply, you agree to follow our marketplace policies and guidelines.
            </p>
          </InfoModal>
        )}

        {modal === "privacy" && (
          <InfoModal title="Privacy policy" onClose={() => setModal(null)}>
            <p className="text-[13px] font-inter text-black mb-3">
              Malltiply collects only the information required to process orders and improve the platform.
            </p>

            <p className="text-[13px] font-inter text-black mb-3">
              Your personal details are never sold to third parties.
            </p>

            <p className="text-[13px] font-inter text-black">
              Information such as your name, address, and contact details are used only for order fulfillment and support.
            </p>
          </InfoModal>
        )}


    </>
  );
}