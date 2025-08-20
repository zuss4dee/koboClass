// Shared constants to avoid duplication

export const CATEGORIES = [
  'Design', 'Tech', 'Business', 'Career', 'Creative', 'Music', 
  'Fashion', 'Photography', 'Cooking', 'Writing', 'Dance', 'Makeup'
] as const;

export const USER_ROLES = ['learner', 'host', 'both'] as const;

export const ADMIN_ROLES = ['admin', 'moderator'] as const;

export const TICKET_STATUSES = ['pending', 'paid', 'refunded', 'failed'] as const;

export const PAYOUT_STATUSES = ['pending', 'paid', 'failed'] as const;

export const REFUND_STATUSES = ['pending', 'approved', 'rejected'] as const;

export const PRICE_LIMITS = {
  MIN_NAIRA: 1000,
  MAX_NAIRA: 5000,
  MIN_KOBO: 100000,
  MAX_KOBO: 500000
} as const;

export const DURATION_LIMITS = {
  MIN_MINUTES: 30,
  MAX_MINUTES: 240,
  DEFAULT_MINUTES: 90
} as const;

export const COMMISSION_RATES = {
  HOST_SHARE: 0.8,
  PLATFORM_FEE: 0.2
} as const;

export const RATING_LIMITS = {
  MIN: 1,
  MAX: 5
} as const;

export const CURRENCIES = {
  DEFAULT: 'NGN'
} as const;

export const NOTIFICATION_TYPES = [
  'reminder',
  'final-call', 
  'rating',
  'general'
] as const;

export const SOCIAL_PLATFORMS = [
  'instagram',
  'twitter', 
  'linkedin'
] as const;