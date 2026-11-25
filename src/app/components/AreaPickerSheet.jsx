"use client";
import { useMemo, useState } from "react";
import formatPrice from "@/lib/utils/formatPrice";
import {
  DELIVERY_AREAS,
  DELIVERY_GROUPS,
  OTHER_AREA,
} from "@/lib/utils/calculateDeliveryFee";

const SUPPORT_WHATSAPP_URL = "https://wa.me/2349065941258";

// Bottom sheet where the buyer picks the place closest to their address.
// Used by both address forms, so the list and the prices live in one place.
export default function AreaPickerSheet({ open, selected, onSelect, onClose }) {
  const [query, setQuery] = useState("");

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = (area) =>
      !q ||
      [area.label, area.group, ...(area.keywords || []), ...area.quotes.map((x) => x.place)]
        .join(" ")
        .toLowerCase()
        .includes(q);

    return DELIVERY_GROUPS.map((group) => ({
      group,
      areas: DELIVERY_AREAS.filter((a) => a.group === group && matches(a)),
    })).filter((section) => section.areas.length > 0);
  }, [query]);

  if (!open) return null;

  const pick = (label) => {
    onSelect(label);
    setQuery("");
    onClose();
  };

  const rowClass = (isSelected) =>
    `w-full flex items-center justify-between gap-3 text-[12px] font-inter px-[12px] py-[8px] text-left rounded-[4px] ${
      isSelected ? "bg-[#2A9CBC]/10 text-[#2A9CBC]" : "bg-gray-100 text-black"
    }`;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-end z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full rounded-t-[16px] max-h-[75vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title + search stay at the top while the list scrolls */}
        <div className="px-[16px] pt-[24px] pb-[12px] border-b border-black/10">
          <h2 className="text-[14px] text-center font-inter font-semibold">
            Select your area
          </h2>
          <p className="text-[11px] font-inter text-black/50 text-center mt-[2px]">
            Pick the place closest to your address. The price is for delivery by Bolt rider.
          </p>
          <input
            type="text"
            inputMode="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search, e.g. Banex, Apo, Kubwa"
            className="w-full h-[36px] bg-[#EEEEEE] rounded-[4px] px-[12px] mt-[12px] text-[16px] font-inter text-black/70 outline-none"
          />
        </div>

        <div className="overflow-y-auto scrollbar-hide px-[16px] pb-[36px]">
          {sections.map(({ group, areas }) => (
            <div key={group}>
              <p className="text-[11px] font-inter font-semibold text-black/40 uppercase tracking-wide mt-[16px] mb-[6px]">
                {group}
              </p>
              <div className="flex flex-col gap-[6px]">
                {areas.map((area) => (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => pick(area.label)}
                    className={rowClass(selected === area.label)}
                  >
                    <span>{area.label}</span>
                    <span className="text-black/50 whitespace-nowrap">
                      ₦{formatPrice(area.fee)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {sections.length === 0 && (
            <p className="text-[12px] font-inter text-black/50 text-center mt-[24px]">
              No place found for "{query}".
            </p>
          )}

          {/* Always available at the bottom */}
          <p className="text-[11px] font-inter font-semibold text-black/40 uppercase tracking-wide mt-[16px] mb-[6px]">
            Not on the list?
          </p>
          <button
            type="button"
            onClick={() => pick(OTHER_AREA.label)}
            className={rowClass(selected === OTHER_AREA.label)}
          >
            <span>{OTHER_AREA.label}</span>
            <span className="text-black/50 whitespace-nowrap">₦{formatPrice(OTHER_AREA.fee)}</span>
          </button>
          <a
            href={SUPPORT_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-[12px] font-inter text-[#005770] underline text-center mt-[12px]"
          >
            Message us on WhatsApp for an exact price
          </a>
        </div>
      </div>
    </div>
  );
}