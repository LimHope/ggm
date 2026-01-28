'use client'

import { use } from 'react'
import { useProduct } from '@/hooks/useProducts'
import ProductDetail from '@/components/products/ProductDetail'

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { product, loading } = useProduct(id)

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">상품을 찾을 수 없습니다</h1>
        <p className="text-gray-600">삭제되었거나 존재하지 않는 상품입니다.</p>
      </div>
    )
  }

  return <ProductDetail product={product} />
}
