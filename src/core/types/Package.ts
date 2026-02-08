// src/core/types/Package.ts

export interface Package {
  id: string;
  coachId: string;           // or nutritionistId; same field since role is in User
  title: string;             // e.g. "3-Month Transformation"
  description: string;
  price: number;
  currency: string;          // "EGP"
  durationInDays: number;    // e.g. 30, 90

  maxClients?: number;       // optional limit
  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}
