export interface AdminUser {
  id: string; firstName: string; lastName: string; email: string;
  contact: string; college: string; year: string; balance: number;
  status: 'active' | 'suspended'; joinDate: string; pan: string; hasBank: boolean;
}
export interface PointAward {
  id: string; userId: string; userName: string; points: number;
  reason: string; awardedBy: string; date: string; expiresOn: string;
}
export interface EGiftRequest {
  id: string; userId: string; userName: string; brand: string;
  amount: number; points: number; status: 'pending' | 'approved' | 'rejected';
  date: string; giftCode?: string;
}
export interface TransferRequest {
  id: string; userId: string; userName: string; bankName: string;
  account: string; ifsc: string; amount: number;
  status: 'pending' | 'approved' | 'transferred' | 'rejected';
  date: string; approvedBy?: string;
}
export interface AdminProduct {
  id: string; name: string; brand: string; category: string;
  minPts: number; maxPts: number; active: boolean; sortOrder: number;
}
export interface AuditEntry {
  id: string; action: string; admin: string; target: string;
  details: string; date: string;
  type: 'points' | 'approval' | 'user' | 'product' | 'csv';
}

export const ADMIN_STATS = {
  totalUsers: 1243,
  currentValidPoints: 8_750_000,
  expiringIn30d: 1_25_000,
  lifetimeEarned: 1_25_00_000,
  consumedPoints: 32_50_000,
  expiredPoints: 5_00_000,
  allowanceBankTransfer: 50_00_000,
  allowanceGiftCard: 20_00_000,
  monthlyAwarded: 4_20_000,
  monthlyRedeemed: 1_85_000,
  pendingBankTransfers: 7,
  pendingEGift: 12,
};

export const ADMIN_USERS: AdminUser[] = [
  { id: 'U001', firstName: 'Rahul',   lastName: 'Sharma',    email: 'rahul.sharma@example.com',    contact: '+91 98765 43210', college: 'Delhi University',    year: '3rd Year', balance: 60000,  status: 'active',    joinDate: '15 Jan 2024', pan: 'ABCDE1234F', hasBank: true  },
  { id: 'U002', firstName: 'Priya',   lastName: 'Patel',     email: 'priya.patel@example.com',     contact: '+91 97654 32109', college: 'Mumbai University',   year: '2nd Year', balance: 35000,  status: 'active',    joinDate: '22 Feb 2024', pan: 'FGHIJ5678K', hasBank: true  },
  { id: 'U003', firstName: 'Arjun',   lastName: 'Nair',      email: 'arjun.nair@example.com',      contact: '+91 96543 21098', college: 'IIT Bombay',          year: '4th Year', balance: 120000, status: 'active',    joinDate: '10 Mar 2024', pan: 'KLMNO9012L', hasBank: true  },
  { id: 'U004', firstName: 'Sneha',   lastName: 'Reddy',     email: 'sneha.reddy@example.com',     contact: '+91 95432 10987', college: 'Hyderabad University', year: '1st Year', balance: 8500,   status: 'active',    joinDate: '05 Apr 2024', pan: 'PQRST3456M', hasBank: false },
  { id: 'U005', firstName: 'Vikram',  lastName: 'Singh',     email: 'vikram.singh@example.com',    contact: '+91 94321 09876', college: 'Chandigarh University', year: '3rd Year', balance: 75000,  status: 'active',    joinDate: '18 Apr 2024', pan: 'UVWXY7890N', hasBank: true  },
  { id: 'U006', firstName: 'Divya',   lastName: 'Krishnan',  email: 'divya.krishnan@example.com',  contact: '+91 93210 98765', college: 'BITS Pilani',         year: '2nd Year', balance: 42000,  status: 'suspended', joinDate: '02 May 2024', pan: 'ABCDE2345O', hasBank: true  },
  { id: 'U007', firstName: 'Rohit',   lastName: 'Mehta',     email: 'rohit.mehta@example.com',     contact: '+91 92109 87654', college: 'NIT Trichy',          year: '4th Year', balance: 95000,  status: 'active',    joinDate: '14 May 2024', pan: 'FGHIJ6789P', hasBank: true  },
  { id: 'U008', firstName: 'Ananya',  lastName: 'Das',       email: 'ananya.das@example.com',      contact: '+91 91098 76543', college: 'Jadavpur University', year: '3rd Year', balance: 18000,  status: 'active',    joinDate: '28 May 2024', pan: 'KLMNO1234Q', hasBank: false },
  { id: 'U009', firstName: 'Karan',   lastName: 'Verma',     email: 'karan.verma@example.com',     contact: '+91 90987 65432', college: 'Delhi University',    year: '2nd Year', balance: 54000,  status: 'active',    joinDate: '10 Jun 2024', pan: 'PQRST5678R', hasBank: true  },
  { id: 'U010', firstName: 'Meera',   lastName: 'Joshi',     email: 'meera.joshi@example.com',     contact: '+91 89876 54321', college: 'Pune University',     year: '1st Year', balance: 12000,  status: 'active',    joinDate: '25 Jun 2024', pan: 'UVWXY9012S', hasBank: false },
  { id: 'U011', firstName: 'Aditya',  lastName: 'Bhatt',     email: 'aditya.bhatt@example.com',    contact: '+91 88765 43210', college: 'IIT Delhi',           year: '3rd Year', balance: 200000, status: 'active',    joinDate: '08 Jul 2024', pan: 'ABCDE3456T', hasBank: true  },
  { id: 'U012', firstName: 'Ishaan',  lastName: 'Choudhary', email: 'ishaan.choudhary@example.com', contact: '+91 87654 32109', college: 'Amity University',   year: '2nd Year', balance: 6000,   status: 'suspended', joinDate: '20 Jul 2024', pan: 'FGHIJ7890U', hasBank: false },
];

