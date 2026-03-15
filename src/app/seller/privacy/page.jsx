'use client'

import React from 'react'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white px-[16px] pt-[40px] pb-[48px]">
      
      {/* Header */}
      <div className="flex items-center gap-[40px] mb-[24px]">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center"
        >
          <ChevronLeft size={24} className="text-black/70" />
        </button>
        <h1 className="text-[18px] font-medium text-black">
          Seller Privacy Policy
        </h1>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-[16px] text-[13px] text-black/80 leading-[1.6]">
        
        <p>
          This Privacy Policy explains how Malltiply collects, uses, and protects
          seller information on the platform.
        </p>

        <div>
          <p className="font-medium text-black mb-[4px]">Information we collect</p>
          <p>
            We collect basic account details such as name, email address, phone
            number, store information, and product data provided by sellers.
          </p>
        </div>

        <div>
          <p className="font-medium text-black mb-[4px]">How information is used</p>
          <p>
            Seller information is used to operate the platform, manage stores,
            process orders, enable payments, and provide customer support.
          </p>
        </div>

        <div>
          <p className="font-medium text-black mb-[4px]">Data sharing</p>
          <p>
            We do not sell seller data. Information is only shared where necessary
            to run the platform or comply with legal requirements.
          </p>
        </div>

        <div>
          <p className="font-medium text-black mb-[4px]">Data security</p>
          <p>
            Reasonable technical and organizational measures are used to protect
            seller data from unauthorized access or misuse.
          </p>
        </div>

        <div>
          <p className="font-medium text-black mb-[4px]">Your responsibility</p>
          <p>
            Sellers are responsible for keeping their login credentials secure
            and ensuring the accuracy of information they provide.
          </p>
        </div>

        <div>
          <p className="font-medium text-black mb-[4px]">Updates</p>
          <p>
            This policy may be updated occasionally. Continued use of the
            platform means acceptance of any changes.
          </p>
        </div>

      </div>
    </div>
  )
}