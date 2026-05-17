import Link from 'next/link';
import { MapPin, Phone, Mail, Facebook, Instagram, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pb-20 md:pb-0">
      <div className="bg-green-700 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-white flex-shrink-0" />
            <div>
              <p className="text-white font-semibold text-sm">Need help? Chat with us on WhatsApp</p>
              <p className="text-green-200 text-xs">Available 8am–10pm, 7 days a week</p>
            </div>
          </div>
          <a href="https://wa.me/2209000000" target="_blank" rel="noopener noreferrer"
            className="flex-shrink-0 bg-white text-green-700 font-semibold text-sm px-5 py-2 rounded-xl hover:bg-green-50 transition-colors">
            Start Chat
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <img src="/IMG_6445.PNG" alt="Afobang" className="h-12 w-auto object-contain bg-white rounded-xl px-2 py-1" />
            </div>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">The Gambia's premier online marketplace. Quality products from Europe, Dubai, Turkey & China delivered to your door.</p>
            <div className="flex items-center gap-3">
              {[Facebook, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-green-700 flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              {[
                ["Men's Fashion", '/products?category=men-fashion'],
                ["Women's Fashion", '/products?category=women-fashion'],
                ['Electronics', '/products?category=electronics'],
                ['Beauty Products', '/products?category=beauty-products'],
                ['Flash Sales 🔥', '/flash-sales'],
                ['Best Sellers', '/products?filter=best-sellers'],
              ].map(([label, href]) => (
                <li key={href}><Link href={href} className="text-sm text-gray-400 hover:text-green-400 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Help</h4>
            <ul className="space-y-2">
              {[
                ['My Orders', '/orders'], ['Track Order', '/orders'],
                ['Returns & Refunds', '/returns'], ['Delivery Info', '/delivery'],
                ['Payment Methods', '/payments'], ['FAQ', '/faq'],
              ].map(([label, href]) => (
                <li key={href}><Link href={href} className="text-sm text-gray-400 hover:text-green-400 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3"><MapPin className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" /><span className="text-sm text-gray-400">Serrekunda, Kanifing Municipal, The Gambia</span></li>
              <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-green-400 flex-shrink-0" /><a href="tel:+2209000000" className="text-sm text-gray-400 hover:text-green-400">+220 900 0000</a></li>
              <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-green-400 flex-shrink-0" /><a href="mailto:hello@afobang.gm" className="text-sm text-gray-400 hover:text-green-400">hello@afobang.gm</a></li>
            </ul>
            <div className="mt-5">
              <p className="text-white font-semibold text-sm mb-2">We Accept</p>
              <div className="flex flex-wrap gap-1.5">
                {['Wave', 'QMoney', 'AfriMoney', 'Yonna', 'Visa', 'Mastercard', 'COD'].map((m) => (
                  <span key={m} className="text-[10px] font-medium bg-gray-800 border border-gray-700 px-2 py-1 rounded-lg text-gray-300">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Afobang. All rights reserved. Made with love for Gambians worldwide.</p>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
