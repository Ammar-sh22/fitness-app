import { create } from 'zustand';

export type UserRole = 'client' | 'coach' | 'nutritionist';

export type CurrentUser = {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  phone?: string;
  age?: number;

  // provider-only fields
  title?: string;
  yearsOfExperience?: number;
  languages?: string[];
  specialties?: string[];
};

export type Provider = {
  id: string;
  fullName: string;
  role: 'coach' | 'nutritionist';
  title: string;
  yearsOfExperience: number;
  languages: string[];
  specialties: string[];
  pricePerMonth: number;
  currency: string;
};

export type Package = {
  id: string;
  providerId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  durationInDays: number;
};

export type TaskStatus = 'pending' | 'completed';

export type Task = {
  id: string;
  providerId: string;
  title: string;
  description?: string;
  date: string;
  status: TaskStatus;
};

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled';

export type Subscription = {
  id: string;
  clientId: string;
  providerId: string;
  packageId: string;
  status: SubscriptionStatus;
};

export type ChatType = 'client_provider';

export type Chat = {
  id: string;
  clientId: string;
  providerId: string;
  lastMessage: string;
  lastMessageAt: string; // ISO
};

export type Message = {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string; // ISO
};

type AppState = {
  currentUser: CurrentUser | null;
  currentProviderId: string | null;

  providers: Provider[];
  packages: Package[];
  tasks: Task[];
  subscriptions: Subscription[];

  chats: Chat[];
  messages: Message[];

  setCurrentUser: (user: CurrentUser | null) => void;
  setCurrentProviderId: (id: string | null) => void;
  fakeSubscribe: (providerId: string, packageId: string) => void;
  addMessage: (chatId: string, senderId: string, text: string) => void;
};

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: null,
  currentProviderId: null,

  providers: [
    {
      id: 'p1',
      fullName: 'Ahmed Hassan',
      role: 'coach',
      title: 'Fitness Coach',
      yearsOfExperience: 5,
      languages: ['EN', 'AR'],
      specialties: ['weight loss', 'strength'],
      pricePerMonth: 1200,
      currency: 'EGP',
    },
    {
      id: 'p2',
      fullName: 'Sara Ali',
      role: 'nutritionist',
      title: 'Clinical Nutritionist',
      yearsOfExperience: 7,
      languages: ['AR'],
      specialties: ['diabetes', 'weight management'],
      pricePerMonth: 900,
      currency: 'EGP',
    },
    {
      id: 'p3',
      fullName: 'John Doe',
      role: 'coach',
      title: 'Online Personal Trainer',
      yearsOfExperience: 3,
      languages: ['EN'],
      specialties: ['muscle gain'],
      pricePerMonth: 1000,
      currency: 'EGP',
    },
  ],

  packages: [
    {
      id: 'pack1',
      providerId: 'p1',
      title: '4 Weeks Fat Loss',
      description: 'Custom workouts + weekly check-ins.',
      price: 800,
      currency: 'EGP',
      durationInDays: 28,
    },
    {
      id: 'pack2',
      providerId: 'p1',
      title: '12 Weeks Transformation',
      description: 'Full plan, nutrition guidance and chat support.',
      price: 2200,
      currency: 'EGP',
      durationInDays: 84,
    },
    {
      id: 'pack3',
      providerId: 'p2',
      title: 'Nutrition Plan (1 month)',
      description: 'Meal plan + adjustments every week.',
      price: 900,
      currency: 'EGP',
      durationInDays: 30,
    },
    {
      id: 'pack4',
      providerId: 'p3',
      title: 'Muscle Gain Coaching',
      description: 'Hypertrophy program, weekly updates.',
      price: 1000,
      currency: 'EGP',
      durationInDays: 30,
    },
  ],

  tasks: [
    {
      id: 't1',
      providerId: 'p1',
      title: 'Morning workout',
      description: '30 min cardio + stretching',
      date: new Date().toISOString().slice(0, 10),
      status: 'pending',
    },
    {
      id: 't2',
      providerId: 'p1',
      title: 'Evening workout',
      description: 'Upper body strength session',
      date: new Date().toISOString().slice(0, 10),
      status: 'pending',
    },
    {
      id: 't3',
      providerId: 'p2',
      title: 'Log today meals',
      description: 'Send photos of breakfast, lunch, dinner',
      date: new Date().toISOString().slice(0, 10),
      status: 'pending',
    },
  ],

  subscriptions: [],

  // initial chats and messages
  chats: [
    {
      id: 'chat1',
      clientId: 'demo_client',
      providerId: 'p1',
      lastMessage: 'See you tomorrow at the gym!',
      lastMessageAt: new Date().toISOString(),
    },
    {
      id: 'chat2',
      clientId: 'demo_client',
      providerId: 'p2',
      lastMessage: 'Please send your meals photos.',
      lastMessageAt: new Date().toISOString(),
    },
  ],

  messages: [
    {
      id: 'm1',
      chatId: 'chat1',
      senderId: 'p1',
      text: 'Hi, how was your workout today?',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'm2',
      chatId: 'chat1',
      senderId: 'demo_client',
      text: 'It was great, I finished all sets.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'm3',
      chatId: 'chat2',
      senderId: 'p2',
      text: 'Remember to drink enough water.',
      createdAt: new Date().toISOString(),
    },
  ],

  setCurrentUser: (user) => set({ currentUser: user }),

  setCurrentProviderId: (id) => set({ currentProviderId: id }),

  fakeSubscribe: (providerId, packageId) => {
    const state = get();
    const user = state.currentUser;
    if (!user) return;

    const newSub: Subscription = {
      id: `sub_${Date.now()}`,
      clientId: user.id,
      providerId,
      packageId,
      status: 'active',
    };

    set({
      currentProviderId: providerId,
      subscriptions: [...state.subscriptions, newSub],
    });
  },

  addMessage: (chatId, senderId, text) => {
    const state = get();
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      chatId,
      senderId,
      text,
      createdAt: new Date().toISOString(),
    };

    const updatedChats = state.chats.map((c) =>
      c.id === chatId
        ? { ...c, lastMessage: text, lastMessageAt: newMsg.createdAt }
        : c
    );

    set({
      messages: [...state.messages, newMsg],
      chats: updatedChats,
    });
  },
}));