export const POINT_AWARDS: PointAward[] = [
  { id: 'PA001', userId: 'U001', userName: 'Rahul Sharma',    points: 2500,  reason: 'Q1 sales target achieved',       awardedBy: 'Ayesha Khan',   date: '10 Feb 2026', expiresOn: '10 Feb 2028' },
  { id: 'PA002', userId: 'U003', userName: 'Arjun Nair',      points: 5000,  reason: 'Best performer — January',       awardedBy: 'Ayesha Khan',   date: '05 Feb 2026', expiresOn: '05 Feb 2028' },
  { id: 'PA003', userId: 'U007', userName: 'Rohit Mehta',     points: 3000,  reason: 'New campus campaign',            awardedBy: 'Suresh Rao',    date: '01 Feb 2026', expiresOn: '01 Feb 2028' },
  { id: 'PA004', userId: 'U002', userName: 'Priya Patel',     points: 1500,  reason: 'Social media engagement bonus',  awardedBy: 'Ayesha Khan',   date: '28 Jan 2026', expiresOn: '28 Jan 2028' },
  { id: 'PA005', userId: 'U011', userName: 'Aditya Bhatt',    points: 10000, reason: 'Top referral Q4 FY25',           awardedBy: 'Suresh Rao',    date: '15 Jan 2026', expiresOn: '15 Jan 2028' },
  { id: 'PA006', userId: 'U005', userName: 'Vikram Singh',    points: 4000,  reason: 'Event management support',       awardedBy: 'Ayesha Khan',   date: '10 Jan 2026', expiresOn: '10 Jan 2028' },
  { id: 'PA007', userId: 'U009', userName: 'Karan Verma',     points: 2000,  reason: 'Content creation — December',   awardedBy: 'Suresh Rao',    date: '05 Jan 2026', expiresOn: '05 Jan 2028' },
  { id: 'PA008', userId: 'U004', userName: 'Sneha Reddy',     points: 500,   reason: 'Welcome bonus',                  awardedBy: 'System',        date: '05 Apr 2024', expiresOn: '05 Apr 2026' },
];

