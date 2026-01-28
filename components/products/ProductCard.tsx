import Link from 'next/link'
import Image from 'next/image'
import { Clock, MapPin, Eye } from 'lucide-react'
import Card from '@/components/ui/Card'
import { ProductWithImages } from '@/types'
import { formatPrice, formatRelativeTime, getImageUrl } from '@/lib/utils'

interface ProductCardProps {
  product: ProductWithImages
}

export default function ProductCard({ product }: ProductCardProps) {
  const firstImage = product.product_images?.[0]
  const hasImage = firstImage && firstImage.image_url

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
        <div className="aspect-square relative bg-gray-100">
          {hasImage ? (
            <Image
              src={getImageUrl(firstImage.image_url)}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="text-center">
                <div className="text-6xl mb-2">📦</div>
                <p className="text-sm text-gray-400">이미지 없음</p>
              </div>
            </div>
          )}
          {product.status !== 'available' && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white px-4 py-2 rounded-full font-semibold text-gray-900">
                {product.status === 'reserved' ? '예약중' : '판매완료'}
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
            {product.title}
          </h3>
          <p className="text-xl font-bold text-primary-700 mt-1">
            {formatPrice(product.price)}
          </p>
          <div className="flex items-center gap-3 mt-3 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1">{product.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatRelativeTime(product.created_at)}</span>
            </div>
          </div>
          {product.view_count > 0 && (
            <div className="flex items-center gap-1 mt-2 text-sm text-gray-400">
              <Eye className="w-4 h-4" />
              <span>{product.view_count}</span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}
