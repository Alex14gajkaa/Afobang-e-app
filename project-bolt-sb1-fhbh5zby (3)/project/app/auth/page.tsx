'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, ArrowRight, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Mode = 'login' | 'register' | 'forgot';

const COUNTRY_CODES = [
  { code: '+220', country: 'GM', name: 'Gambia' },
  { code: '+44', country: 'GB', name: 'United Kingdom' },
  { code: '+49', country: 'DE', name: 'Germany' },
  { code: '+33', country: 'FR', name: 'France' },
  { code: '+31', country: 'NL', name: 'Netherlands' },
  { code: '+46', country: 'SE', name: 'Sweden' },
  { code: '+47', country: 'NO', name: 'Norway' },
  { code: '+45', country: 'DK', name: 'Denmark' },
  { code: '+358', country: 'FI', name: 'Finland' },
  { code: '+353', country: 'IE', name: 'Ireland' },
  { code: '+39', country: 'IT', name: 'Italy' },
  { code: '+34', country: 'ES', name: 'Spain' },
  { code: '+351', country: 'PT', name: 'Portugal' },
  { code: '+32', country: 'BE', name: 'Belgium' },
  { code: '+41', country: 'CH', name: 'Switzerland' },
  { code: '+43', country: 'AT', name: 'Austria' },
  { code: '+1', country: 'US', name: 'United States' },
  { code: '+1', country: 'CA', name: 'Canada' },
  { code: '+971', country: 'AE', name: 'UAE' },
  { code: '+966', country: 'SA', name: 'Saudi Arabia' },
  { code: '+212', country: 'MA', name: 'Morocco' },
  { code: '+221', country: 'SN', name: 'Senegal' },
  { code: '+234', country: 'NG', name: 'Nigeria' },
  { code: '+233', country: 'GH', name: 'Ghana' },
  { code: '+225', country: 'CI', name: "Côte d'Ivoire" },
];

function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [countryCode, setCountryCode] = useState('+220');
  const [showCodePicker, setShowCodePicker] = useState(false);

  const [form, setForm] = useState({ email: '', password: '', full_name: '', phone: '' });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
      if (error) { setError(error.message); setLoading(false); return; }
      router.refresh();
      router.push('/account');
    } else if (mode === 'register') {
      const fullPhone = form.phone ? `${countryCode}${form.phone.replace(/^0/, '')}` : '';
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { full_name: form.full_name, phone: fullPhone } },
      });
      if (error) { setError(error.message); setLoading(false); return; }
      setMessage('Account created! You can now sign in.');
      setMode('login');
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset`,
      });
      if (error) { setError(error.message); setLoading(false); return; }
      setMessage('Password reset link sent to your email.');
    }
    setLoading(false);
  };

  const selectedCountry = COUNTRY_CODES.find((c) => c.code === countryCode) ?? COUNTRY_CODES[0];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 pb-32 md:pb-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src="/IMG_6445.PNG" alt="Afobang" className="h-16 w-auto object-contain" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            {mode === 'login' ? 'Welcome back' : mode === 'register' ? 'Create account' : 'Reset password'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            {mode === 'login' ? 'Sign in to your Afobang account' : mode === 'register' ? 'Join thousands of happy shoppers' : "We'll email you a reset link"}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl p-7 border border-gray-100 dark:border-gray-800 shadow-card">
          {message && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3 mb-5">
              <p className="text-sm text-green-700 dark:text-green-400">{message}</p>
            </div>
          )}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 mb-5">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Full Name</label>
                  <input required value={form.full_name} onChange={(e) => update('full_name', e.target.value)} placeholder="Your full name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-green-500 transition-colors" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Phone Number <span className="text-gray-400 font-normal">(optional)</span></label>
                  <div className="flex gap-2">
                    {/* Country code picker */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowCodePicker((v) => !v)}
                        className="flex items-center gap-1.5 px-3 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-green-500 transition-colors whitespace-nowrap"
                      >
                        <span className="text-base leading-none">{getFlagEmoji(selectedCountry.country)}</span>
                        <span className="font-medium">{selectedCountry.code}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                      {showCodePicker && (
                        <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl z-50 max-h-64 overflow-y-auto">
                          {COUNTRY_CODES.map((c, i) => (
                            <button
                              key={`${c.code}-${c.country}-${i}`}
                              type="button"
                              onClick={() => { setCountryCode(c.code); setShowCodePicker(false); }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                            >
                              <span className="text-base">{getFlagEmoji(c.country)}</span>
                              <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{c.name}</span>
                              <span className="text-sm font-medium text-gray-500">{c.code}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      placeholder="7XX XXXX"
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-green-500 transition-colors"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Email Address</label>
              <input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-green-500 transition-colors" />
            </div>

            {mode !== 'forgot' && (
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Password</label>
                <div className="relative">
                  <input required type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="••••••••" minLength={6}
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-green-500 transition-colors" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {mode === 'login' && (
                  <button type="button" onClick={() => { setMode('forgot'); setError(''); setMessage(''); }} className="text-xs text-green-700 dark:text-green-400 mt-1.5 hover:underline">Forgot password?</button>
                )}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-green-700 hover:bg-green-600 disabled:opacity-70 text-white font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 mt-2">
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Reset Link'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-6 text-center">
            {mode === 'login' ? (
              <p className="text-sm text-gray-500">Don&apos;t have an account?{' '}
                <button onClick={() => { setMode('register'); setError(''); setMessage(''); }} className="text-green-700 dark:text-green-400 font-semibold hover:underline">Sign up</button>
              </p>
            ) : (
              <p className="text-sm text-gray-500">Already have an account?{' '}
                <button onClick={() => { setMode('login'); setError(''); setMessage(''); }} className="text-green-700 dark:text-green-400 font-semibold hover:underline">Sign in</button>
              </p>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          By continuing, you agree to Afobang&apos;s{' '}
          <Link href="#" className="text-green-700 dark:text-green-400 hover:underline">Terms</Link> and{' '}
          <Link href="#" className="text-green-700 dark:text-green-400 hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