export const EGIFT_REQUESTS: EGiftRequest[] = [
  { id: 'EG001', userId: 'U001', userName: 'Rahul Sharma',    brand: 'Amazon',   amount: 500,  points: 500,  status: 'completed' as any, date: '28 Feb 2026', giftCode: 'AMZN-7X4K-9P2M' },
  { id: 'EG002', userId: 'U003', userName: 'Arjun Nair',      brand: 'Flipkart', amount: 2000, points: 2000, status: 'pending',   date: '27 Feb 2026' },
  { id: 'EG003', userId: 'U007', userName: 'Rohit Mehta',     brand: 'Netflix',  amount: 1000, points: 1000, status: 'pending',   date: '26 Feb 2026' },
  { id: 'EG004', userId: 'U002', userName: 'Priya Patel',     brand: 'Swiggy',   amount: 500,  points: 500,  status: 'approved',  date: '25 Feb 2026', giftCode: 'SWG-K8PQ-3LMN' },
  { id: 'EG005', userId: 'U011', userName: 'Aditya Bhatt',    brand: 'Amazon',   amount: 5000, points: 5000, status: 'pending',   date: '24 Feb 2026' },
  { id: 'EG006', userId: 'U005', userName: 'Vikram Singh',    brand: 'Spotify',  amount: 349,  points: 349,  status: 'rejected',  date: '23 Feb 2026' },
  { id: 'EG007', userId: 'U009', userName: 'Karan Verma',     brand: 'Uber',     amount: 1000, points: 1000, status: 'pending',   date: '22 Feb 2026' },
  { id: 'EG008', userId: 'U001', userName: 'Rahul Sharma',    brand: 'Flipkart', amount: 1000, points: 1000, status: 'completed' as any, date: '28 Dec 2025', giftCode: 'FK-X92K-7TP4' },
];

export const TRANSFER_REQUESTS: TransferRequest[] = [
  { id: 'TR001', userId: 'U003', userName: 'Arjun Nair',   bankName: 'HDFC Bank',            account: '••••2341', ifsc: 'HDFC0001234', amount: 75000,  status: 'pending',     date: '27 Feb 2026' },
  { id: 'TR002', userId: 'U011', userName: 'Aditya Bhatt', bankName: 'ICICI Bank',           account: '••••8821', ifsc: 'ICIC0005678', amount: 100000, status: 'pending',     date: '25 Feb 2026' },
  { id: 'TR003', userId: 'U007', userName: 'Rohit Mehta',  bankName: 'Axis Bank',            account: '••••4412', ifsc: 'UTIB0009012', amount: 50000,  status: 'approved',    date: '20 Feb 2026', approvedBy: 'Ayesha Khan' },
  { id: 'TR004', userId: 'U005', userName: 'Vikram Singh', bankName: 'SBI',                  account: '••••7890', ifsc: 'SBIN0003456', amount: 75000,  status: 'transferred', date: '15 Feb 2026', approvedBy: 'Suresh Rao' },
  { id: 'TR005', userId: 'U001', userName: 'Rahul Sharma', bankName: 'State Bank of India',  account: '••••4521', ifsc: 'SBIN0001234', amount: 50000,  status: 'rejected',    date: '15 Jan 2026' },
  { id: 'TR006', userId: 'U001', userName: 'Rahul Sharma', bankName: 'State Bank of India',  account: '••••4521', ifsc: 'SBIN0001234', amount: 75000,  status: 'transferred', date: '01 Nov 2025', approvedBy: 'Ayesha Khan' },
];

