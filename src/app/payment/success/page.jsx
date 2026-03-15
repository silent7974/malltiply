"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const loadingUI = (
  <div className="w-full h-screen flex items-center justify-center">
    <p className="text-lg font-medium">Verifying your payment...</p>
  </div>
)

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("trxref");
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
        localStorage.removeItem("cart");
        router.replace(`/orders?reference=${reference}`);
      } else {
        router.replace("/payment/failed");
      }
    }

    verify();
  }, [reference, router]);

  return loadingUI
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={loadingUI}>
      <PaymentSuccessContent />
    </Suspense>
  );
}