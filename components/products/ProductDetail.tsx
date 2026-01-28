'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { MapPin, Clock, Eye, User, Edit, Trash2 } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { ProductWithImages } from '@/types'
import { formatPrice, formatRelativeTime, getImageUrl } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { deleteProduct } from '@/hooks/useProducts'
import { useAuth } from '@/hooks/useAuth'

interface ProductDetailProps {
  product: ProductWithImages
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [deleting, setDeleting] = useState(false)

  const isOwner = user?.id === product.user_id

  const handleDelete = async () => {
    if (!confirm('정말 이 상품을 삭제하시겠습니까?')) return

    setDeleting(true)
    const result = await deleteProduct(product.id)

    if (result.success) {
      router.push('/')
    } else {
      alert(result.error || '삭제에 실패했습니다.')
      setDeleting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Slider */}
        <div>
          <Card className="overflow-hidden">
            {product.product_images && product.product_images.length > 0 ? (
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                className="aspect-square"
              >
                {product.product_images.map((img, index) => (
                  <SwiperSlide key={img.id}>
                    <div className="relative w-full h-full">
                      <Image
                        src={getImageUrl(img.image_url)}
                        alt={`${product.title} ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={index === 0}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4">📦</div>
                  <p className="text-lg text-gray-500 font-medium">등록된 이미지가 없습니다</p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <Card className="p-6">
            {/* Status Badge */}
            {product.status !== 'available' && (
              <div className="mb-4">
                <span className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                  {product.status === 'reserved' ? '예약중' : '판매완료'}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {product.title}
            </h1>

            {/* Category */}
            <p className="text-sm text-gray-500 mb-4">{product.category}</p>

            {/* Price */}
            <p className="text-3xl font-bold text-primary-700 mb-6">
              {formatPrice(product.price)}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6 pb-6 border-b">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{product.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatRelativeTime(product.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>조회 {product.view_count}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">상품 설명</h2>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Owner Actions */}
            {isOwner && (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push(`/products/${product.id}/edit`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  수정
                </Button>
                <Button
                  variant="danger"
                  className="flex-1"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {deleting ? '삭제 중...' : '삭제'}
                </Button>
              </div>
            )}
          </Card>

          {/* Seller Info */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">판매자 정보</h2>
            <div className="flex items-center gap-3">
              {product.profiles.avatar_url ? (
                <img
                  src={getImageUrl(product.profiles.avatar_url)}
                  alt={product.profiles.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900">
                  {product.profiles.username}
                </p>
                {product.profiles.location && (
                  <p className="text-sm text-gray-600">{product.profiles.location}</p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
