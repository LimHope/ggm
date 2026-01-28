'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, MapPin, LogOut, Edit2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import ProductGrid from '@/components/products/ProductGrid'
import { ProductWithImages } from '@/types'
import { getImageUrl } from '@/lib/utils'

export default function ProfilePage() {
  const router = useRouter()
  const { user, profile, signOut } = useAuth()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [myProducts, setMyProducts] = useState<ProductWithImages[]>([])
  const [productsLoading, setProductsLoading] = useState(true)

  const [formData, setFormData] = useState({
    username: profile?.username || '',
    full_name: profile?.full_name || '',
    location: profile?.location || '',
    bio: profile?.bio || '',
  })

  const supabase = createClient()

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username,
        full_name: profile.full_name || '',
        location: profile.location || '',
        bio: profile.bio || '',
      })
    }
  }, [profile])

  useEffect(() => {
    if (user) {
      fetchMyProducts()
    }
  }, [user])

  const fetchMyProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_images(*), profiles(*)')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      setMyProducts(data as ProductWithImages[])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setProductsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user?.id)

      if (error) throw error

      setEditing(false)
      window.location.reload()
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('프로필 업데이트에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (!user || !profile) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const availableProducts = myProducts.filter(p => p.status === 'available')
  const reservedProducts = myProducts.filter(p => p.status === 'reserved')
  const soldProducts = myProducts.filter(p => p.status === 'sold')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Card */}
      <Card className="p-6 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            {profile.avatar_url ? (
              <img
                src={getImageUrl(profile.avatar_url)}
                alt={profile.username}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-primary-600" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile.username}</h1>
              {profile.full_name && (
                <p className="text-gray-600">{profile.full_name}</p>
              )}
              {profile.location && (
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing(!editing)}
            >
              <Edit2 className="w-4 h-4 mr-1" />
              {editing ? '취소' : '프로필 수정'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-1" />
              로그아웃
            </Button>
          </div>
        </div>

        {profile.bio && !editing && (
          <p className="text-gray-700 mb-4">{profile.bio}</p>
        )}

        {editing && (
          <form onSubmit={handleSubmit} className="space-y-4 mt-6 pt-6 border-t">
            <Input
              label="사용자명"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
            <Input
              label="이름"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            />
            <Input
              label="지역"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                소개
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent resize-none"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? '저장 중...' : '저장'}
            </Button>
          </form>
        )}
      </Card>

      {/* My Products */}
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            판매중 ({availableProducts.length})
          </h2>
          {productsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <ProductGrid products={availableProducts} />
          )}
        </div>

        {reservedProducts.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              예약중 ({reservedProducts.length})
            </h2>
            <ProductGrid products={reservedProducts} />
          </div>
        )}

        {soldProducts.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              판매완료 ({soldProducts.length})
            </h2>
            <ProductGrid products={soldProducts} />
          </div>
        )}
      </div>
    </div>
  )
}
