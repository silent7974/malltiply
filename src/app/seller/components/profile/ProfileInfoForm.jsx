"use client";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useSelector } from "react-redux";
import SellerCategoryDropdown from "../SellerCategoryDropdown";
import { useGetProfileQuery } from "@/redux/services/sellerApi";
import { ChevronDown } from "lucide-react";

const abujaDistricts = [
  "Wuse", "Maitama", "Asokoro", "Garki", "Gwarinpa", "Utako", "Jabi",
  "Kado", "Life Camp", "Kubwa", "Lugbe", "Karu", "Lokogoma", "Nyanya",
  "Apo", "Mpape", "Durumi", "Galadimawa", "Jahi", "Mabushi"
];

const ProfileInfoForm = forwardRef((props, ref) => {
  const { fullName, email, phone, category, location, status, error } = useSelector(
    (s) => s.sellerProfile
  );

  useGetProfileQuery(); // fetch profile

  const [localProfile, setLocalProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    category: "",
    location: { city: "Abuja", street: "", district: "" },
  });

  const [openDistrictModal, setOpenDistrictModal] = useState(false);

  useEffect(() => {
    setLocalProfile({
      fullName,
      email,
      phone,
      category,
      location: location || { city: "Abuja", street: "", district: "" },
    });
  }, [fullName, email, phone, category, location]);

  const handleChange = (field, value) => {
    setLocalProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (field, value) => {
    setLocalProfile((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));
  };

  useImperativeHandle(ref, () => ({
    getValues: () => localProfile,
  }));

  if (status === "loading") return <p className="mx-[16px] mt-[8px]">Loading…</p>;
  if (status === "failed")
    return <p className="text-red-500 mx-[16px] mt-[8px]">{String(error)}</p>;

  return (
    <div className="flex justify-center">
      <div className="bg-white w-[321px] rounded-md shadow-[-2px_2px_4px_rgba(0,0,0,0.25)] flex flex-col mt-8 mx-auto px-[12px] py-[16px]">

        {/* Full Name */}
        <label className="text-[12px] font-medium mb-[4px]">Full Name</label>
        <input
          type="text"
          value={localProfile.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          className="w-full h-[32px] bg-[#EEEEEE] px-[12px] text-[12px] rounded-[4px]"
        />

        {/* Email */}
        <label className="text-[12px] font-medium mt-[8px] mb-[4px]">Email Address</label>
        <input
          type="email"
          value={localProfile.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className="w-full h-[32px] bg-[#EEEEEE] px-[12px] text-[12px] rounded-[4px]"
        />

        {/* Phone */}
        <label className="text-[12px] font-medium mt-[8px] mb-[4px]">Phone No</label>
        <input
          type="text"
          value={localProfile.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          className="w-full h-[32px] bg-[#EEEEEE] px-[12px] text-[12px] rounded-[4px]"
        />

        {/* Category */}
        <SellerCategoryDropdown
          selected={localProfile.category}
          onSelect={(cat) => handleChange("category", cat)}
        />

        {/* Street */}
        <label className="text-[12px] font-medium mt-[8px] mb-[4px]">Street</label>
        <input
          type="text"
          value={localProfile.location.street}
          onChange={(e) => handleLocationChange("street", e.target.value)}
          className="w-full h-[32px] bg-[#EEEEEE] px-[12px] text-[12px] rounded-[4px]"
        />

        {/* District */}
        <label className="text-[12px] font-medium mt-[8px] mb-[4px]">District</label>
        <div
          onClick={() => setOpenDistrictModal(true)}
          className="w-full h-[32px] border border-black/30 rounded-[4px] px-[12px] flex justify-between items-center cursor-pointer"
        >
          <span className={`text-[12px] ${localProfile.location.district ? 'text-black' : 'text-black/50'}`}>
            {localProfile.location.district || "Select district"}
          </span>
          <ChevronDown size={16} className="text-black/50" />
        </div>

        {openDistrictModal && (
          <div
            className="fixed inset-0 bg-black/50 flex justify-center items-end z-50"
            onClick={() => setOpenDistrictModal(false)}
          >
            <div
              className="bg-white w-full rounded-t-[16px] max-h-[60vh] overflow-y-auto scrollbar-hide px-[16px] pb-[36px]"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-[14px] text-center font-semibold mb-[16px] pt-[24px] pb-2 sticky top-0 bg-white">
                Select District
              </h2>
              <div className="flex flex-col gap-[8px]">
                {abujaDistricts.map((area) => (
                  <button
                    key={area}
                    onClick={() => {
                      handleLocationChange("district", area);
                      setOpenDistrictModal(false);
                    }}
                    className={`text-[12px] px-[12px] py-[8px] text-left rounded-[4px] ${
                      localProfile.location.district === area
                        ? "bg-[#2A9CBC]/10 text-[#2A9CBC]"
                        : "bg-gray-100 text-black"
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
});

export default ProfileInfoForm;