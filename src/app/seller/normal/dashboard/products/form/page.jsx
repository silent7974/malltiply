'use client'

import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'    // 👈 import the icon
import { useAddProductMutation, useUpdateProductMutation, useDeleteProductMutation } from '@/redux/services/productApi'
import { useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { resetCurrentProduct } from '@/redux/slices/productSlice'
import ProductBasicDetails from '@/app/seller/components/products/ProductBasicDetails'
import ProductFormFields from '@/app/seller/components/products/ProductFormFields'
import ProductVariantEditor from '@/app/seller/components/products/ProductVariantEditor'
import MultiImageUpload from '@/app/seller/components/products/MultiImageUpload'

function ProductFormProgress({ progress, total }) {
  const percentage = (progress / total) * 100
  return (
    <div className="w-full max-w-md mx-auto my-4">
      <div className="w-full" style={{ backgroundColor: '#E6ECED', height: 4, borderRadius: 32 }}>
        <div
          style={{
            width: `${percentage}%`,
            backgroundColor: '#2A9CBC',
            height: 4,
            borderRadius: 32,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <div className="mt-1 text-[10px] font-inter text-[#2A9CBC] font-regular">
        {progress} / {total} required fields completed
      </div>
    </div>
  )
}

export default function ProductFormLayout() {
  const router = useRouter()
  const dispatch = useDispatch()
  const category = useSelector((state) => state.sellerProfile.category)
  const currentProduct = useSelector((state) => state.product.current)
  const sellerType = useSelector(s => s.sellerProfile.sellerType);

  const [productImages, setProductImages] = useState([])

  const [productData, setProductData] = useState({
    productName: currentProduct?.productName || '',
    subCategory: currentProduct?.subCategory || '',
    subType: currentProduct?.subType || '',
    price: currentProduct?.price || 0,
    quantity: currentProduct?.quantity || 0,
    description: currentProduct?.description || '',
  })

  const [subCategory, setSubCategory] = useState(currentProduct?.subCategory || '')
  const [subType, setSubType] = useState(currentProduct?.subType || '')
  const [variants, setVariants] = useState(currentProduct?.variants || {})
  const [variantColumns, setVariantColumns] = useState(currentProduct?.variantColumns || [])

  const [addProduct, { isLoading: adding }] = useAddProductMutation()
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation()
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation()

  useEffect(() => {
    if (!currentProduct) return

    setProductData({
      productName: currentProduct.productName || '',
      subCategory: currentProduct.subCategory || '',
      subType: currentProduct.subType || '',
      price: currentProduct.price || 0,
      quantity: currentProduct.quantity || 0,
      description: currentProduct.description || '',
    })

    setSubCategory(currentProduct.subCategory || '')
    setSubType(currentProduct.subType || '')
    setVariants(currentProduct.variants || {})
    setVariantColumns(currentProduct.variantColumns || [])
    setProductImages(currentProduct.images || [])
  }, [currentProduct])

  const requiredFieldsTotal = 5
  const requiredFieldsCompleted = (() => {
    let count = 0
    if (productImages.length > 0) count++
    if (productData.productName.trim() !== '') count++
    if (Number(productData.price) > 0) count++
    if (Number(productData.quantity) > 0) count++
    if (subCategory.trim() !== '') count++
    return count
  })()

  const handleSubmit = async () => {
    if (requiredFieldsCompleted < requiredFieldsTotal) return

    try {
      // ---- images
      const newImages = productImages.filter(img => img.file)
      const existingImages = productImages.filter(img => !img.file)

      const uploadedImages = await Promise.all(
        newImages.map(img => uploadImageToCloudinary(img.file))
      )

      const finalImages = [
        ...existingImages,
        ...uploadedImages.map(u => ({
          url: u.secure_url,
          public_id: u.public_id,
        })),
      ]

      const dataToSubmit = {
        ...productData,
        category,
        subCategory,
        subType,
        variants,
        variantColumns,
        images: finalImages,
      }

      if (currentProduct?._id) {
        await updateProduct({ id: currentProduct._id, ...dataToSubmit }).unwrap()
      } else {
        await addProduct(dataToSubmit).unwrap()
      }

      router.push('/seller/normal/dashboard/products')
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async () => {
    if (!currentProduct?._id) return
    if (!confirm('Are you sure you want to delete this product permanently?')) return

    try {
      await deleteProduct(currentProduct._id).unwrap()
      dispatch(resetCurrentProduct())
      router.push('/seller/normal/dashboard/products')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="mb-[40px]">
      <div className="mt-6 flex items-center justify-between">
        <h1 className="font-montserrat font-medium text-[20px] text-[#000]">
          {currentProduct?._id ? 'Edit Product' : 'Add a Product'}
        </h1>

        {currentProduct?._id && (
          <Trash2
            size={28}
            color="#474545"
            className="cursor-pointer"
            onClick={handleDelete}
          />
        )}
      </div>

      <p className="font-montserrat font-medium text-[16px] text-black/50 mt-1">{category}</p>

      <MultiImageUpload
        productImages={productImages}
        onImagesChange={setProductImages}
        maxImages={sellerType === 'normal_seller' ? 6 : 10 }
      />

      <ProductBasicDetails
        productData={productData}
        setProductData={setProductData}
        category={category}
      />

      <ProductFormFields
        category={category}
        subCategory={subCategory}
        setSubCategory={setSubCategory}
        subType={subType}
        setSubType={setSubType}
        productData={productData}
        setProductData={setProductData}
        variants={variants}
        setVariants={setVariants}
      />

      <ProductVariantEditor
        productName={productData.productName}
        category={category}
        subCategory={subCategory}
        basePrice={Number(productData.price)}
        baseQuantity={Number(productData.quantity)}
        baseVariants={variants}
        variantColumns={variantColumns}
        setVariantColumns={setVariantColumns}
        onChange={setVariantColumns}
        maxVariants={5}
      />

      <ProductFormProgress progress={requiredFieldsCompleted} total={requiredFieldsTotal} />

      <button
        type="button"
        disabled={requiredFieldsCompleted < requiredFieldsTotal || adding || updating}
        onClick={handleSubmit}
        className={`w-full h-[36px] rounded-[4px] bg-[#005770] flex items-center justify-center gap-2 mt-4
          ${requiredFieldsCompleted < requiredFieldsTotal || adding || updating ? 'opacity-60 cursor-not-allowed' : 'opacity-100 cursor-pointer'}
        `}
      >
        <span className="font-inter font-semibold text-[12px] text-white">
          Save Product
        </span>
        <img src="/thumbs-up.svg" alt="Thumbs up" width={16} height={16} />
      </button>
    </div>
  )
}

// helper for uploading new images
async function uploadImageToCloudinary(file) {

  const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'ags_unsigned_upload')
  formData.append('folder', 'ags/products')

  const response = await fetch(url, { method: 'POST', body: formData })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error('Cloudinary upload failed: ' + (errorData.error?.message || response.statusText))
  }
  return response.json()
}