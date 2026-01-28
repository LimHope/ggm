'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { User, Search, Menu } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function Header() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`)
    } else if (pathname === '/') {
      // If empty search on home page, just reload to show all
      router.push('/')
    }
  }

  return (
    <header className="bg-primary-700 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-90">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-2xl">
              🍠
            </div>
            <span className="text-2xl font-jua tracking-wide">Go구마마켓</span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="상품을 검색해보세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-primary-600 text-white placeholder-primary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-200 cursor-pointer" onClick={handleSearch} />
            </form>
          </div>

          {/* Right Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/products/new">
                  <button className="px-4 py-2 bg-white text-primary-700 hover:bg-gray-100 rounded-md font-medium transition-colors text-sm">
                    판매하기
                  </button>
                </Link>
                <Link href="/profile" className="flex items-center space-x-2 hover:opacity-80">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                  <span className="hidden sm:inline">{profile?.username}</span>
                </Link>
              </>
            ) : (
              <Link href="/login">
                <button className="px-4 py-2 bg-white text-primary-700 hover:bg-gray-100 rounded-md font-medium transition-colors text-sm">
                  로그인
                </button>
              </Link>
            )}
            <button className="md:hidden">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="상품을 검색해보세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-primary-600 text-white placeholder-primary-200 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-200 cursor-pointer" onClick={handleSearch} />
          </form>
        </div>
      </div>
    </header>
  )
}
