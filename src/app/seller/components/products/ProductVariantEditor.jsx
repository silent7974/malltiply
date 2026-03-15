'use client'

import { useState, useEffect, useMemo } from 'react'
import { Plus, Trash2Icon } from 'lucide-react'
import productCategoryMap from '@/lib/data/productCategoryMap'
import { generateSKU } from '@/lib/utils/sku'
import formatPrice from '@/lib/utils/formatPrice'

/* ---------- Custom Select Dropdown ---------- */
function CustomCellDropdown({ label, options = [], selected, onSelect, placeholder = 'Select' }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="w-full">
      <div
        onClick={() => setOpen(true)}
        className="w-full px-3 py-2 border border-black/20 rounded text-[12px] font-inter flex justify-between items-center cursor-pointer bg-white"
      >
        <span className={selected ? 'text-black' : 'text-black/50'}>{selected || placeholder}</span>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-end z-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white w-full rounded-t-[16px] max-h-[60vh] overflow-y-auto scrollbar-hide px-4 py-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[14px] font-inter font-semibold mb-3">{label}</h3>
            <div className="flex flex-col gap-2">
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    onSelect(opt)
                    setOpen(false)
                  }}
                  className={`text-[13px] text-left px-3 py-2 rounded ${
                    selected === opt ? 'bg-[#2A9CBC]/10 text-[#2A9CBC]' : 'bg-gray-100 text-black'
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

/* ---------- Color Picker Dropdown ---------- */
function ColorPickerDropdown({ selected, onSelect }) {
  const [open, setOpen] = useState(false)
  const colors = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Blue', hex: '#2A9CBC' },
    { name: 'Green', hex: '#00A859' },
    { name: 'Red', hex: '#FF0000' },
    { name: 'Yellow', hex: '#FFD700' },
    { name: 'Pink', hex: '#FFC0CB' },
    { name: 'Purple', hex: '#7B00C3' },
    { name: 'Custom', hex: null },
  ]
  const [custom, setCustom] = useState('')

  return (
    <div>
      <div
        onClick={() => setOpen(true)}
        className="w-full px-3 py-2 border border-black/20 rounded text-[12px] font-inter flex justify-between items-center cursor-pointer bg-white"
      >
        <span className={selected ? 'text-black' : 'text-black/50'}>{selected || 'Select color'}</span>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-end z-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white w-full rounded-t-[16px] max-h-[60vh] overflow-y-auto scrollbar-hide px-4 py-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[14px] font-inter font-semibold mb-3">Select Color</h3>
            <div className="flex flex-col gap-2">
              {colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => {
                    if (c.name === 'Custom') return
                    onSelect(c.name)
                    setOpen(false)
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded ${
                    selected === c.name ? 'bg-[#2A9CBC]/10 text-[#2A9CBC]' : 'bg-gray-100 text-black'
                  }`}
                >
                  {c.hex && <span className="w-6 h-6 rounded-full border" style={{ backgroundColor: c.hex }} />}
                  <span className="text-[13px]">{c.name}</span>
                </button>
              ))}
              <div className="mt-3 flex gap-2">
                <input
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  placeholder="Custom color name"
                  className="flex-1 border rounded px-3 py-2 text-[13px]"
                />
                <button
                  onClick={() => {
                    if (!custom.trim()) return
                    onSelect(custom.trim())
                    setCustom('')
                    setOpen(false)
                  }}
                  className="bg-[#2A9CBC] text-white px-3 rounded"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProductVariantEditor({
  productName = '',
  category = '',
  subCategory = '',
  basePrice = 0,
  baseQuantity = 0,
  baseVariants = {},
  maxVariants,
  variantColumns = [],
  setVariantColumns,
  onChange,
  sellerType
}) {
  const [open, setOpen] = useState(false)

  const categoryData = productCategoryMap?.[category] || productCategoryMap?.[subCategory] || null
  const productMapping = productCategoryMap?.[subCategory] || categoryData

  const rows = useMemo(() => {
    const list = []
    const v = productMapping?.variants || {}

    // ✅ Resolve correct sizes — use categorySizes override if available for this subCategory
    const activeSizes = (v.categorySizes && subCategory && v.categorySizes[subCategory])
      ? v.categorySizes[subCategory]
      : v.sizes

    if (v.colors) list.push({ key: 'color', label: 'Color', type: 'select' })
    if (activeSizes) list.push({ key: 'size', label: 'Size', type: 'select', options: activeSizes }) // ← was v.sizes
    if (v.measurement) list.push({ key: 'measurement', label: `${v.measurement}`, type: 'number' })

    list.push({ key: 'quantity', label: 'Quantity', type: 'number' })
    list.push({ key: 'price', label: 'Price', type: 'price' })
    list.push({ key: 'sku', label: 'SKU', type: 'sku' })

    return list
  }, [productMapping, subCategory])

  function makeEmptyColumn() {
    const obj = {}
    rows.forEach((r) => {
      obj[r.key] = ''
    })
    obj.quantity = Number(baseQuantity || 0)
    obj.price = Number(basePrice || 0 )
    obj.sku = generateSKU(productName, obj, obj.quantity)
    return obj
  }

  function addColumn() {
    if (variantColumns.length >= maxVariants) return
    setVariantColumns([...variantColumns, makeEmptyColumn()])
  }

  function removeColumn(idx) {
    setVariantColumns(variantColumns.filter((_, i) => i !== idx))
  }

  function updateCell(colIdx, key, value) {
    const next = variantColumns.map((col, i) => {
      if (i !== colIdx) return col
      const updated = { ...col, [key]: value }
      updated.sku = generateSKU(productName, updated, updated.quantity)
      return updated
    })
    setVariantColumns(next)
  }

  useEffect(() => {
    const next = variantColumns.map((col) => {
      const updated = { ...col }
      updated.price = updated.price || Number(basePrice || 0)
      updated.quantity = updated.quantity || Number(baseQuantity || 0)
      updated.sku = generateSKU(productName, updated, updated.quantity)
      return updated
    })
    setVariantColumns(next)
  }, [basePrice, baseQuantity, productName])

  useEffect(() => {
    if (onChange) onChange(variantColumns)
  }, [variantColumns, onChange])

  return (
    <div>
      <div className="block text-black text-[16px] font-montserrat font-normal my-[16px]">
        Does this product have variants?
      </div>

      <div
        className="w-full h-[38px] rounded-[2px] bg-[#18331B]/10 px-4 cursor-pointer flex items-center justify-between"
        onClick={() => setOpen((s) => !s)}
      >
        <div className="flex items-center gap-4">
          <div className={`transition-transform duration-200 ${open ? 'rotate-45' : 'rotate-0'}`}>
            <Plus size={16} color="#18331B" />
          </div>
          <div className="text-[16px] font-inter font-normal text-[#18331B]">
            Add Variant Combination
          </div>
        </div>
      </div>

      <div className={`overflow-hidden transition-[max-height] duration-300 ${open ? 'max-h-[900px] mt-3' : 'max-h-0'}`}>
        <div className="mt-3 pb-4 bg-white rounded-md shadow-sm">
          <div className="flex items-center justify-between px-2 py-2">
            <div className="text-[13px] font-inter text-black/70">
              Variants: {variantColumns.length} / {maxVariants}
            </div>
            <button
              onClick={addColumn}
              disabled={variantColumns.length >= maxVariants}
              className="bg-[#2A9CBC] text-white px-3 py-1 rounded text-[13px] disabled:opacity-50"
            >
              + Add
            </button>
          </div>

          <div className="overflow-x-auto scrollbar-hide ">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-[12px] font-inter px-3 py-2 border-b">Attribute</th>
                  <th className="text-left text-[12px] font-inter px-3 py-2 border-b">Main</th>
                  {variantColumns.map((_, colIdx) => (
                    <th key={colIdx} className="text-left text-[12px] font-inter px-3 py-2 border-b">
                      Variant {colIdx + 1}
                      <button onClick={() => removeColumn(colIdx)} className="ml-1 text-red-500">
                        <Trash2Icon
                        width={16}
                        height={16}
                      />
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => (
                  <tr key={row.key}>
                    <td className="px-3 py-2 align-top text-[13px] font-inter border-b">{row.label}</td>
                    <td className="px-3 py-2 align-top border-b">
                      {/* main product values */}
                      {row.key === 'quantity' && baseQuantity}
                      {row.key === 'price' && <>₦{formatPrice((basePrice))}</>}
                      {row.key === 'sku' && <div className="text-black/60 text-[12px] ">{generateSKU(productName, baseVariants, baseQuantity)}</div>}
                      {row.type === 'select' && baseVariants[row.key] ? baseVariants[row.key] : ' '}
                      {row.type === 'number' && row.key === 'measurement' && baseVariants.measurement ? baseVariants.measurement : ' '}
                    </td>

                    {variantColumns.map((col, colIdx) => (
                      <td key={colIdx} className="px-3 py-2 align-top border-b">
                        {row.type === 'select' && row.key === 'color' ? (
                          <ColorPickerDropdown selected={col.color} onSelect={(v) => updateCell(colIdx, 'color', v)} />
                        ) : row.type === 'select' ? (
                          <CustomCellDropdown
                            label={row.label}
                            options={row.options || []}
                            selected={col[row.key]}
                            onSelect={(v) => updateCell(colIdx, row.key, v)}
                            placeholder={`Select ${row.label}`}
                          />
                        ) : row.type === 'number' && row.key === 'measurement' ? (
                          <input
                            type="text"
                            value={col.measurement || ''}
                            onChange={(e) => updateCell(colIdx, 'measurement', e.target.value.replace(/\D/g, ''))}
                            className="w-full px-3 py-2 border rounded text-[13px]"
                          />
                        ) : row.type === 'number' && row.key === 'quantity' ? (
                          <input
                            type="text"
                            value={col.quantity || ''}
                            onChange={(e) => updateCell(colIdx, 'quantity', Number(e.target.value.replace(/\D/g, '')))}
                            className="w-full px-3 py-2 border rounded text-[13px]"
                          />
                        ) : row.type === 'price' ? (
                          <input
                            type="text"
                            value={formatPrice(col.price || '')}
                            onChange={(e) => updateCell(colIdx, 'price', Number(e.target.value.replace(/[^0-9]/g, '')))}
                            className="w-full px-3 py-2 border rounded text-[13px]"
                          />
                        ) : row.type === 'sku' ? (
                          <div className="text-[12px]">{col.sku || generateSKU(productName, col)}</div>
                        ) : null}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-3 py-3">
            <p className="text-[12px] text-black/60">SKU format: FIRST3(Product) - FIRST3(Var1) - FIRST3(Var2) - qty </p>
            {sellerType !== 'premium_seller' && (
              <p className="text-[12px] font-inter font-normal text-black/50 mt-[4px] leading-tight">
                To add more variants upgrade to premium seller
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}