import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useGetPickupStationsQuery } from "@/redux/services/pickupApi";

export default function PickupPage({ onClose, setSelectedPickupStation }) {
    const { data, isLoading } = useGetPickupStationsQuery();
    const stations = data?.stations || [];

    const [search, setSearch] = useState("");

    const filteredStations = stations.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.street.toLowerCase().includes(search.toLowerCase()) ||
        s.district.toLowerCase().includes(search.toLowerCase())
    );

    if (isLoading) return <p className="p-4">Loading stations…</p>;

    return (
        <div className="px-4 py-4 min-h-screen bg-white">

            {/* Header */}
            <div className="flex items-center justify-between mb-[12px]">
                <ChevronLeft size={20} className="text-black/70 cursor-pointer" onClick={onClose} />
                <p className="text-[20px] font-inter font-medium text-black">Add a Pickup address</p>
                <div className="w-[20px]" />
            </div>

            {/* Encryption Notice */}
            <div className="flex items-center justify-center gap-[2px] mb-[12px]">
                <Image src="/lock.svg" alt="Lock" width={12} height={12} />
                <p className="text-[12px] font-inter font-normal text-[#005770]">All data will be encrypted</p>
            </div>

            {/* Search Bar */}
            <div className="w-full mb-4">
                <input
                    type="text"
                    placeholder="Search pickup stations"
                    className="w-full p-3 rounded-lg border border-black/20 text-[14px] font-inter"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Filtered Stations */}
            <div className="flex flex-col gap-3 mt-2">
                {filteredStations.map((station) => (
                    <button
                        key={station.id}
                        onClick={() => {
                            setSelectedPickupStation(station);
                            onClose();
                        }}
                        className="p-3 border border-black/10 rounded-lg text-left"
                    >
                        <p className="text-[14px] font-medium">{station.name}</p>
                        <p className="text-[12px] text-black/70">
                            {station.street}, {station.district}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
}