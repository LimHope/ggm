import { Database } from './database.types'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type ProductImage = Database['public']['Tables']['product_images']['Row']

export type ProductWithImages = Product & {
  product_images: ProductImage[]
  profiles: Profile
}

export type ProductFormData = {
  title: string
  description: string
  price: number
  category: string
  location: string
}
