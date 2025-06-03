'use client';

import React from 'react';
import { useLike } from '@/hooks/useLike';

interface LikeButtonProps {
  currentUserId: string;
  outfitId: string;
  outfitOwnerId: string;
  className?: string;
}

export default function LikeButton({ 
  currentUserId, 
  outfitId, 
  outfitOwnerId,
  className = ''
}: LikeButtonProps) {
  // Kendi kombinimizse beğeni özelliği devre dışı
  const isOwnOutfit = currentUserId === outfitOwnerId;
  
  const { isLiked, isLoading, toggleLike } = useLike({
    userId: currentUserId,
    outfitId,
    enabled: !isOwnOutfit // Kendi kombinimiz değilse aktif
  });

  // Kendi kombinimizse gösterme
  if (isOwnOutfit) {
    return null;
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); // Parent elementlerin click eventini engelle
        toggleLike();
      }}
      disabled={isLoading}
      className={`
        absolute bottom-2 left-2 
        w-8 h-8 
        ${isLiked ? 'bg-red-50 border border-red-200' : 'bg-white bg-opacity-80'} 
        rounded-full 
        flex items-center justify-center 
        shadow-lg 
        hover:bg-opacity-100 
        ${isLiked ? 'hover:bg-red-100' : ''} 
        transition-all duration-200 
        transform hover:scale-110
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      title={isLiked ? 'Beğeniyi kaldır' : 'Beğen'}
    >
      {/* Kalp İkonu */}
      <svg 
        className={`w-5 h-5 transition-all duration-300 ${
          isLiked 
            ? 'text-red-500 scale-110' 
            : 'text-gray-500 hover:text-red-400'
        }`}
        fill={isLiked ? '#ef4444' : 'none'} // Doğrudan kırmızı renk kodu
        stroke={isLiked ? '#ef4444' : 'currentColor'}
        strokeWidth={isLiked ? 1 : 2}
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
        />
      </svg>
      
      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Beğenildiğinde çıkan parıltı efekti */}
      {isLiked && (
        <div className="absolute inset-0 rounded-full animate-ping bg-red-200 opacity-20"></div>
      )}
    </button>
  );
} 