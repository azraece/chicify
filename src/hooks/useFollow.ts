import { useState, useEffect } from 'react';

interface FollowResponse {
  success: boolean;
  message: string;
  action: 'followed' | 'unfollowed';
}

interface FollowStatus {
  isFollowing: boolean;
  followedAt: string | null;
}

export const useFollow = (
  currentUserId: string | null, 
  targetUserId: string,
  onFollowChange?: () => void
) => {
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Takip durumunu kontrol et
  const checkFollowStatus = async () => {
    if (!currentUserId || !targetUserId || currentUserId === targetUserId) {
      return;
    }

    try {
      const response = await fetch(
        `/api/follow?followerId=${currentUserId}&followingId=${targetUserId}`
      );
      
      if (response.ok) {
        const data: FollowStatus = await response.json();
        setIsFollowing(data.isFollowing);
      }
    } catch (error) {
      console.error('Takip durumu kontrolü hatası:', error);
    }
  };

  // Takip etme/bırakma işlemi
  const toggleFollow = async () => {
    if (!currentUserId || !targetUserId) {
      setError('Kullanıcı bilgileri eksik');
      return;
    }

    if (currentUserId === targetUserId) {
      setError('Kendi kendinizi takip edemezsiniz');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const action = isFollowing ? 'unfollow' : 'follow';
      
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          followerId: currentUserId,
          followingId: targetUserId,
          action: action
        }),
      });

      const data: FollowResponse = await response.json();

      if (response.ok && data.success) {
        setIsFollowing(action === 'follow');
        // Success feedback
        console.log(data.message);
        
        // Callback'i çağır (takipçi sayılarını güncellemek için)
        if (onFollowChange) {
          onFollowChange();
        }
      } else {
        setError(data.message || 'İşlem başarısız');
      }

    } catch (error) {
      console.error('Takip işlemi hatası:', error);
      setError('Bir hata oluştu, lütfen tekrar deneyin');
    } finally {
      setIsLoading(false);
    }
  };

  // Component mount olduğunda takip durumunu kontrol et
  useEffect(() => {
    checkFollowStatus();
  }, [currentUserId, targetUserId]);

  return {
    isFollowing,
    isLoading,
    error,
    toggleFollow,
    refreshFollowStatus: checkFollowStatus
  };
}; 