/**
 * Contact module data model & helpers
 * Implements Contact PRD (CTCPRD2607001)
 */

// Sample Contacts
export const SAMPLE_CONTACTS = [
  {
    id: 'CTR-001',
    salutation: 'Mr.',
    firstName: 'Agung',
    lastName: 'Kurniawan',
    title: 'PLANNER',
    titleContact: 'STAFF UNIT',
    accountId: 'ACC-001',
    accountName: 'KALIMANTAN PRIMA PERSADA',
    branchSiteSupport: 'Sangkulirang FMC ST',
    reportToId: 'CTR-002',
    reportToName: 'Bambang Suraji',
    contactOwnerId: 'USR-001',
    contactOwnerName: 'Bambang Suraji',
    contactOwnerAvatar: 'BS',
    department: 'Operations',
    externalId: 'AGUNG_KURNIAWAN_0000018421_PLANNER_628524987786',
    isActive: true,
    verified: true,
    pic: true,

    // Communication
    email: 'agung.kurniawan@kpp.co.id',
    email2: 'agung@personal.com',
    mobile: '+62-8524-987-786',
    mobile2: '+62-8524-987-787',
    mobile3: null,
    phone: '(021) 4612015',
    fax: '(021) 4612016',
    broadcast: true,
    haveEmail: true,
    activeEmail: true,
    haveWhatsApp: true,
    activeWhatsApp: true,

    // Follow-up
    needFollowUp: false,
    previousFollowUp: '2026-05-28',
    nextFollowUp: null,
    activationContactDate: '2024-06-15',
    source: 'SVC - Service Department Head',
    emailSupport: 'support@kpp.co.id',
    oldContact: false,
    reasonDeleted: null,

    // Address
    mailingStreet: 'Jl. Raya RM 22, Cibubur',
    mailingCity: 'Jakarta',
    mailingState: 'DKI Jakarta',
    mailingPostalCode: '13210',
    mailingCountry: 'Indonesia',
    otherStreet: null,
    otherCity: null,
    otherCountry: null,

    // System
    createdBy: { id: 'USR-002', name: 'Admin User', avatar: 'AU' },
    createdDate: '2024-06-15T10:30:00Z',
    lastModifiedBy: { id: 'USR-001', name: 'Bambang Suraji', avatar: 'BS' },
    lastModifiedDate: '2026-06-07T09:15:00Z',
  },
  {
    id: 'CTR-002',
    salutation: 'Mr.',
    firstName: 'Bambang',
    lastName: 'Suraji',
    title: 'SUPERVISOR',
    titleContact: 'OPERATIONS LEAD',
    accountId: 'ACC-001',
    accountName: 'KALIMANTAN PRIMA PERSADA',
    branchSiteSupport: 'Sangkulirang FMC ST',
    reportToId: null,
    reportToName: null,
    contactOwnerId: 'USR-001',
    contactOwnerName: 'Bambang Suraji',
    contactOwnerAvatar: 'BS',
    department: 'Operations',
    externalId: 'BAMBANG_SURAJI_0000020862_SUPERVISOR_621234567890',
    isActive: true,
    verified: true,
    pic: false,

    email: 'bambang.suraji@kpp.co.id',
    email2: null,
    mobile: '+62-8123-456-789',
    mobile2: null,
    mobile3: null,
    phone: '(021) 4612015',
    fax: null,
    broadcast: true,
    haveEmail: true,
    activeEmail: true,
    haveWhatsApp: true,
    activeWhatsApp: true,

    needFollowUp: false,
    previousFollowUp: '2026-06-01',
    nextFollowUp: null,
    activationContactDate: '2023-01-10',
    source: 'SVC - Service Department Head',
    emailSupport: 'support@kpp.co.id',
    oldContact: false,
    reasonDeleted: null,

    mailingStreet: 'Jl. Raya RM 22, Cibubur',
    mailingCity: 'Jakarta',
    mailingState: 'DKI Jakarta',
    mailingPostalCode: '13210',
    mailingCountry: 'Indonesia',
    otherStreet: null,
    otherCity: null,
    otherCountry: null,

    createdBy: { id: 'USR-002', name: 'Admin User', avatar: 'AU' },
    createdDate: '2023-01-10T08:00:00Z',
    lastModifiedBy: { id: 'USR-001', name: 'Bambang Suraji', avatar: 'BS' },
    lastModifiedDate: '2026-06-01T14:30:00Z',
  },
  {
    id: 'CTR-003',
    salutation: 'Ms.',
    firstName: 'Siti',
    lastName: 'Nursyamsu',
    title: 'ENGINEER',
    titleContact: 'TECHNICAL LEAD',
    accountId: 'ACC-002',
    accountName: 'BUKIT MAKMUR MANDIRI UTAMA',
    branchSiteSupport: 'Bukittinggi Branch',
    reportToId: null,
    reportToName: null,
    contactOwnerId: 'USR-003',
    contactOwnerName: 'Agus Mizni',
    contactOwnerAvatar: 'AM',
    department: 'Engineering',
    externalId: 'SITI_NURSYAMSU_0000018421_ENGINEER_629876543210',
    isActive: true,
    verified: true,
    pic: true,

    email: 'siti.nursyamsu@bmmu.co.id',
    email2: null,
    mobile: '+62-8765-432-109',
    mobile2: null,
    mobile3: null,
    phone: '(62) 271-656565',
    fax: null,
    broadcast: false,
    haveEmail: true,
    activeEmail: true,
    haveWhatsApp: true,
    activeWhatsApp: false,

    needFollowUp: true,
    previousFollowUp: '2026-04-15',
    nextFollowUp: '2026-07-15',
    activationContactDate: '2023-03-20',
    source: 'SVC - Service Department Head',
    emailSupport: 'support@bmmu.co.id',
    oldContact: false,
    reasonDeleted: null,

    mailingStreet: 'Jl. Ahmad Yani 89',
    mailingCity: 'Bukittinggi',
    mailingState: 'Sumatera Barat',
    mailingPostalCode: '26122',
    mailingCountry: 'Indonesia',
    otherStreet: null,
    otherCity: null,
    otherCountry: null,

    createdBy: { id: 'USR-002', name: 'Admin User', avatar: 'AU' },
    createdDate: '2023-03-20T11:45:00Z',
    lastModifiedBy: { id: 'USR-003', name: 'Agus Mizni', avatar: 'AM' },
    lastModifiedDate: '2026-06-05T10:20:00Z',
  },
  {
    id: 'CTR-004',
    salutation: 'Mr.',
    firstName: 'Rudi',
    lastName: 'Hartono',
    title: 'MANAGER',
    titleContact: 'SITE MANAGER',
    accountId: 'ACC-003',
    accountName: 'PT. PUTRA TERATAI JAYA',
    branchSiteSupport: 'Tangerang Site',
    reportToId: null,
    reportToName: null,
    contactOwnerId: 'USR-004',
    contactOwnerName: 'Sarah Jenkins',
    contactOwnerAvatar: 'SJ',
    department: 'Management',
    externalId: 'RUDI_HARTONO_0000021154_MANAGER_625555555555',
    isActive: false,
    verified: true,
    pic: false,

    email: 'rudi.hartono@putrajaya.co.id',
    email2: null,
    mobile: '+62-8555-555-555',
    mobile2: null,
    mobile3: null,
    phone: '(62) 21-2902-8868',
    fax: null,
    broadcast: false,
    haveEmail: true,
    activeEmail: false,
    haveWhatsApp: false,
    activeWhatsApp: false,

    needFollowUp: false,
    previousFollowUp: null,
    nextFollowUp: null,
    activationContactDate: null,
    source: 'Imported',
    emailSupport: null,
    oldContact: false,
    reasonDeleted: null,

    mailingStreet: 'Jl. Batu Ceper 45',
    mailingCity: 'Tangerang',
    mailingState: 'Banten',
    mailingPostalCode: '15124',
    mailingCountry: 'Indonesia',
    otherStreet: null,
    otherCity: null,
    otherCountry: null,

    createdBy: { id: 'USR-002', name: 'Admin User', avatar: 'AU' },
    createdDate: '2023-08-12T09:00:00Z',
    lastModifiedBy: { id: 'USR-004', name: 'Sarah Jenkins', avatar: 'SJ' },
    lastModifiedDate: '2026-04-20T13:15:00Z',
  },
];

