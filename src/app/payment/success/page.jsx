"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const reference =
  searchParams.get("reference") || searchParams.get("trxref");
  //LOGS
  console.log("PAYSTACK CALLBACK PARAMS:", reference, searchParams.toString());

  const router = useRouter();

  useEffect(() => {
    async function verify() {
      if (!reference) return;

      const res = await fetch("/api/payment/verify", {
        method: "POST",
        body: JSON.stringify({ reference }),
      });

      const data = await res.json();

      if (data.status === "success" || data.data?.status === "success") {
        localStorage.removeItem("cart") // ← clear for guests
        router.replace(`/orders?reference=${reference}`);
      } else {
        router.replace("/payment/failed");
      }
    }

    verify();
  }, [reference, router]);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <p className="text-lg ">Verifying your payment...</p>
    </div>
  );
}