"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useGetStoreBySlugQuery } from "@/redux/services/storeApi"
import StoreMedia from "@/app/components/stores/StoreMedia"
import StoreHeader from "@/app/components/stores/StoreHeader"
import StoreCategories from "@/app/components/stores/StoreCategories"
import StoreStory from "@/app/components/stores/StoreStory"
import StoreFooter from "@/app/components/stores/StoreFooter"

export default function StoreView() {
  const router = useRouter()
  const { slug } = useParams()

  const { data: store, isLoading, error } = useGetStoreBySlugQuery(slug)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (isLoading) return <p>Loading store...</p>
  if (error || !store) return <p>Store not found</p>

  return (
    <div>
      <StoreHeader store={store} />
      <StoreMedia store={store} />
      <StoreCategories store={store} />
      <StoreStory store={store} />
      <StoreFooter store={store} />
    </div>
  )
}