// src/core/types/User.ts

export type UserRole = 'client' | 'coach' | 'nutritionist';

export interface User {
  id: string;
  role: UserRole;

  // Common fields
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;

  // Auth / status
  isEmailVerified: boolean;
  isActive: boolean;       // can login/use app
  createdAt: string;       // ISO date
  updatedAt: string;

  // Coach/Nutri extra fields (for custom form)
  title?: string;          // e.g. "Fitness Coach", "Nutritionist"
  yearsOfExperience?: number;
  languages?: string[];    // ['en', 'ar']
  specialties?: string[];  // ['weight_loss', 'muscle_gain']
  bio?: string;
  priceRangePerMonth?: {
    min: number;
    max: number;
    currency: string;      // e.g. "EGP"
  };
}
