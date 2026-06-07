/**
 * Account module data model & helpers
 * Implements Account PRD (ACCPRD2607001)
 */

// Sample Business Accounts
export const SAMPLE_ACCOUNTS = [
  {
    id: 'ACC-001',
    name: 'KALIMANTAN PRIMA PERSADA',
    accountNumber: '0000020862',
    type: 'Corporate',
    status: 'Active',
    industry: 'MNG',
    customerSupportType: 'Dedicated Customer',
    phone: '(021) 4612015',
    fax: '(021) 4612016',
    website: 'www.kpp.co.id',
    customerClustering: 'CLUSTER A',
    salesOrganisation: 'CMSO',
    annualRevenue: 5000000,
    employees: 250,
    rating: 'Hot',
    description: 'Leading mining services provider in Kalimantan region.',
    accountOwner: { id: 'USR-001', name: 'Bambang Suraji', avatar: 'BS' },
    parentAccount: null,
    sapAccountId: '0000020862',

    // Financial
    remainCreditLimit: 150000,
    creditLimitAsOfDate: '2026-06-01',
    creditLimitBlock: false,
    arLimitBlock: false,
    financialSupport: 'Credit',
    financialSupportExpiryDate: '2026-12-31',

    // Address
    billingStreet: 'Jl. Raya RM 22, Cibubur',
    billingCity: 'Jakarta',
    billingState: 'DKI Jakarta',
    billingPostalCode: '13210',
    billingCountry: 'Indonesia',
    billingLatitude: -6.4263,
    billingLongitude: 106.8906,

    shippingStreet: 'Same as Billing Address',
    shippingCity: 'Jakarta',
    shippingState: 'DKI Jakarta',
    shippingPostalCode: '13210',
    shippingCountry: 'Indonesia',

    createdBy: { id: 'USR-002', name: 'Admin User', avatar: 'AU' },
    createdDate: '2024-01-15T09:30:00Z',
    lastModifiedBy: { id: 'USR-001', name: 'Bambang Suraji', avatar: 'BS' },
    lastModifiedDate: '2026-06-07T14:22:00Z',
  },
  {
    id: 'ACC-002',
    name: 'BUKIT MAKMUR MANDIRI UTAMA',
    accountNumber: '0000018421',
    type: 'Distributor',
    status: 'Active',
    industry: 'Oil & Gas',
    customerSupportType: 'Standard',
    phone: '(62) 271-656565',
    fax: '(62) 271-656566',
    website: 'www.bmmu.co.id',
    customerClustering: 'CLUSTER B',
    salesOrganisation: 'EMSO',
    annualRevenue: 3500000,
    employees: 180,
    rating: 'Warm',
    description: 'Distributor for mining and industrial equipment.',
    accountOwner: { id: 'USR-003', name: 'Agus Mizni', avatar: 'AM' },
    parentAccount: null,
    sapAccountId: '0000018421',

    remainCreditLimit: 75000,
    creditLimitAsOfDate: '2026-06-01',
    creditLimitBlock: false,
    arLimitBlock: false,
    financialSupport: 'Bank Transfer',
    financialSupportExpiryDate: '2026-08-15',

    billingStreet: 'Jl. Sultan Hasanuddin 123',
    billingCity: 'Surakarta',
    billingState: 'Jawa Tengah',
    billingPostalCode: '57126',
    billingCountry: 'Indonesia',
    billingLatitude: -7.5505,
    billingLongitude: 110.8066,

    shippingStreet: 'Same as Billing Address',
    shippingCity: 'Surakarta',
    shippingState: 'Jawa Tengah',
    shippingPostalCode: '57126',
    shippingCountry: 'Indonesia',

    createdBy: { id: 'USR-002', name: 'Admin User', avatar: 'AU' },
    createdDate: '2023-11-20T10:15:00Z',
    lastModifiedBy: { id: 'USR-003', name: 'Agus Mizni', avatar: 'AM' },
    lastModifiedDate: '2026-05-28T11:45:00Z',
  },
  {
    id: 'ACC-003',
    name: 'PT. PUTRA TERATAI JAYA',
    accountNumber: '0000021154',
    type: 'Partner',
    status: 'Inactive',
    industry: 'Manufacturing',
    customerSupportType: 'Premium',
    phone: '(62) 21-2902-8868',
    fax: '(62) 21-2902-8869',
    website: 'www.putrajaya.co.id',
    customerClustering: 'CLUSTER C',
    salesOrganisation: 'CMSO',
    annualRevenue: 2000000,
    employees: 95,
    rating: 'Cold',
    description: 'Manufacturing partner - currently inactive.',
    accountOwner: { id: 'USR-004', name: 'Sarah Jenkins', avatar: 'SJ' },
    parentAccount: 'ACC-001',
    sapAccountId: '0000021154',

    remainCreditLimit: -25000,
    creditLimitAsOfDate: '2026-06-01',
    creditLimitBlock: true,
    arLimitBlock: true,
    financialSupport: 'Cash',
    financialSupportExpiryDate: '2026-03-31',

    billingStreet: 'Jl. Batu Ceper 45, Tangerang',
    billingCity: 'Tangerang',
    billingState: 'Banten',
    billingPostalCode: '15124',
    billingCountry: 'Indonesia',
    billingLatitude: -6.1753,
    billingLongitude: 106.6366,

    shippingStreet: 'Same as Billing Address',
    shippingCity: 'Tangerang',
    shippingState: 'Banten',
    shippingPostalCode: '15124',
    shippingCountry: 'Indonesia',

    createdBy: { id: 'USR-002', name: 'Admin User', avatar: 'AU' },
    createdDate: '2023-05-10T08:20:00Z',
    lastModifiedBy: { id: 'USR-004', name: 'Sarah Jenkins', avatar: 'SJ' },
    lastModifiedDate: '2026-04-15T16:30:00Z',
  },
];

// Account Status picklist
export const ACCOUNT_STATUSES = ['Active', 'Inactive', 'Pending Approval'];

// Industry picklist
export const INDUSTRIES = ['MNG', 'Oil & Gas', 'Manufacturing', 'Technology', 'Finance', 'Retail', 'Healthcare'];

// Account Type picklist
export const ACCOUNT_TYPES = ['Corporate', 'Distributor', 'Partner', 'Prospect', 'Reseller', 'Supplier'];

// Customer Support Type picklist
export const CUSTOMER_SUPPORT_TYPES = ['Dedicated Customer', 'Standard', 'Premium'];

// Rating picklist
export const RATINGS = ['Hot', 'Warm', 'Cold'];

// Financial Support picklist
export const FINANCIAL_SUPPORT = ['Cash', 'Credit', 'Bank Transfer', 'Check'];

// Helpers
export function accountById(id) {
  return SAMPLE_ACCOUNTS.find(a => a.id === id) || null;
}

export function accountsByStatus(status) {
  return SAMPLE_ACCOUNTS.filter(a => a.status === status);
}

export function accountsOwnedBy(userId) {
  return SAMPLE_ACCOUNTS.filter(a => a.accountOwner.id === userId);
}

export function formatCurrency(value) {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value);
}

export function formatPhone(phone) {
  if (!phone) return '—';
  return phone;
}

export function isCreditBlocked(account) {
  return account.creditLimitBlock === true;
}

export function isARBlocked(account) {
  return account.arLimitBlock === true;
}

export function getAccountStatusColor(status) {
  const colors = {
    'Active': '#388E3C',
    'Inactive': '#757575',
    'Pending Approval': '#F57C00',
  };
  return colors[status] || '#757575';
}
