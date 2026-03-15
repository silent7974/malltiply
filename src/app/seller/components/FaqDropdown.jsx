'use client';
import { useState } from 'react'

export default function FaqDropdown() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: "How much does it cost to sell?",
      answer:
        "Selling on Malltiply is free for basic sellers. A commission is applied per completed order. Premium seller plans are optional and priced monthly.",
    },
    {
      question: "How do I get paid?",
      answer:
        "Payments are released to sellers after successful delivery is confirmed.",
    },
  ];

  return (
    <div className="bg-white my-[24]">
      {faqData.map((item, index) => (
        <div
          key={index}
          className="px-[16px] border-b border-[#E0E0E0]"
        >
          {/* Question Row */}
          <div
            className="flex justify-between items-center py-[16px] cursor-pointer"
            onClick={() =>
              setOpenIndex(openIndex === index ? null : index)
            }
          >
            <p className="text-[12px] font-[Montserrat] text-black">
              {item.question}
            </p>
            <svg
              className={`w-[12px] h-[12px] text-black/50 transition-transform duration-300 ${
                openIndex === index ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Answer */}
          {openIndex === index && (
            <p className="text-[10px] font-[Montserrat] text-[#6D6D6D] pb-[16px]">
              {item.answer}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}