// Salutation picklist
export const SALUTATIONS = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'];

// Title Contact picklist (UT-specific)
export const TITLE_CONTACTS = ['STAFF UNIT', 'SUPERVISOR', 'OPERATIONS LEAD', 'TECHNICAL LEAD', 'SITE MANAGER', 'PLANNER', 'ENGINEER', 'MANAGER'];

// Source picklist
export const SOURCES = [
  'SVC - Service Department Head',
  'Sales Team',
  'Imported',
  'LinkedIn',
  'Referral',
  'Event',
];

// Helpers
export function contactById(id) {
  return SAMPLE_CONTACTS.find(c => c.id === id) || null;
}

export function contactsByAccount(accountId) {
  return SAMPLE_CONTACTS.filter(c => c.accountId === accountId);
}

export function contactsByOwner(userId) {
  return SAMPLE_CONTACTS.filter(c => c.contactOwnerId === userId);
}

export function getFollowUpQueue(userId) {
  return SAMPLE_CONTACTS.filter(c =>
    c.contactOwnerId === userId &&
    c.needFollowUp &&
    c.nextFollowUp &&
    new Date(c.nextFollowUp) <= new Date()
  ).sort((a, b) => new Date(a.nextFollowUp) - new Date(b.nextFollowUp));
}

export function getContactInitials(contact) {
  return (contact.firstName?.[0] || '') + (contact.lastName?.[0] || '');
}

export function getFullName(contact) {
  const salutation = contact.salutation ? `${contact.salutation} ` : '';
  return `${salutation}${contact.firstName} ${contact.lastName}`;
}

export function getContactStatus(isActive) {
  return isActive ? 'Active' : 'Inactive';
}

export function getCommunicationChannels(contact) {
  const channels = [];
  if (contact.activeEmail) channels.push('Email');
  if (contact.activeWhatsApp) channels.push('WhatsApp');
  return channels.length > 0 ? channels : ['No active channels'];
}
