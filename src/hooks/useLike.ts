'use client';

import { useState, useEffect } from 'react';

interface UseLikeProps {
  userId: string;
  outfitId: string;
  enabled?: boolean; // Beğeni özelliğinin aktif olup olmadığı
}

export const useLike = ({ userId, outfitId, enabled = true }: UseLikeProps) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Beğeni durumunu kontrol et
  const checkLikeStatus = async () => {
    if (!enabled || !userId || !outfitId) return;

    try {
      const response = await fetch(
        `/api/likes?userId=${userId}&outfitId=${outfitId}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setIsLiked(data.isLiked);
        }
      }
    } catch (error) {
      console.error('Like status check error:', error);
    }
  };

  // Favoriler sayfasına beğeni değişikliği sinyali gönder
  const notifyFavoritesUpdate = () => {
    // localStorage ile favoriler sayfasına sinyal gönder
    localStorage.setItem('favoritesNeedUpdate', Date.now().toString());
    
    // CustomEvent ile de sinyal gönder (sayfa açıksa)
    window.dispatchEvent(new CustomEvent('favoritesUpdated', {
      detail: { userId, outfitId, action: isLiked ? 'unlike' : 'like' }
    }));
  };

  // Beğeni durumunu değiştir
  const toggleLike = async () => {
    if (!enabled || !userId || !outfitId) {
      setError('Beğeni özelliği kullanılamıyor');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const action = isLiked ? 'unlike' : 'like';
      
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          outfitId,
          action
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsLiked(action === 'like');
        console.log(data.message);
        
        // Favoriler sayfasına güncelleme sinyali gönder
        notifyFavoritesUpdate();
        
      } else {
        setError(data.error || 'Beğeni işlemi başarısız');
      }

    } catch (error) {
      console.error('Like toggle error:', error);
      setError('Bir hata oluştu, lütfen tekrar deneyin');
    } finally {
      setIsLoading(false);
    }
  };

  // Component mount olduğunda beğeni durumunu kontrol et
  useEffect(() => {
    checkLikeStatus();
  }, [userId, outfitId, enabled]);

  return {
    isLiked,
    isLoading,
    error,
    toggleLike,
    refreshLikeStatus: checkLikeStatus
  };
}; 