"use client"

import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useState } from "react"
import { useDeleteAccountMutation } from "@/redux/services/sellerApi"

export default function DeleteAccountButton() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { status } = useSelector((s) => s.sellerProfile)
  const [confirming, setConfirming] = useState(false)

  const [deleteAccount] = useDeleteAccountMutation();

  const handleDelete = async () => {
    try {
      await deleteAccount().unwrap();
      router.push("/seller");
    } catch (err) {
      alert("Failed to delete account: " + err);
    }
  };

  return (
    <div className="flex justify-center">
      <div
        className="bg-white w-[321px] h-[52px] rounded-md
        shadow-[-2px_2px_4px_rgba(0,0,0,0.25) 
        flex items-center justify-between px-6 mt-6 mx-auto"
      >
        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            disabled={status === "loading"}
            className="w-full h-[36px] bg-[#B41316] rounded-[4px] flex items-center justify-center gap-[8px]"
          >
            <span className="text-white font-[Inter] font-semibold text-[12px]">
              Delete Account
            </span>
            <Image
              src="/trashcan.svg"
              alt="Delete"
              width={18}
              height={18}
            />
          </button>
        ) : (
          <div className="flex w-full gap-2">
            <button
              onClick={handleDelete}
              disabled={status === "loading"}
              className="flex-1 h-[36px] bg-[#B41316] rounded-[4px] flex items-center justify-center"
            >
              <span className="text-white font-[Inter] font-semibold text-[12px]">
                Confirm
              </span>
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="flex-1 h-[36px] bg-gray-300 rounded-[4px] flex items-center justify-center"
            >
              <span className="text-black font-[Inter] font-semibold text-[12px]">
                Cancel
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}