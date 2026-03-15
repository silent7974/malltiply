"use client";

import { usePathname } from "next/navigation";
import SellerNavbar from "./SellerNavbar";
import { useGetProfileQuery } from "@/redux/services/sellerApi";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const hideNavbar = pathname.includes("/settings")
  const { data: seller, isLoading } = useGetProfileQuery();

  if (isLoading) return <div>Loading...</div>; // optional loader

  return (
      <div className="flex flex-col min-h-screen px-[16px] py-[40px]">
        {!hideNavbar && <SellerNavbar />}
        <main className="flex-1">{children}</main>
      </div>
  );
}