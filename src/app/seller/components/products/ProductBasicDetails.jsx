import { generateSKU } from "@/lib/utils/sku";

export default function ProductBasicDetails({ productData, setProductData }) {

  function handleDescriptionChange(e) {
    if (e.target.value.length <= 180) {
      setProductData(prev => ({ ...prev, description: e.target.value }));
    }
  }

  function updateSKU(name, quantity) {
    setProductData(prev => ({
      ...prev,
      sku: generateSKU(name, {}, quantity) // ✅ pass variants {} & quantity
    }));
  } 

  return (
    <form className="max-w-md mt-[24px]">
      {/* Product Name */}
      <label htmlFor="productName" className="block text-black text-[16px] font-inter font-normal mb-2">
        Product name
      </label>
      <input
        id="productName"
        type="text"
        placeholder="Getzner Shadda - Prestige Edition"
        value={productData.productName ?? ''}
        onChange={(e) => {
          const newName = e.target.value;

          setProductData(prev => ({
            ...prev,
            productName: newName,
          }));
          updateSKU(newName, productData.quantity); // ✅ keep SKU live
        }}

        className="w-full h-[36px] rounded-[4px] border border-black/30 px-2 text-black text-[12px] font-inter placeholder-black/50"
      />

        {/* Price */}
        <div className="flex-1 flex flex-col">
          <label htmlFor="price" className="block text-black text-[16px] font-inter font-normal mb-2">
            Price
          </label>
          <div className="flex items-center h-[36px] rounded-[4px] border border-black/30 px-2">
            <span className="text-black font-medium select-none">₦</span>
            <input
              id="price"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={productData.price || ''}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/[^0-9]/g, '')
                const priceNum = Number(rawValue || 0)
                setProductData(prev => ({ ...prev, price: priceNum }))
              }}
              className="flex-1 h-full border-none focus:outline-none text-black text-[12px] font-inter placeholder-black/50 ml-1"
            />
          </div>
        </div>

      {/* Quantity */}
      <div className="flex-1 flex flex-col mt-4">
        <label htmlFor="quantity" className="block text-black text-[16px] font-inter font-normal mb-2">
          Quantity
        </label>
        <div className="flex items-center h-[36px] rounded-[4px] border border-black/30 px-2">
          <input
            id="quantity"
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={productData.quantity ?? '' }
            onChange={(e) => {
              const value = Number(e.target.value.replace(/\D/g, '') || 0);
              setProductData(prev => ({ ...prev, quantity: value }));
              updateSKU(productData.productName, value); // ✅ keep SKU live
            }}
            className="flex-1 h-full border-none focus:outline-none text-black text-[12px] font-inter placeholder-black/50 ml-1"
          />
        </div>
      </div>

      {/* Description */}
      <label htmlFor="description" className="block text-black text-[16px] font-inter font-normal mt-[16px] mb-2">
        Product description
      </label>
      <textarea
        id="description"
        placeholder={`Original Getzner shadda with a rich texture and smooth finish. Ideal for traditional wear and special events.`}
        value={productData.description ?? ''}
        onChange={handleDescriptionChange}
        rows={6}
        style={{ resize: 'none' }}
        className="w-full rounded-[4px] border border-black/30 px-2 py-1 text-black text-[12px] font-inter placeholder-black/50"
      />

      {/* Character count */}
      <p className="text-black/50 text-[8px] font-inter mt-1 text-right">
        {(productData.description || '').length} / 180
      </p>
    </form>
  );
}