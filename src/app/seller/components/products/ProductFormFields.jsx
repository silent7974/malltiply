'use client'

import { useState } from 'react'
import { ChevronDown, RulerDimensionLine } from 'lucide-react'
import productCategoryMap from '@/lib/data/productCategoryMap'
import SizeGuide from '@/app/components/SizeGuide'
import { generateSKU } from '@/lib/utils/sku'


function CustomDropdown({ label, options, selected, onSelect, placeholder }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="w-full">
      {label && (
        <label className="block mt-[16px] text-[12px] font-[Inter] font-medium text-[#000000]">
          {label}
        </label>
      )}
      <div
        onClick={() => setOpen(true)}
        className="w-full mt-[4px] px-[12px] py-[10px] border border-black/30 rounded-[4px] text-[12px] font-[Inter] font-medium flex justify-between items-center cursor-pointer"
      >
        <span className={selected ? 'text-black' : 'text-black/50'}>
          {selected || placeholder}
        </span>
        <ChevronDown size={16} className="text-black/50" />
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-end z-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white w-full rounded-t-[16px] max-h-[60vh] overflow-y-auto scrollbar-hide px-[16px] py-[36px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-[14px] text-center font-[Inter] font-semibold mb-[16px]">
              Select {label}
            </h2>
            <div className="flex flex-col gap-[8px]">
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    onSelect(opt)
                    setOpen(false)
                  }}
                  className={`text-[12px] font-[Inter] px-[12px] py-[8px] text-left rounded-[4px] ${
                    selected === opt
                      ? 'bg-[#2A9CBC]/10 text-[#2A9CBC]'
                      : 'bg-gray-100 text-black'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ColorDropdown({ selected, onSelect }) {
  const [open, setOpen] = useState(false)
  const colors = [
    { name: 'Red', hex: '#B43232' },
    { name: 'Blue', hex: '#2E2B77' },
    { name: 'Green', hex: '#438260' },
    { name: 'Black', hex: '#292929' },
    { name: 'White', hex: '#ffffff' },
    { name: 'Custom', hex: null },
  ]

  const [customColor, setCustomColor] = useState('')

  return (
    <div className="w-full">
      <label className="block mt-[16px] text-[12px] font-[Inter] font-medium text-[#000000]">
        Color
      </label>
      <div
        onClick={() => setOpen(true)}
        className="w-full mt-[4px] px-[12px] py-[10px] border border-black/30 rounded-[4px] text-[12px] font-[Inter] font-medium flex justify-between items-center cursor-pointer"
      >
        <span className={selected ? 'text-black' : 'text-black/50'}>
          {selected || 'Select color'}
        </span>
        <ChevronDown size={16} className="text-black/50" />
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-end z-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white w-full rounded-t-[16px] max-h-[60vh] overflow-y-auto scrollbar-hide px-[16px] py-[36px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-[14px] text-center font-[Inter] font-semibold mb-[16px]">
              Select Color
            </h2>
            <div className="flex flex-col gap-[8px]">
              {colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => {
                    if (c.name === 'Custom') return
                    onSelect(c.name)
                    setOpen(false)
                  }}
                  className={`flex items-center gap-2 text-[12px] font-[Inter] px-[12px] py-[8px] text-left rounded-[4px] ${
                    selected === c.name
                      ? 'bg-[#2A9CBC]/10 text-[#2A9CBC]'
                      : 'bg-gray-100 text-black'
                  }`}
                >
                  {c.hex && (
                    <span
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: c.hex }}
                    ></span>
                  )}
                  {c.name}
                </button>
              ))}

              {/* Custom color input */}
              <div className="flex flex-col gap-2 mt-4">
                <input
                  type="text"
                  placeholder="Enter custom color name"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="border rounded p-2 text-[12px] font-[Inter]"
                />
                <button
                  onClick={() => {
                    if (customColor.trim()) {
                      onSelect(customColor)
                      setOpen(false)
                    }
                  }}
                  className="bg-[#2A9CBC] text-white rounded px-4 py-2 text-[12px] font-[Inter]"
                >
                  Save Custom Color
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProductFormFields({ 
  category, 
  subCategory,
  setSubCategory,
  subType, 
  setSubType,
  variants = {},
  setVariants,
  productData,           // ✅ we need productData here
  setProductData         // ✅ so we can update SKU
}) {

  const [showSizeGuide, setShowSizeGuide] = useState(false)

  if (!category) {
    return <p className="text-red-500">No seller category found.</p>
  }

  const categoryData = productCategoryMap[category]

  if (!categoryData) {
    return <p className="text-red-500">No product mapping found for {category}.</p>
  }

  const v = categoryData.variants

  // Different Sizes for shoes
  const activeSizes = (v.categorySizes && subCategory && v.categorySizes[subCategory]) 
    ? v.categorySizes[subCategory] 
    : v.sizes

  // ✅ Central SKU updater — called on any variant change
  function updateSKUWithVariants(newVariants) {
    setProductData(prev => ({
      ...prev,
      sku: generateSKU(prev.productName, newVariants, prev.quantity)
    }))
  }

  return (
    <div className="space-y-4">

      {/* Subcategory (first dropdown inside seller’s category) */}
      <CustomDropdown
        label="Subcategory"
        placeholder="Select subcategory"
        options={Object.keys(categoryData.categories)}
        selected={subCategory}
        onSelect={(val) => {
          setSubCategory(val)
          setSubType('') // reset deeper level
        }}
      />

      {/* Sub-Type (second dropdown, depends on subCategory) */}
      {subCategory && Array.isArray(categoryData.categories[subCategory]) && (
        <CustomDropdown
          label="Sub-Type"
          placeholder="Select sub-type"
          options={categoryData.categories[subCategory]}
          selected={subType}
          onSelect={(val) => setSubType(val)}
        />
      )}

      {/* Variants */}
      {subCategory && (
        <div className="mt-4 space-y-4">

          {/* ✅ Size Guide button only if this category supports sizes */}
          {activeSizes && (
            <>
              <div className="flex justify-end mb-1">
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="flex items-center justify-center gap-[2px] w-[115px] h-[24px] rounded-[16px] bg-[#EEEEEE] px-[8px]"
                >
                  <RulerDimensionLine size={16} className="text-black" />
                  <span className="text-[16px] font-inter text-black">
                    Size Guide
                  </span>
                </button>
              </div>

              <CustomDropdown
                label="Size"
                placeholder="Select size"
                options={activeSizes}
                selected={variants.size || ''}
                onSelect={(val) => {
                  const updated = { ...variants, size: val }
                  setVariants(updated)
                  updateSKUWithVariants(updated)  // ✅ recompute SKU
                }}
              />
            </>
          )}

          {v.measurement && (
            <div>
              <label className="block mb-1 font-medium text-[12px] font-[Inter]">
                Measurement ({v.measurement})
              </label>
              <input
                type="number"
                className="border rounded p-2 w-full text-[12px] font-[Inter]"
                placeholder={`Enter ${v.measurement}`}
                value={variants.measurement || ''}
                onChange={(e) =>
                  setVariants({ ...variants, measurement: e.target.value })
                }
              />
            </div>
          )}

          {v.colors && (
            <ColorDropdown
              selected={variants.color || ''}
              onSelect={(val) => {
                const updated = { ...variants, color: val }
                setVariants(updated)
                updateSKUWithVariants(updated)  // ✅ recompute SKU
              }}
            />
          )}
        </div>
      )}
      {/* 🔥 Size Guide Modal Placeholder */}
      {showSizeGuide && (
        <SizeGuide onClose={() => setShowSizeGuide(false)} />
      )}
    </div>
  )
}