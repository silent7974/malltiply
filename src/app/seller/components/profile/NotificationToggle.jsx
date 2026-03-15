"use client"

import { useDispatch, useSelector } from "react-redux"
import { toggleNotification } from "@/redux/slices/sellerProfileSlice"
import { useUpdateProfileMutation } from "@/redux/services/sellerApi"

export default function NotificationToggle() {
  const dispatch = useDispatch()
  const notificationsEnabled = useSelector(
    (state) => state.sellerProfile.notificationsEnabled
  )

  const [updateProfile] = useUpdateProfileMutation();

  const handleToggle = async () => {
    dispatch(toggleNotification());
    try {
      const newValue = !notificationsEnabled;
      dispatch(toggleNotification()); // update UI immediately
      await updateProfile({ notificationsEnabled: newValue }).unwrap();
    } catch (err) {
      console.error("Failed to update notification", err);
    }
  };

  return (
    <div className="flex justify-center">
      <div
        className="bg-white w-[321px] h-[40px] rounded-md 
        shadow-[-2px_2px_4px_rgba(0,0,0,0.25)] 
        flex items-center justify-between px-6 mt-6 mx-auto"
      >
        <span className="text-[16px] font-medium text-gray-800 font-inter">
          Enable Notifications
        </span>

        {/* Custom Switch */}
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-200 ${
            notificationsEnabled ? "bg-[#BACACC]" : "bg-gray-200"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full transition-transform duration-200 ${
              notificationsEnabled
                ? "translate-x-5 bg-[#005770]"
                : "translate-x-1 bg-gray-400"
            }`}
          />
        </button>
      </div>
    </div>
  )
}