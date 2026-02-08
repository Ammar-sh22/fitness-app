// src/core/types/Task.ts

export type TaskStatus = 'pending' | 'completed' | 'cancelled';

export interface Task {
  id: string;
  clientId: string;
  coachId: string;          // or nutritionist
  subscriptionId: string;   // link to active subscription

  title: string;
  description?: string;
  date: string;             // the day it belongs to (for calendar/today)
  dueTime?: string;         // optional, e.g. "18:00"

  status: TaskStatus;
  completedAt?: string;
  // Confirmation flags
  confirmedByClient: boolean;
  confirmedByCoach: boolean;

  createdAt: string;
  updatedAt: string;
}
