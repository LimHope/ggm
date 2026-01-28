'use client'

import { useProducts } from '@/hooks/useProducts'
import ProductGrid from '@/components/products/ProductGrid'

export default function Home() {
  const { products, loading } = useProducts()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">중고거래</h1>
        <p className="text-gray-600 mt-1">우리 동네의 따뜻한 거래</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  )
}
