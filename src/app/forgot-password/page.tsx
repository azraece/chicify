'use client';

import Link from 'next/link';
import { useState } from 'react';

type ResetMethod = 'email' | 'phone';

export default function ForgotPassword() {
  const [resetMethod, setResetMethod] = useState<ResetMethod>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: resetMethod,
          [resetMethod]: resetMethod === 'email' ? email : phone,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Bir hata oluştu');
      }

      setSuccess('Şifre sıfırlama bağlantısı gönderildi.');
      setEmail('');
      setPhone('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FFF5EE] flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-alex-brush text-red-600 mb-2">Chicify</h1>
          <p className="text-gray-600">Şifrenizi mi unuttunuz?</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-600 rounded-lg text-sm">
            {success}
          </div>
        )}

        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={() => setResetMethod('email')}
            className={`flex-1 py-2 rounded-lg border ${
              resetMethod === 'email'
                ? 'bg-red-600 text-white border-red-600'
                : 'border-gray-300 text-gray-600 hover:border-red-500'
            }`}
          >
            E-posta ile
          </button>
          <button
            type="button"
            onClick={() => setResetMethod('phone')}
            className={`flex-1 py-2 rounded-lg border ${
              resetMethod === 'phone'
                ? 'bg-red-600 text-white border-red-600'
                : 'border-gray-300 text-gray-600 hover:border-red-500'
            }`}
          >
            Telefon ile
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {resetMethod === 'email' ? (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-posta
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-red-500"
                placeholder="ornek@email.com"
              />
            </div>
          ) : (
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefon Numarası
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                pattern="[0-9]{10}"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-red-500"
                placeholder="5XX XXX XX XX"
              />
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-full hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Bağlantısı Gönder'}
          </button>

          <div className="text-center mt-6">
            <Link href="/login" className="text-sm text-red-600 hover:underline">
              Giriş sayfasına dön
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
} 