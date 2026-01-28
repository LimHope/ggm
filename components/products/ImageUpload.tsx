'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { X, Upload, Image as ImageIcon } from 'lucide-react'
import { MAX_IMAGE_COUNT } from '@/lib/constants'

interface ImageUploadProps {
  previews: string[]
  onAdd: (files: File[]) => void
  onRemove: (index: number) => void
  loading?: boolean
  error?: string | null
}

export default function ImageUpload({
  previews,
  onAdd,
  onRemove,
  loading,
  error,
}: ImageUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onAdd(acceptedFiles)
  }, [onAdd])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxFiles: MAX_IMAGE_COUNT,
    disabled: previews.length >= MAX_IMAGE_COUNT || loading,
  })

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      {previews.length < MAX_IMAGE_COUNT && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary-600 bg-primary-50'
              : 'border-gray-300 hover:border-primary-600'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          {isDragActive ? (
            <p className="text-primary-600 font-medium">이미지를 놓아주세요</p>
          ) : (
            <>
              <p className="text-gray-700 font-medium mb-2">
                이미지를 끌어다 놓거나 클릭하여 선택하세요
              </p>
              <p className="text-sm text-gray-500">
                최대 {MAX_IMAGE_COUNT}장, 5MB 이하 (JPEG, PNG, WebP)
              </p>
            </>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
            >
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                  대표
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {previews.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-400">
          <ImageIcon className="w-16 h-16 mx-auto mb-3 opacity-50" />
          <p>등록된 이미지가 없습니다</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-sm text-gray-600 mt-2">이미지 처리 중...</p>
        </div>
      )}
    </div>
  )
}
