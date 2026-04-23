import type { Transaction, EGift, BankAccount } from './types';

export const MOCK_BALANCE = { current: 60000, earned: 68000, used: 8000, expiring: 800 };

export const MOCK_EXPIRY = [
  { pts: 500, date: '30 Jun 2026', days: 26 },
  { pts: 300, date: '10 Jul 2026', days: 36 },
  { pts: 10000, date: '14 Jan 2027', days: 207 },
];

export const MOCK_HISTORY: Transaction[] = [
  { id: 1, type: 'egift', title: 'Amazon eGift Card', date: '28 Feb 2026', pts: -500, status: 'completed', code: 'AMZN-7X4K-9P2M' },
  { id: 2, type: 'award', title: 'Points awarded', date: '10 Feb 2026', pts: 2500, status: 'completed' },
  { id: 3, type: 'bank', title: 'Bank transfer', date: '15 Jan 2026', pts: -50000, status: 'rejected' },
  { id: 4, type: 'egift', title: 'Flipkart eGift Card', date: '28 Dec 2025', pts: -1000, status: 'completed', code: 'FK-X92K-7TP4' },
  { id: 5, type: 'award', title: 'Points awarded', date: '10 Dec 2025', pts: 5000, status: 'completed' },
  { id: 6, type: 'award', title: 'Points awarded', date: '15 Nov 2025', pts: 8000, status: 'completed' },
  { id: 7, type: 'bank', title: 'Bank transfer', date: '1 Nov 2025', pts: -75000, status: 'completed' },
];

export const EGIFTS: EGift[] = [
  { id: 'amz', name: 'Amazon', label: 'Amazon Gift Card', cat: 'Shopping', range: '₹500 – ₹10,000', bg: '#000', fg: '#FF9900', values: [500, 1000, 2000, 5000, 10000], terms: 'Valid for 10 years. Redeemable on Amazon.in.' },
  { id: 'flip', name: 'Flipkart', label: 'Flipkart Gift Card', cat: 'Shopping', range: '₹500 – ₹5,000', bg: '#2874F0', fg: '#fff', values: [500, 1000, 2000, 5000], terms: 'Valid for 1 year. Redeemable on Flipkart.com.' },
  { id: 'netflix', name: 'NETFLIX', label: 'Netflix Gift Card', cat: 'Entertainment', range: '₹500 – ₹3,000', bg: '#141414', fg: '#E50914', values: [500, 1000, 2000, 3000], terms: 'Valid until redeemed. One card per account.' },
  { id: 'swiggy', name: 'Swiggy', label: 'Swiggy Gift Card', cat: 'Shopping', range: '₹200 – ₹2,000', bg: '#FC8019', fg: '#fff', values: [200, 500, 1000, 2000], terms: 'Valid for 1 year. Redeemable on Swiggy app.' },
  { id: 'spotify', name: 'Spotify', label: 'Spotify Premium', cat: 'Entertainment', range: '₹119 – ₹1,189', bg: '#1DB954', fg: '#fff', values: [119, 179, 349, 1189], terms: 'Redeemable for Spotify Premium subscription.' },
  { id: 'uber', name: 'Uber', label: 'Uber Gift Card', cat: 'Shopping', range: '₹250 – ₹2,000', bg: '#000', fg: '#fff', values: [250, 500, 1000, 2000], terms: 'Redeemable on Uber and Uber Eats. Valid for 1 year.' },
];

export const MOCK_BANK: BankAccount = {
  name: 'Rahul Sharma',
  bankName: 'State Bank of India',
  account: '•••• •••• 4521',
  ifsc: 'SBIN0001234',
};
