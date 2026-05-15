'use client';

import { useState } from 'react';
import { Mail, Gift, CheckCircle } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  return (
    <section className="py-14 bg-green-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-pattern opacity-20" />
      <div className="relative max-w-2xl mx-auto px-4 text-center">
        <div className="w-14 h-14 bg-gold-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Gift className="w-7 h-7 text-gold-400" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Get 20% Off Your First Order</h2>
        <p className="text-green-200 mb-8 text-sm md:text-base">Subscribe to our newsletter and receive exclusive deals, new arrival alerts, and your welcome discount code.</p>
        {submitted ? (
          <div className="flex items-center justify-center gap-3 bg-white/10 rounded-2xl px-6 py-4 text-white">
            <CheckCircle className="w-6 h-6 text-gold-400" />
            <div className="text-left">
              <p className="font-semibold">You're subscribed!</p>
              <p className="text-green-200 text-sm">Your discount code: <strong>WELCOME20</strong></p>
            </div>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); if (email.trim()) setSubmitted(true); }} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address"
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-400 text-sm" />
            </div>
            <button type="submit" className="bg-gold-500 hover:bg-gold-400 text-gray-900 font-bold px-6 py-3.5 rounded-2xl transition-all active:scale-95 whitespace-nowrap text-sm">
              Get My Discount
            </button>
          </form>
        )}
        <p className="text-green-300 text-xs mt-4">No spam, unsubscribe anytime.</p>
      </div>
    </section>
  );
}
