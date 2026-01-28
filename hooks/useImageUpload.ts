'use client'

import { useState } from 'react'
import imageCompression from 'browser-image-compression'
import { MAX_IMAGE_SIZE, MAX_IMAGE_COUNT, ACCEPTED_IMAGE_TYPES } from '@/lib/constants'

export function useImageUpload() {
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    }

    try {
      return await imageCompression(file, options)
    } catch (err) {
      console.error('Error compressing image:', err)
      return file
    }
  }

  const addImages = async (files: File[]) => {
    setError(null)
    setLoading(true)

    try {
      // Validate file types
      const validFiles = files.filter(file => {
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
          setError('지원하지 않는 파일 형식입니다. (JPEG, PNG, WebP만 가능)')
          return false
        }
        return true
      })

      if (validFiles.length === 0) {
        setLoading(false)
        return
      }

      // Check total count
      if (images.length + validFiles.length > MAX_IMAGE_COUNT) {
        setError(`최대 ${MAX_IMAGE_COUNT}장까지 업로드 가능합니다.`)
        setLoading(false)
        return
      }

      // Compress images
      const compressedFiles = await Promise.all(
        validFiles.map(file => compressImage(file))
      )

      // Validate file sizes
      const oversizedFiles = compressedFiles.filter(file => file.size > MAX_IMAGE_SIZE)
      if (oversizedFiles.length > 0) {
        setError('파일 크기는 5MB 이하여야 합니다.')
        setLoading(false)
        return
      }

      // Create previews
      const newPreviews = await Promise.all(
        compressedFiles.map(file => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.readAsDataURL(file)
          })
        })
      )

      setImages(prev => [...prev, ...compressedFiles])
      setPreviews(prev => [...prev, ...newPreviews])
    } catch (err) {
      setError('이미지 처리 중 오류가 발생했습니다.')
      console.error('Error adding images:', err)
    } finally {
      setLoading(false)
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
    setError(null)
  }

  const reorderImages = (startIndex: number, endIndex: number) => {
    const newImages = Array.from(images)
    const newPreviews = Array.from(previews)

    const [movedImage] = newImages.splice(startIndex, 1)
    const [movedPreview] = newPreviews.splice(startIndex, 1)

    newImages.splice(endIndex, 0, movedImage)
    newPreviews.splice(endIndex, 0, movedPreview)

    setImages(newImages)
    setPreviews(newPreviews)
  }

  const reset = () => {
    setImages([])
    setPreviews([])
    setError(null)
  }

  return {
    images,
    previews,
    loading,
    error,
    addImages,
    removeImage,
    reorderImages,
    reset,
  }
}
