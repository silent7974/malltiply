'use client';

import {
  X, Home, Package, Wallet, BarChart4,
  LifeBuoy, Settings, LogOut, Folders, Store
} from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { useLogoutMutation } from "@/redux/services/sellerApi";
import { sellerApi } from "@/redux/services/sellerApi";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { resetProfile } from '@/redux/slices/sellerProfileSlice';

export default function MenuModal({ onClose }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  const seller = useSelector((state) => state.sellerProfile);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // trigger enter animation
    setMounted(true);
  }, []);

  if (seller.status !== "succeeded") return null;

  const isPremium = seller.sellerType === "premium_seller";

  const menuItems = isPremium ? [
    { name: 'Dashboard', icon: Home, path: '/seller/premium/dashboard' },
    { name: 'Store', icon: Store, path: '/seller/premium/dashboard/store' },
    { name: 'My Products', icon: Folders, path: '/seller/premium/dashboard/products' },
    { name: 'Orders', icon: Package, path: '/seller/premium/dashboard/orders' },
    { name: 'Payments', icon: Wallet, path: '/seller/premium/dashboard/payments' },
    { name: 'Performance', icon: BarChart4, path: '/seller/premium/dashboard/performance' },
    { name: 'Help Center', icon: LifeBuoy, path: '/seller/premium/dashboard/help' },
  ] : [
    { name: 'Dashboard', icon: Home, path: '/seller/normal/dashboard' },
    { name: 'My Products', icon: Folders, path: '/seller/normal/dashboard/products' },
    { name: 'Orders', icon: Package, path: '/seller/normal/dashboard/orders' },
    { name: 'Payments', icon: Wallet, path: '/seller/normal/dashboard/payments' },
    { name: 'Performance', icon: BarChart4, path: '/seller/normal/dashboard/performance' },
    { name: 'Help Center', icon: LifeBuoy, path: '/seller/normal/dashboard/help' },
  ];

  return (
    <div
      className={`
        fixed top-0 left-0 h-screen w-[188px]
        bg-[#005770] rounded-tr-[24px]
        py-[48px] px-[16px] z-50
        flex flex-col justify-between
        overflow-y-auto scrollbar-hide
        transform transition-all
        duration-[260ms]
        ${
          mounted
            ? "translate-x-0 opacity-100"
            : "-translate-x-[110%] opacity-0"
        }
        ease-[cubic-bezier(0.34,1.56,0.64,1)]
      `}
    >
      {/* Close Button */}
      <div className="flex justify-end mb-[16px]">
        <X
          size={16}
          color="#ffffff"
          onClick={onClose}
          className="cursor-pointer"
        />
      </div>

      {/* Logo */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-[4px] mb-[32px]">
          <span className="text-[16px] font-bold text-white font-montserrat">
            Malltiply
          </span>
          <img
            src="/malltiply-logo-white.svg"
            width={32}
            height={32}
            alt="Malltiply Logo"
          />
        </div>

        {/* Navigation */}
        <div className="w-full">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <div key={item.name} className="relative">
                {isActive && (
                  <div className="absolute left-[-16px] h-[72px] w-[4px] bg-white rounded-r-[16px]" />
                )}

                <button
                  onClick={() => {
                    router.push(item.path);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-[12px] py-[24px] ${
                    isActive ? "text-white" : "text-white/60"
                  }`}
                >
                  <Icon size={24} />
                  <span className="text-[16px] font-medium font-montserrat">
                    {item.name}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom */}
      <div className="w-full">
        <button
          onClick={() => {
            router.push(
              isPremium
                ? "/seller/premium/dashboard/settings"
                : "/seller/normal/dashboard/settings"
            );
            onClose();
          }}
          className="w-full flex items-center gap-[12px] py-[12px] text-white/60"
        >
          <Settings size={24} />
          <span className="text-[16px] font-medium font-montserrat">
            Settings
          </span>
        </button>

        <button
          onClick={async () => {
            await logout().unwrap();
            dispatch(sellerApi.util.resetApiState()) // clear sellerApi profile
            dispatch(resetProfile()); // clear sellerProfile slice
            router.replace("/seller/signin");
          }}
          className="w-full flex items-center gap-[12px] py-[12px] text-white mt-[16px]"
        >
          <LogOut size={24} />
          <span className="text-[16px] font-medium font-montserrat">
            Logout
          </span>
        </button>
      </div>
    </div>
  );
}