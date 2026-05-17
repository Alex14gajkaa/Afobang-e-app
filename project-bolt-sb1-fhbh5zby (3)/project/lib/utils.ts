import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPriceRaw(amount: number): string {
  return `D ${new Intl.NumberFormat('en-US').format(Math.round(amount))}`;
}

export function getDiscountPercent(price: number, salePrice: number): number {
  return Math.round(((price - salePrice) / price) * 100);
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '...' : str;
}

export const GAMBIA_REGIONS = [
  'Greater Banjul Area',
  'Kanifing Municipal',
  'West Coast Region',
  'North Bank Region',
  'Lower River Region',
  'Central River Region',
  'Upper River Region',
];

export const GAMBIA_AREAS: Record<string, string[]> = {
  'Greater Banjul Area': ['Banjul City', 'Bakau', 'Fajara', 'Kotu', 'Kololi', 'Bijilo'],
  'Kanifing Municipal': ['Serrekunda', 'Kanifing', 'Bundung', 'Latrikunda', 'Tallinding', 'Abuko'],
  'West Coast Region': ['Brikama', 'Sukuta', 'Brufut', 'Kartong', 'Sanyang', 'Gunjur'],
  'North Bank Region': ['Barra', 'Farafenni', 'Kerewan', 'Lamin Koto'],
  'Lower River Region': ['Mansa Konko', 'Soma', 'Jali'],
  'Central River Region': ['Janjanbureh', 'Bansang', 'Fajennikunda'],
  'Upper River Region': ['Basse Santa Su', 'Brikama Ba', 'Koina'],
};

export const DELIVERY_FEES: Record<string, number> = {
  'Greater Banjul Area': 75,
  'Kanifing Municipal': 75,
  'West Coast Region': 100,
  'North Bank Region': 200,
  'Lower River Region': 350,
  'Central River Region': 450,
  'Upper River Region': 550,
};

export const DELIVERY_DAYS: Record<string, string> = {
  'Greater Banjul Area': '1-2 days',
  'Kanifing Municipal': '1-2 days',
  'West Coast Region': '2-3 days',
  'North Bank Region': '3-5 days',
  'Lower River Region': '5-7 days',
  'Central River Region': '5-7 days',
  'Upper River Region': '7-10 days',
};

export const PAYMENT_METHODS = [
  { id: 'wave', name: 'Wave', description: 'Pay with Wave mobile money' },
  { id: 'qmoney', name: 'QMoney', description: 'Gambia Telecom QMoney' },
  { id: 'afrimoney', name: 'AfriMoney', description: 'Africell AfriMoney' },
  { id: 'yonna', name: 'Yonna', description: 'Yonna forex & payment' },
  { id: 'visa', name: 'Visa Card', description: 'Pay with Visa credit/debit card' },
  { id: 'mastercard', name: 'Mastercard', description: 'Pay with Mastercard' },
  { id: 'cod', name: 'Cash on Delivery', description: 'Pay when you receive your order' },
];
