"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setStoreCategories } from "@/redux/slices/storeSlice";
import CategoryChip from "./CategoryChip";
import { useGetProductsQuery } from "@/redux/services/productApi";

export default function AddCategoryModal({ onClose }) {
  const dispatch = useDispatch();

  const draft = useSelector((s) => s.store.categories);

  const [selected, setSelected] = useState(
    [...draft.suggested, ...draft.fromProducts]
  )

  const { data: products = [], isLoading } = useGetProductsQuery();

  const productBasedCategories = useMemo(() => {
    if (!products.length) return [];

    const counts = {};

    products.forEach(p => {
      if (!p.subCategory) return;
      counts[p.subCategory] = (counts[p.subCategory] || 0) + 1;
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1]) // most common first
      .slice(0, 3)
      .map(([name]) => name);
  }, [products]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  function addCategory(label) {
    if (selected.includes(label)) return;
    if (selected.length >= 3) return;

    setSelected(prev => [...prev, label]);
  }

  function removeCategory(label) {
    setSelected(prev => prev.filter(c => c !== label));
  }

  function removeCategory(label) {
    setSelected(selected.filter((c) => c !== label));
  }

  function handleSave() {
    dispatch(
      setStoreCategories({
       suggested: [],
       fromProducts: selected,
        
      })
    )
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-40">
        <div
          onClick={onClose}
          className="absolute inset-0 bg-black/30"
        />

        <motion.div
          className="fixed bottom-0 left-0 right-0 z-50
          bg-white rounded-t-[24px]"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
        >
          {/* Header */}
          <div className="h-[56px] bg-[#F8F9FA] border-b border-black/20
            flex items-center justify-center rounded-t-[24px]">
            <p className="font-inter font-medium text-[18px]">
              Add a Category
            </p>
          </div>

          {/* Body */}
          <div className="px-4 pb-[120px]">

            <p className="mt-[20px] font-inter font-medium text-[16px]">
              From your products
            </p>

            {!productBasedCategories.length ? (
              <p className="mt-[8px] text-[14px] text-black/60 font-inter">
                Add at least one product to create categories.
              </p>
            ) : (
              <div className="mt-[8px] flex flex-wrap gap-[8px]">
                {productBasedCategories
                  .filter(c => !selected.includes(c))
                  .map(label => (
                    <CategoryChip
                      key={label}
                      label={label}
                      icon={selected.length >= 3 ? "none" : "plus"}
                      disabled={selected.length >= 3}
                      onClick={() => addCategory(label)}
                    />
                  ))}
              </div>
            )}

            {/* Selected Block */}
            <div
              className="mt-[20px] w-full
              rounded-[24px]
              border border-black/30
              p-4
              flex flex-wrap gap-[8px]"
            >
              {selected.map((label) => (
                <CategoryChip
                  key={label}
                  label={label}
                  icon="x"
                  onClick={() => removeCategory(label)}
                />
              ))}
            </div>
          </div>

          {/* Save */}
          <div
            className="fixed bottom-0 left-0 right-0 h-[56px]
            bg-[#F8F9FA] px-4 border-t border-black/20 flex items-center"
          >
            <button
              onClick={handleSave}
              className="w-full h-[40px] rounded-[4px]
              bg-[#2A9CBC] text-white
              font-inter font-semibold text-[16px]"
            >
              Save Categories
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}