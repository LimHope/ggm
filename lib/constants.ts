export const CATEGORIES = [
  '디지털기기',
  '생활가전',
  '가구/인테리어',
  '생활/주방',
  '의류',
  '잡화',
  '도서',
  '기타',
] as const

export const PRODUCT_STATUS = {
  AVAILABLE: 'available',
  RESERVED: 'reserved',
  SOLD: 'sold',
} as const

export const MAX_IMAGE_COUNT = 10
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
export const MAX_AVATAR_SIZE = 2 * 1024 * 1024 // 2MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
