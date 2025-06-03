'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface FollowingUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  followersCount: number;
  followingCount: number;
  followedAt: string;
}

interface FollowingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export default function FollowingModal({ isOpen, onClose, userId }: FollowingModalProps) {
  const [followingList, setFollowingList] = useState<FollowingUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Takip edilen kişileri getir
  const fetchFollowing = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/following?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setFollowingList(data.following);
      } else {
        setError(data.error || 'Takip edilen kişiler alınamadı');
      }
    } catch (err) {
      console.error('Following fetch error:', err);
      setError('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Modal açıldığında veriyi getir
  useEffect(() => {
    if (isOpen && userId) {
      fetchFollowing();
    }
  }, [isOpen, userId]);

  // Modal kapalıysa render etme
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Takip Edilenler</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh]">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
              <p className="mt-2 text-gray-600">Yükleniyor...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchFollowing}
                className="mt-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Tekrar Dene
              </button>
            </div>
          )}

          {!loading && !error && followingList.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">Henüz kimseyi takip etmiyorsunuz</p>
            </div>
          )}

          {!loading && !error && followingList.length > 0 && (
            <div className="space-y-3">
              {followingList.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    {/* Avatar placeholder */}
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    
                    {/* User info */}
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">@{user.username}</p>
                      <div className="flex space-x-4 text-xs text-gray-500">
                        <span>{user.followersCount} takipçi</span>
                        <span>{user.followingCount} takip</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Profil Link */}
                  <Link
                    href={`/user/${user._id}`}
                    onClick={onClose}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    Profil
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && !error && followingList.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 text-center text-sm text-gray-600">
            Toplam {followingList.length} kişi takip ediliyor
          </div>
        )}
      </div>
    </div>
  );
} 