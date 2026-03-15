'use client'

import { useRouter } from 'next/navigation'

export default function SignUpModal({ isOpen, onClose }) {
  const router = useRouter();

  if (!isOpen) return null;

  // Close modal when clicking outside (overlay)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-end bg-black/50"
      onClick={handleOverlayClick}
    >
      {/* Modal */}
      <div className="w-full bg-white rounded-t-[24px] p-[16px] animate-slideUp">
        {/* Close Drag Bar */}
        <div className="flex justify-center mb-4">
          <div className="w-[40px] h-[4px] bg-[#E0E0E0] rounded-full"></div>
        </div>

        {/* Title */}
        <h2 className="text-[16px] font-[Montserrat] font-semibold text-center text-[#101010] mb-4">
          Sign up as...
        </h2>

        {/* Options */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => router.push('/seller/normal/signup')}
            className="w-full py-3 bg-[#005770] text-white rounded-[8px] font-[Montserrat] text-[14px] font-semibold"
          >
            Normal seller
          </button>
          <button
            onClick={() => router.push('/seller/premium/signup')}
            className="w-full py-3 bg-[#2A9CBC] text-white rounded-[8px] font-[Montserrat] text-[14px] font-semibold"
          >
            Premium seller
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}