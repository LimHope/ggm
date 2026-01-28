'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ProductWithImages, ProductFormData } from '@/types'

export function useProducts() {
  const [products, setProducts] = useState<ProductWithImages[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_images(*), profiles(*)')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      setProducts(data as ProductWithImages[])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return { products, loading, refetch: fetchProducts }
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<ProductWithImages | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, product_images(*), profiles(*)')
          .eq('id', id)
          .single()

        if (error) {
          console.error('Supabase error:', error)
          throw error
        }

        // Increment view count
        await supabase
          .from('products')
          .update({ view_count: (data.view_count || 0) + 1 })
          .eq('id', id)

        setProduct(data as ProductWithImages)
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  return { product, loading }
}

export async function createProduct(
  formData: ProductFormData,
  imageFiles: File[]
): Promise<{ success: boolean; productId?: string; error?: string }> {
  const supabase = createClient()

  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('로그인이 필요합니다.')

    // Create product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        ...formData,
        user_id: user.id,
      })
      .select()
      .single()

    if (productError) throw productError

    // Upload images
    if (imageFiles.length > 0) {
      const imagePromises = imageFiles.map(async (file, index) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/${product.id}/${Date.now()}-${index}.${fileExt}`

        const { error: uploadError, data } = await supabase.storage
          .from('product-images')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        // Save image URL to database
        const imageUrl = `product-images/${fileName}`
        return supabase.from('product_images').insert({
          product_id: product.id,
          image_url: imageUrl,
          display_order: index,
        })
      })

      await Promise.all(imagePromises)
    }

    return { success: true, productId: product.id }
  } catch (error: any) {
    console.error('Error creating product:', error)
    return { success: false, error: error.message }
  }
}

export async function updateProduct(
  productId: string,
  formData: ProductFormData,
  newImageFiles: File[],
  existingImageUrls: string[]
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('로그인이 필요합니다.')

    // Update product
    const { error: updateError } = await supabase
      .from('products')
      .update(formData)
      .eq('id', productId)
      .eq('user_id', user.id)

    if (updateError) throw updateError

    // Delete removed images
    const { data: currentImages } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', productId)

    const imagesToDelete = currentImages?.filter(
      img => !existingImageUrls.includes(img.image_url)
    ) || []

    if (imagesToDelete.length > 0) {
      const deletePromises = imagesToDelete.map(async (img) => {
        await supabase.storage
          .from('product-images')
          .remove([img.image_url.replace('product-images/', '')])

        return supabase
          .from('product_images')
          .delete()
          .eq('id', img.id)
      })
      await Promise.all(deletePromises)
    }

    // Upload new images
    if (newImageFiles.length > 0) {
      const startOrder = existingImageUrls.length
      const uploadPromises = newImageFiles.map(async (file, index) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/${productId}/${Date.now()}-${index}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        const imageUrl = `product-images/${fileName}`
        return supabase.from('product_images').insert({
          product_id: productId,
          image_url: imageUrl,
          display_order: startOrder + index,
        })
      })

      await Promise.all(uploadPromises)
    }

    return { success: true }
  } catch (error: any) {
    console.error('Error updating product:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteProduct(productId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('로그인이 필요합니다.')

    // Get product images
    const { data: images } = await supabase
      .from('product_images')
      .select('image_url')
      .eq('product_id', productId)

    // Delete images from storage
    if (images && images.length > 0) {
      const filesToDelete = images.map(img => img.image_url.replace('product-images/', ''))
      await supabase.storage
        .from('product-images')
        .remove(filesToDelete)
    }

    // Delete product (images will be deleted automatically via CASCADE)
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)
      .eq('user_id', user.id)

    if (error) throw error

    return { success: true }
  } catch (error: any) {
    console.error('Error deleting product:', error)
    return { success: false, error: error.message }
  }
}
