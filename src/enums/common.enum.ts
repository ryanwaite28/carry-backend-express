export enum STATUSES {
  PENDING = `PENDING`,
  CANCELED = `CANCELED`,
  ACCEPTED = `ACCEPTED`,
  DECLINED = `DECLINED`,
  OPEN = `OPEN`,
  RESCINDED = `RESCINDED`,
}



export const DURATION_1_SECOND = 1000;
export const DURATION_1_MINUTE = DURATION_1_SECOND * 60;
export const DURATION_1_HOUR = DURATION_1_MINUTE * 60;
export const DURATION_1_DAY_HALF = DURATION_1_HOUR * 12;
export const DURATION_1_DAY_FULL = DURATION_1_HOUR * 24;
export const DURATION_1_WEEK = DURATION_1_DAY_FULL * 7;
export enum COMMON_DURATIONS {
  SECOND = DURATION_1_SECOND,
  MINUTE = DURATION_1_MINUTE,
  HOUR = DURATION_1_HOUR,
  DAY = DURATION_1_DAY_FULL,
  WEEK = DURATION_1_WEEK,
}



export enum STRIPE_ACTION_EVENTS {
  CHARGE = 'CHARGE',
  TRANSFER = 'TRANSFER',
  REFUND = 'REFUND',
  TRANSFER_REVERSAL = 'TRANSFER_REVERSAL',
  PAYMENT_INTENT = 'PAYMENT_INTENT',
}

export enum STRIPE_PAYOUT_TYPES {
  STANDARD = 'STANDARD',
  INSTANT = 'INSTANT',
}

export enum API_KEY_SUBSCRIPTION_PLAN {
  FREE = 'FREE',
  PERSONAL = 'PERSONAL',
  BUSINESS = 'BUSINESS',
  ENTERPRISE = 'ENTERPRISE',
}

export enum TRANSACTION_TYPES {
  TRANSACTION = 'TRANSACTION',
  CHARGE = 'CHARGE',
  REFUND = 'REFUND',
  PAID = 'PAID',
  TRANSFER = 'TRANSFER',
}

export enum TRANSACTION_STATUS {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED',
  DECLINED = 'DECLINED',
}