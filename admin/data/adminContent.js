// Centralized demo content for the AJO Admin
// Replace these with real API calls later.

export const navSections = {
  main: [
    { key: 'overview', label: 'Overview', href: '/' },
    { key: 'users', label: 'User Management', href: '/users' },
    { key: 'groups', label: 'Group Management', href: '/groups' },
    { key: 'financial', label: 'Financial  Management', href: '/financial' },
    { key: 'analytics', label: 'Analytics', href: '/analytics' },
    { key: 'notifications', label: 'Notifications', href: '/notifications' },
  ],
  support: [
    { key: 'settings', label: 'Settings', href: '/settings' },
    { key: 'help', label: 'Help & Support', href: '/help' },
  ],
};

export const demoStats = {
  overview: [
    { title: 'Total Users', value: '2,845', change: '+12%' },
    { title: 'Active Groups', value: '142', change: '+8%' },
    { title: 'Total Volume', value: '$12.8M', change: '+23%' },
    { title: 'Growth Rate', value: '+23.5%', change: '+5%' },
  ],
};

export const users = [
  {
    id: 'u-1001',
    name: 'Iren Kukoma',
    email: 'irenkukoma@ncdmb.gov',
    phone: '+234 802 345 6789',
    status: 'active',
    joinedAt: '2024-05-02',
    lastLogin: '2025-08-15 09:30 AM',
    referralSource: 'Direct',
    totalSavings: '$450,000',
    groupCount: 3,
    verificationStatus: 'verified',
    riskLevel: 'low'
  },
  {
    id: 'u-1002',
    name: 'Adaeze Obi',
    email: 'ada.obi@example.com',
    phone: '+234 803 456 7890',
    status: 'pending',
    joinedAt: '2024-05-11',
    lastLogin: '2025-08-14 02:15 PM',
    referralSource: 'User Referral',
    totalSavings: '$0',
    groupCount: 0,
    verificationStatus: 'pending',
    riskLevel: 'medium'
  },
  {
    id: 'u-1003',
    name: 'Tunde Ade',
    email: 'tunde.ade@example.com',
    phone: '+234 805 678 9012',
    status: 'suspended',
    joinedAt: '2024-06-21',
    lastLogin: '2025-07-30 11:45 AM',
    referralSource: 'Social Media',
    totalSavings: '$125,000',
    groupCount: 1,
    verificationStatus: 'verified',
    riskLevel: 'high'
  },
  {
    id: 'u-1004',
    name: 'Fatima Ibrahim',
    email: 'fatima.i@example.com',
    phone: '+234 806 789 0123',
    status: 'active',
    joinedAt: '2024-07-15',
    lastLogin: '2025-08-15 08:00 AM',
    referralSource: 'Google Ads',
    totalSavings: '$780,000',
    groupCount: 5,
    verificationStatus: 'verified',
    riskLevel: 'low'
  },
  {
    id: 'u-1005',
    name: 'Chidi Okonkwo',
    email: 'chidi.ok@example.com',
    phone: '+234 807 890 1234',
    status: 'inactive',
    joinedAt: '2024-03-10',
    lastLogin: '2025-06-01 04:30 PM',
    referralSource: 'Direct',
    totalSavings: '$50,000',
    groupCount: 1,
    verificationStatus: 'verified',
    riskLevel: 'low'
  },
];

// User activity logs
export const userActivityLogs = [
  { id: 'log-001', userId: 'u-1001', action: 'Login', timestamp: '2025-08-15 09:30 AM', ip: '102.89.33.145', status: 'success' },
  { id: 'log-002', userId: 'u-1001', action: 'Joined Group', timestamp: '2025-08-15 09:35 AM', details: 'Lagos Savers Group', status: 'success' },
  { id: 'log-003', userId: 'u-1002', action: 'Login Attempt', timestamp: '2025-08-14 02:10 PM', ip: '197.210.226.60', status: 'failed' },
  { id: 'log-004', userId: 'u-1002', action: 'Login', timestamp: '2025-08-14 02:15 PM', ip: '197.210.226.60', status: 'success' },
  { id: 'log-005', userId: 'u-1003', action: 'Withdrawal', timestamp: '2025-07-30 11:45 AM', details: '$25,000', status: 'flagged' },
  { id: 'log-006', userId: 'u-1004', action: 'Deposit', timestamp: '2025-08-15 08:05 AM', details: '$100,000', status: 'success' },
];

// Support tickets
export const supportTickets = [
  { id: 'ticket-001', userId: 'u-1001', subject: 'Cannot access group', status: 'open', priority: 'high', createdAt: '2025-08-14', assignedTo: 'Admin' },
  { id: 'ticket-002', userId: 'u-1002', subject: 'Verification pending', status: 'in-progress', priority: 'medium', createdAt: '2025-08-13', assignedTo: 'Support Team' },
  { id: 'ticket-003', userId: 'u-1003', subject: 'Account suspended', status: 'open', priority: 'high', createdAt: '2025-08-01', assignedTo: 'Admin' },
  { id: 'ticket-004', userId: 'u-1004', subject: 'Payment not reflecting', status: 'resolved', priority: 'low', createdAt: '2025-08-10', assignedTo: 'Finance Team' },
];

export const groups = [
  { id: 'g-2001', name: 'Miami Vacation', members: 24, cycle: 'Weekly', balance: '$1,240,000' },
  { id: 'g-2002', name: 'JT Ins. Piggy Bank', members: 16, cycle: 'Monthly', balance: '$860,000' },
  { id: 'g-2003', name: 'Drent Club', members: 32, cycle: 'Daily', balance: '$2,110,000' },
];

export const transactions = [
  { id: 't-3001', userId: 'u-1001', type: 'deposit', amount: '$50,000', date: '2025-08-01', status: 'success' },
  { id: 't-3002', userId: 'u-1002', type: 'withdrawal', amount: '$25,000', date: '2025-08-04', status: 'pending' },
  { id: 't-3003', userId: 'u-1003', type: 'deposit', amount: '$15,000', date: '2025-08-08', status: 'failed' },
];

export const payouts = [
  { id: 'p-4001', groupId: 'g-2001', amount: '$120,000', scheduledFor: '2025-08-20', status: 'scheduled' },
  { id: 'p-4002', groupId: 'g-2003', amount: '$80,000', scheduledFor: '2025-08-25', status: 'processing' },
];

export const notificationsList = [
  { id: 'n-5001', title: 'System maintenance', body: 'Downtime on Saturday 11 PM - 1 AM.', date: '2025-08-10' },
  { id: 'n-5002', title: 'New feature', body: 'Group analytics now available.', date: '2025-08-06' },
];

export const settingsDemo = {
  general: { appName: 'AJO', timezone: 'Africa/Lagos' },
  security: { twoFactorRequired: true, passwordPolicy: 'Strong' },
  payouts: { defaultCycle: 'Weekly', minWithdrawal: '$5,000' },
};
