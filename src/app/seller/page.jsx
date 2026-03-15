'use client'

import FaqDropdown from '@/app/seller/components/FaqDropdown'
import Footer from '@/app/components/Footer'
import SignUpModal from '@/app/seller/components/SignupModal'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SellerIndexPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const router = useRouter()
  
  return (
    <div className="min-h-screen bg-[#E8F0F1]">
      {/* Nav */}
      <nav className="w-full h-[80px] bg-[#101010] py-[24px] px-4 flex items-center justify-between">
        {/* Left Side: Logo + Text */}
        <div className="flex items-center space-x-2">
          <Image
            src="/malltiply-logo-seller.svg"
            alt="Malltiply Logo"
            width={32}
            height={29}
            priority
          />
          <div>
            <p className="text-white text-[16px] mb-[2px] font-semibold font-[Montserrat] leading-none">
              Malltiply
            </p>
            <p className="text-[#C7C5C5] text-[12px] font-bold font-[Montserrat] leading-none">
              Seller Center
            </p>
          </div>
        </div>

        {/* Right Side: Buttons */}
        <div className="flex items-center space-x-2">
          <button 
          className="text-white text-[14px] font-semibold font-[Inter] px-2 py-2 rounded-[8px]"
          onClick={() => router.push('/seller/signin')}
          >
            Sign In
          </button>
          <button 
          onClick={() => setModalOpen(true)}
          className="bg-[#2A9CBC] text-white text-[14px] font-semibold font-[Inter] px-2 py-2 rounded-[8px]">
            Sign Up
          </button>
        </div>
      </nav>

      <main className="w-full ">

        {/* Hero Section */}
        <div className="relative w-full h-[208px] hero-gradient py-8">
            <Image
                src="/seller-hero.png?v=2"
                alt="Seller Hero"
                width={96}
                height={172}
                className="absolute top-[8px] right-[16px]"
                priority
            />

            <div className="absolute top-[2px] left-[16px] flex flex-col space-y-[16px] max-w-[180px]">
                {/* Main Heading */}
                <p className="text-white text-[12px] font-black font-[Montserrat] leading-[32px]">
                Sell your fashion products<br />in one simple marketplace
                </p>

                {/* Subheading */}
                <p className="text-white text-[8px] font-medium font-[Montserrat] leading-tight">
                Upload once, buyers order directly, delivered safely in Abuja
                </p>

                {/* Sign Up Button */}
                <button 
                onClick={() => setModalOpen(true)}
                className="bg-[#2A9CBC] w-24 text-white text-[16px] font-semibold font-[Inter] py-2 rounded-[8px]">
                Sign Up
                </button>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-[48px] px-4 backdrop-blur-md bg-black/50 flex divide-x divide-white/30" >
                {/* Element 1 */}
                <div className="flex-1 flex items-center pr-[6px]">
                    <p className="text-white text-[24px] font-semibold mr-1 font-[Inter]">1</p>
                    <div className="flex flex-col ">
                    <p className="text-white text-[8px] font-semibold font-[Inter] mb-1 leading-none">
                        Minute
                    </p>
                    <p className="text-white text-[7px] font-semibold font-[Inter] leading-none">
                        Create account
                    </p>
                    </div>
                </div>

                {/* Element 2 */}
                <div className="flex-1 flex items-center justify-center pr-[6px] pl-[6px]">
                    <p className="text-white text-[24px] font-semibold mr-1 font-[Inter]">2</p>
                    <div className="flex flex-col ">
                    <p className="text-white text-[8px] font-semibold font-[Inter] mb-1 leading-none">
                        Minutes
                    </p>
                    <p className="text-white text-[7px] font-semibold font-[Inter] leading-none">
                        Upload products
                    </p>
                    </div>
                </div>

                {/* Element 3 */}
                <div className="flex-1 flex items-center pl-[6px]">
                    <p className="text-white text-[24px] font-semibold mr-1 font-[Inter]">5</p>
                    <div className="flex flex-col">
                    <p className="text-white text-[8px] font-semibold font-[Inter] mb-1 leading-none">
                        Minutes
                    </p>
                    <p className="text-white text-[7px] font-semibold font-[Inter] leading-none">
                        Customize store
                    </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Why Sell on Malltiply */}
        <div className="my-[24px] px-[16px] sm:px-[12px] xs:px-[8px]">
          <h2 className="text-[20px] text-center font-semibold font-[Inter] text-[#18331B]">
            Why Sell on Malltiply?
          </h2>

          {/* Cards Grid */}
          <div className="mt-[36px] flex grid items-center gap-y-[36px] justify-center">

            {/* Card 1 */}
            <div className="relative bg-white w-full h-[128px] rounded-[8px]">
              {/* Icon */}
              <img
                src="/radio-tower.svg"
                alt="Radio Tower"
                className="absolute right-[-8px] -top-4"
              />

              {/* Title */}
              <p className="mt-[24px] text-[14px] ml-2 font-bold font-[Montserrat]">
                <span className="text-[#005770]">Get discovered </span>
                <span className="text-[#18331B]">by real buyers</span>
              </p>

              {/* Paragraph */}
              <p className="mt-[12px] text-[12px] font-[Montserrat] text-[#303030] leading-[1.2] px-[8px]">
                Your products are visible to buyers in Abuja and beyond. No tech skills needed, just upload and start selling.
              </p>
            </div>


            {/* Card 2 */}
            <div className="relative bg-white w-full h-[128px] rounded-[8px]">
              <img
                src="/setup.svg"
                alt="Headset"
                className="absolute left-[-8px] -top-4"
              />

              <p className="mt-[24px] text-[14px] ml-2 font-bold font-[Montserrat]">
                <span className="text-[#005770]">Setup </span>
                <span className="text-[#18331B]">is simple</span>
              </p>

              <p className="mt-[12px] text-[12px] font-[Montserrat] text-[#303030] leading-[1.2] px-[8px]">
                Create an account, upload products, and manage your store in minutes. Everything is guided and straightforward.
              </p>
            </div>

            {/* Card 3 */}
            <div className="relative bg-white w-full h-[128px] rounded-[8px]">
              <img
                src="/shield-check.svg"
                alt="Your Brand"
                className="absolute right-[-8px] -top-4"
              />

              <p className="mt-[24px] text-[14px] ml-2 font-bold font-[Montserrat]">
                <span className="text-[#005770]">Safe & </span>
                <span className="text-[#18331B]">reliable</span>
              </p>

              <p className="mt-[12px] text-[12px] font-[Montserrat] text-[#303030] leading-[1.2] px-[8px]">
                All sellers are verified, payments are secure, deliveries tracked. Buyers know they can trust your store.
              </p>
            </div>

            {/* Card 4 */}
            <div className="relative bg-white w-full h-[128px] rounded-[8px]">
              <img
                src="/your-brand.svg"
                alt="Chart Column"
                className="absolute left-[-8px] -top-4"
              />

              <p className="mt-[24px] text-[14px] ml-2 font-bold font-[Montserrat]">
                <span className="text-[#005770]">Optional </span>
                <span className="text-[#18331B]">branded stores</span>
              </p>

              <p className="mt-[12px] text-[12px] font-[Montserrat] text-[#303030] leading-[1.2] px-[8px]">
                Upgrade to a premium store for customization and highlights. No pressure, only if you want more visibility.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="my-[56px] px-[16px] sm:px-[12px] xs:px-[8px]">
          <h2 className="text-[20px] text-center font-semibold font-[Inter] text-[#7B7979]">
            Common seller questions
          </h2>

          <FaqDropdown />
        </div>
      </main>

      <Footer />

      {/* Modal Component */}
      <SignUpModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}