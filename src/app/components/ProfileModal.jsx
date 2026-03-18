"use client"

import { Headphones } from "lucide-react"
import { useState } from "react"
import SignInLayout from "./SignInLayout"
import { useMeQuery } from "@/redux/services/authApi"

export default function ProfileModal({ onClose }) {
  const [showSignIn, setShowSignIn] = useState(false)
  const { data, isLoading } = useMeQuery()

  const firstName = data?.user?.fullName?.split(" ")[0] || ""

  return (
    <div className="absolute right-0 top-10 z-50">
      <div className="relative w-[min(280px,calc(100vw-32px))]">

        <div className="absolute right-12 -top-[7px] w-0 h-0 border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-white" />

        <div className="w-full bg-white rounded-xl border border-gray-300 shadow-md overflow-hidden">

          {/* Sign in */}
          <div className="w-full flex justify-center pt-3 pb-3 px-3">
            {isLoading ? (
              <span className="text-gray-500">Loading...</span>
            ) : data?.user ? (
              <h2
                className="font-[montserrat] font-semibold text-gray font-[20px] "
              >
                  Hi, {firstName}
              </h2>
            ) : (
              <button
                onClick={() => setShowSignIn(true)}
                className="w-full h-[40px] bg-[#005770] rounded-full flex items-center justify-center hover:opacity-90 transition"
              >
                <span className="text-white font-semibold tracking-wide text-[14px]">
                  Sign in
                </span>
              </button>
            )}
          </div>

          <div className="w-full h-[4px] bg-gray-200" />

          <a
            href="https://wa.me/2349065941258"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full flex items-center gap-3 px-4 h-[56px] hover:bg-gray-50"
          >
            <Headphones className="w-5 h-5 text-[#005770] flex-shrink-0" />
            <span className="text-[13px] font-medium text-gray-800">
              Contact support (WhatsApp)
            </span>
          </a>

        </div>
      </div>

      {showSignIn && <SignInLayout onClose={() => setShowSignIn(false)} />}
    </div>
  )
}

// "use client"

// import { Headphones, History } from "lucide-react"
// import Image from "next/image"
// import { useState } from "react"
// import SignInLayout from "./SignInLayout"

// export default function ProfileModal() {
//   const [showSignIn, setShowSignIn] = useState(false)

//   return (
//     <div className="absolute right-0 top-10 z-50">
//       {/* pointer (border + fill so it feels part of the card) */}
//       <div className="relative w-[346px]">
//         {/* outer border triangle */}
//         <div
//           className="absolute left-12 -top-3 w-0 h-0 
//                         border-l-[10px] border-r-[10px] border-b-[10px]
//                         border-l-transparent border-r-transparent border-b-gray-300"
//         />
//         {/* inner white triangle */}
//         <div
//           className="absolute left-[52px] -top-[10px] w-0 h-0 
//                         border-l-[8px] border-r-[8px] border-b-[8px]
//                         border-l-transparent border-r-transparent border-b-white"
//         />

//         {/* card */}
//         <div className="w-[346px] bg-white rounded-xl border border-gray-300 shadow-md overflow-hidden">
//           {/* SIGN IN  */}
//           <div className="w-full flex justify-center pt-3">
//             <button
//               onClick={() => setShowSignIn(true)}
//               className="w-[310px] h-[40px] bg-[#005770] rounded-full
//                             flex items-center justify-center hover:opacity-90 transition"
//             >
//               <span className="text-white font-semibold tracking-wide">
//                 SIGN IN
//               </span>
//             </button>
//           </div>

//           {/* top row: orders / profile / reviews (each 66x75) */}
//           <div className="px-4 pt-3">
//             <div className="flex items-center justify-between">
//               {/* Your orders */}
//               <div className="w-[66px] h-[75px] flex flex-col items-center justify-between py-1">
//                 <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
//                   <Image
//                     className="w-5 h-5"
//                     src="/orders.svg"
//                     alt="Reviews"
//                     width={32}
//                     height={32}
//                   />
//                 </div>
//                 <span className="text-[11px] text-center leading-tight">Your orders</span>
//               </div>

//               {/* Your profile */}
//               <div className="w-[66px] h-[75px] flex flex-col items-center justify-between py-1">
//                 <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
//                   <Image
//                     className="w-5 h-5"
//                     src="/profile-white.svg"
//                     alt="Reviews"
//                     width={32}
//                     height={32}
//                   />
//                 </div>
//                 <span className="text-[11px] text-center leading-tight">Your profile</span>
//               </div>

//               {/* Your reviews */}
//               <div className="w-[66px] h-[75px] flex flex-col items-center justify-between py-1">
//                 <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
//                   <Image
//                     className="w-5 h-5"
//                     src="/reviews.svg"
//                     alt="Reviews"
//                     width={32}
//                     height={32}
//                   />
//                 </div>
//                 <span className="text-[11px] text-center leading-tight">Your reviews</span>
//               </div>
//             </div>
//           </div>

//           {/* Divider */}
//           <div className="w-[364px] h-[4px] bg-gray-200 mx-auto my-2" />

//           {/* Customer support */}
//           <div className="w-full flex justify-center">
//             <div className="w-[323px] h-[72px] flex items-center gap-3 px-4 rounded-md hover:bg-gray-50 cursor-pointer border-b border-gray-200">
//               <Headphones className="w-6 h-6 text-[#005770]" />
//               <span className="text-[14px] font-medium text-gray-800">Customer Support</span>
//             </div>
//           </div>

//           {/* Browsing history */}
//           <div className="w-full flex justify-center">
//             <div className="w-[323px] h-[72px] flex items-center gap-3 px-4 rounded-md hover:bg-gray-50 cursor-pointer">
//               <History className="w-6 h-6 text-[#005770]" />
//               <span className="text-[14px] font-medium text-gray-800">Browsing History</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ✅ Render SignInLayout as modal */}
//       {showSignIn && <SignInLayout onClose={() => setShowSignIn(false)} />}
//     </div>
//   )
// }