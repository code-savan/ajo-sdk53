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
    { title: 'Total Volume', value: '₦12.8M', change: '+23%' },
    { title: 'Growth Rate', value: '+23.5%', change: '+5%' },
  ],
};

export const users = [
  { id: 'u-1001', name: 'Iren Kukoma', email: 'irenkukoma@ncdmb.gov', status: 'active', joinedAt: '2024-05-02' },
  { id: 'u-1002', name: 'Adaeze Obi', email: 'ada.obi@example.com', status: 'pending', joinedAt: '2024-05-11' },
  { id: 'u-1003', name: 'Tunde Ade', email: 'tunde.ade@example.com', status: 'suspended', joinedAt: '2024-06-21' },
];

export const groups = [
  { id: 'g-2001', name: 'Abuja Savers', members: 24, cycle: 'Weekly', balance: '₦1,240,000' },
  { id: 'g-2002', name: 'Kano Traders', members: 16, cycle: 'Monthly', balance: '₦860,000' },
  { id: 'g-2003', name: 'Lagos Crew', members: 32, cycle: 'Daily', balance: '₦2,110,000' },
];

export const transactions = [
  { id: 't-3001', userId: 'u-1001', type: 'deposit', amount: '₦50,000', date: '2025-08-01', status: 'success' },
  { id: 't-3002', userId: 'u-1002', type: 'withdrawal', amount: '₦25,000', date: '2025-08-04', status: 'pending' },
  { id: 't-3003', userId: 'u-1003', type: 'deposit', amount: '₦15,000', date: '2025-08-08', status: 'failed' },
];

export const payouts = [
  { id: 'p-4001', groupId: 'g-2001', amount: '₦120,000', scheduledFor: '2025-08-20', status: 'scheduled' },
  { id: 'p-4002', groupId: 'g-2003', amount: '₦80,000', scheduledFor: '2025-08-25', status: 'processing' },
];

export const notificationsList = [
  { id: 'n-5001', title: 'System maintenance', body: 'Downtime on Saturday 11 PM - 1 AM.', date: '2025-08-10' },
  { id: 'n-5002', title: 'New feature', body: 'Group analytics now available.', date: '2025-08-06' },
];

export const settingsDemo = {
  general: { appName: 'AJO', timezone: 'Africa/Lagos' },
  security: { twoFactorRequired: true, passwordPolicy: 'Strong' },
  payouts: { defaultCycle: 'Weekly', minWithdrawal: '₦5,000' },
};

