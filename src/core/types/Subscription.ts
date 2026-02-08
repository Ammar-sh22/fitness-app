// src/core/types/Subscription.ts

export type SubscriptionStatus =
  | 'pending_payment'
  | 'active'
  | 'expired'
  | 'cancelled';

export interface Subscription {
  id: string;
  clientId: string;
  coachId: string;          // or nutritionist; again role is in User
  packageId: string;

  status: SubscriptionStatus;
  startDate: string;        // ISO
  endDate: string;

  // Payment info (Paymob)
  paymentProvider: 'paymob';
  paymentReference: string; // transaction id / order id from Paymob
  lastPaymentStatus: 'pending' | 'paid' | 'failed';

  createdAt: string;
  updatedAt: string;
}
