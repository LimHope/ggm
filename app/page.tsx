'use client'

import { useState } from 'react'
import { useProducts } from '@/hooks/useProducts'
import ProductGrid from '@/components/products/ProductGrid'
import { CATEGORIES } from '@/lib/constants'

export default function Home() {
  const { products, loading } = useProducts()
  const [selectedCategory, setSelectedCategory] = useState<string>('전체')

  // Filter products by category
  const filteredProducts = selectedCategory === '전체'
    ? products
    : products.filter(product => product.category === selectedCategory)

  const allCategories = ['전체', ...CATEGORIES]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">중고거래</h1>
        <p className="text-gray-600 mt-1">우리 동네의 따뜻한 거래</p>
      </div>

      {/* Category Filter */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-2 pb-2">
          {allCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {category}
              {category !== '전체' && (
                <span className="ml-1.5 text-xs opacity-75">
                  ({products.filter(p => p.category === category).length})
                </span>
              )}
              {category === '전체' && (
                <span className="ml-1.5 text-xs opacity-75">
                  ({products.length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-600">
            {selectedCategory === '전체'
              ? `전체 ${products.length}개의 상품`
              : `${selectedCategory} ${filteredProducts.length}개의 상품`}
          </div>
          <ProductGrid products={filteredProducts} />
        </>
      )}
    </div>
  )
}
