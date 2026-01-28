'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import ImageUpload from './ImageUpload'
import { useImageUpload } from '@/hooks/useImageUpload'
import { createProduct } from '@/hooks/useProducts'
import { ProductFormData } from '@/types'
import { CATEGORIES } from '@/lib/constants'

export default function ProductForm() {
  const router = useRouter()
  const { images, previews, loading: imageLoading, error: imageError, addImages, removeImage } = useImageUpload()

  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    price: 0,
    category: '',
    location: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate price
    const price = parseInt(String(formData.price), 10)
    if (isNaN(price) || price < 0) {
      setError('올바른 가격을 입력해주세요.')
      return
    }

    if (price === 0) {
      setError('가격을 입력해주세요.')
      return
    }

    if (price > 1000000000) {
      setError('가격은 10억원을 초과할 수 없습니다.')
      return
    }

    setLoading(true)

    try {
      const validatedFormData = {
        ...formData,
        price: price, // Ensure price is a proper integer
      }

      const result = await createProduct(validatedFormData, images)

      if (result.success && result.productId) {
        router.push(`/products/${result.productId}`)
      } else {
        setError(result.error || '상품 등록에 실패했습니다.')
      }
    } catch (err) {
      setError('상품 등록 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          상품 이미지 <span className="text-gray-500 font-normal">(선택사항)</span>
        </label>
        <ImageUpload
          previews={previews}
          onAdd={addImages}
          onRemove={removeImage}
          loading={imageLoading}
          error={imageError}
        />
      </div>

      {/* Title */}
      <Input
        label="제목"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
        placeholder="상품 제목을 입력하세요"
        maxLength={100}
      />

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          카테고리
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
        >
          <option value="">카테고리를 선택하세요</option>
          {CATEGORIES.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
          가격 (원)
        </label>
        <input
          id="price"
          name="price"
          type="text"
          inputMode="numeric"
          value={formData.price === 0 ? '' : formData.price.toLocaleString('ko-KR')}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, '')
            const numValue = value ? parseInt(value, 10) : 0

            // 최대 10억원 제한
            if (numValue <= 1000000000) {
              setFormData(prev => ({
                ...prev,
                price: numValue
              }))
            }
          }}
          required
          placeholder="예: 50,000"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
        />
        <p className="mt-1 text-sm text-gray-500">
          최대 10억원까지 입력 가능 {formData.price > 0 && `(${formData.price.toLocaleString('ko-KR')}원)`}
        </p>
      </div>

      {/* Location */}
      <Input
        label="거래 지역"
        name="location"
        value={formData.location}
        onChange={handleChange}
        required
        placeholder="예: 서울시 강남구"
        maxLength={100}
      />

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          상품 설명
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={8}
          placeholder="상품에 대해 자세히 설명해주세요"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent resize-none"
        />
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="flex-1"
          disabled={loading}
        >
          취소
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={loading || imageLoading}
        >
          {loading ? '등록 중...' : '등록하기'}
        </Button>
      </div>
    </form>
  )
}
