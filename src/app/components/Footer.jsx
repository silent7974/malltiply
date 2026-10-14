import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import InfoModal from "./InfoModal";

function WhatsAppIcon({ size = 20, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.456h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}


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
                  Malltiply is a marketplace for fashion products from local sellers in Abuja.
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
            
            <a  href="https://www.instagram.com/malltiply.ng?stkn=ZWJ5YzJzc29xbWp0&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/instagram.svg" alt="Instagram" width={20} height={20} />
            </a>
            
            <a  href="https://wa.me/2349065941258"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/whatsapp.svg" alt="WhatsApp" width={20} height={20} />
            </a>
            
            <a  href="https://www.tiktok.com/@malltiply.ng"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/tiktok.svg" alt="TikTok" width={20} height={20} />
            </a>
          </div>

            <div className="font-[inter] text-[12px] font-light text-[#7B7979] text-center mt-[24px]">
              <p>© 2026 Malltiply™ </p>
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

            <a
              href="https://wa.me/2349065941258"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full h-[36px] rounded-[32px] bg-[#005770] text-white font-inter font-semibold text-[13px] mt-2"
            >
              <WhatsAppIcon size={20} className="text-[#25D366]" />
              Chat on WhatsApp
            </a>
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