export const ADMIN_PRODUCTS: AdminProduct[] = [
  { id: 'P001', name: 'Amazon Gift Card',  brand: 'Amazon',  category: 'Shopping',       minPts: 500,  maxPts: 10000, active: true,  sortOrder: 1 },
  { id: 'P002', name: 'Flipkart Gift Card',brand: 'Flipkart',category: 'Shopping',       minPts: 500,  maxPts: 5000,  active: true,  sortOrder: 2 },
  { id: 'P003', name: 'Netflix Gift Card', brand: 'Netflix', category: 'Entertainment',  minPts: 500,  maxPts: 3000,  active: true,  sortOrder: 3 },
  { id: 'P004', name: 'Swiggy Gift Card',  brand: 'Swiggy',  category: 'Food',           minPts: 200,  maxPts: 2000,  active: true,  sortOrder: 4 },
  { id: 'P005', name: 'Spotify Premium',   brand: 'Spotify', category: 'Entertainment',  minPts: 119,  maxPts: 1189,  active: true,  sortOrder: 5 },
  { id: 'P006', name: 'Uber Gift Card',    brand: 'Uber',    category: 'Travel',         minPts: 250,  maxPts: 2000,  active: true,  sortOrder: 6 },
  { id: 'P007', name: 'Zomato Gift Card',  brand: 'Zomato',  category: 'Food',           minPts: 200,  maxPts: 2000,  active: false, sortOrder: 7 },
  { id: 'P008', name: 'MakeMyTrip Voucher',brand: 'MMT',     category: 'Travel',         minPts: 1000, maxPts: 10000, active: false, sortOrder: 8 },
];

export const AUDIT_LOG: AuditEntry[] = [
  { id: 'AL001', action: 'Points Awarded',    admin: 'Ayesha Khan', target: 'Rahul Sharma',    details: '+2,500 pts — Q1 sales target',        date: '10 Feb 2026 14:32', type: 'points'   },
  { id: 'AL002', action: 'Points Awarded',    admin: 'Ayesha Khan', target: 'Arjun Nair',      details: '+5,000 pts — Best performer Jan',      date: '05 Feb 2026 11:15', type: 'points'   },
  { id: 'AL003', action: 'eGift Approved',    admin: 'Suresh Rao',  target: 'Priya Patel',     details: 'Swiggy ₹500 — SWG-K8PQ-3LMN',        date: '25 Feb 2026 16:08', type: 'approval' },
  { id: 'AL004', action: 'Transfer Approved', admin: 'Ayesha Khan', target: 'Rohit Mehta',     details: '₹50,000 — UTIB0009012',               date: '20 Feb 2026 10:44', type: 'approval' },
  { id: 'AL005', action: 'CSV Upload',        admin: 'Suresh Rao',  target: '12 users',        details: 'Bulk award — Feb campaign batch',      date: '14 Feb 2026 09:00', type: 'csv'      },
  { id: 'AL006', action: 'User Suspended',    admin: 'Ayesha Khan', target: 'Divya Krishnan',  details: 'Reason: policy violation',             date: '12 Feb 2026 17:22', type: 'user'     },
  { id: 'AL007', action: 'Product Disabled',  admin: 'Suresh Rao',  target: 'Zomato Gift Card',details: 'Stock exhausted — temporarily paused', date: '10 Feb 2026 12:00', type: 'product'  },
  { id: 'AL008', action: 'eGift Rejected',    admin: 'Ayesha Khan', target: 'Vikram Singh',    details: 'Spotify ₹349 — balance insufficient',  date: '23 Feb 2026 15:30', type: 'approval' },
  { id: 'AL009', action: 'Transfer Rejected', admin: 'Suresh Rao',  target: 'Rahul Sharma',    details: '₹50,000 — unverified bank details',   date: '15 Jan 2026 11:05', type: 'approval' },
  { id: 'AL010', action: 'Points Awarded',    admin: 'Suresh Rao',  target: 'Vikram Singh',    details: '+4,000 pts — event management',        date: '10 Jan 2026 10:20', type: 'points'   },
  { id: 'AL011', action: 'User Activated',    admin: 'Ayesha Khan', target: 'Karan Verma',     details: 'Account re-enabled after review',      date: '08 Jan 2026 14:00', type: 'user'     },
  { id: 'AL012', action: 'CSV Upload',        admin: 'Ayesha Khan', target: '8 users',         details: 'Bulk award — Jan new members',         date: '03 Jan 2026 09:30', type: 'csv'      },
];
