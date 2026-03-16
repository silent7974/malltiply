"use client"

import { ShoppingCart, Search } from "lucide-react"
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"
import { useState } from "react"
import SearchModal from "./SearchModal"
import ProfileModal from "./ProfileModal"
import { useSelector } from "react-redux"
import { useMeQuery } from "@/redux/services/authApi"

export default function Navbar() {
  const pathname = usePathname();
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const totalQuantity = useSelector(state => state.cart.totalQuantity);
  const { data: me } = useMeQuery();
  const user = me?.user;

  return (
    <nav className="w-full flex flex-col px-4 pt-[36px] relative">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-[8px]">
          <Link href="/category">
            <Image
              src={pathname === "/category" ? "/hamburger-red.svg" : "/ags-hamburger.svg"}
              alt="Menu"
              width={28}
              height={28}
            />
          </Link>

          <Link className="flex items-center gap-[4px]" href="/">
            <Image src="/malltiply-logo.svg" alt="Malltiply Logo" width={28} height={28} />
          </Link>
        </div>

        <div className="flex items-center gap-[16px] relative">
          <button onClick={() => setShowProfile(prev => !prev)}>
            <Image src="/profile.svg" alt="User profile" width={28} height={28} />
          </button>

          {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}

          {/* Hide badge if not logged in */}
          <Link href="/cart" className="relative">
            <ShoppingCart size={28} className="text-black" />
            {totalQuantity > 0 && (
              <div
                className="absolute flex items-center justify-center"
                style={{
                  top: "-4px",
                  right: "-6px",
                  width: "20px",
                  height: "16px",
                  borderRadius: "8px",
                  backgroundColor: "#005770",
                  color: "#ffffff",
                  fontSize: "9px",
                  fontFamily: "Inter",
                  fontWeight: 600,
                }}
              >
                {totalQuantity}
              </div>
            )}
          </Link>
        </div>
      </div>

      <div className="w-full flex justify-center mt-2">
        <button
          onClick={() => setShowSearch(true)}
          className="w-full flex items-center h-[28px] bg-[#E1E6E8] px-[4px] gap-[8px] rounded-full cursor-pointer"
        >
          <Search size={20} className="text-black/50" />
          <span className="font-montserrat text-[12px] font-medium text-black/50">
            Search products and categories
          </span>
        </button>
      </div>

      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
    </nav>
  );
}