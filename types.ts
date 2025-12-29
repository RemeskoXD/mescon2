
import React from 'react';

export type UserRole = 'nope' | 'student' | 'premium' | 'vip' | 'support' | 'admin' | 'expired';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

export interface SystemSettings {
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  globalBanner: string;
  version: string;
  lootBoxConfig?: LootBoxItem[]; // Konfigurace dropů
  landingTicketLink?: string; // Globální link pro nákup na home page
  landingFreeLink?: string;   // Globální link pro registraci zdarma na home page
  leaderboardBanner?: {
      active: boolean;
      title: string;
      text: string;
      timer: string; // e.g. "2d 14h"
  };
  // NEW: AI Mentor Settings
  aiEnabled?: boolean;
  aiSystemInstruction?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'level_up';
  read: boolean;
  createdAt: string;
  link?: string; // Odkaz na akci (např. na kurz)
}

export interface Channel {
  id: string;
  name: string;
  icon: 'hash' | 'trophy' | 'megaphone' | 'message' | 'zap' | 'dollar' | 'code';
  description?: string;
  minRole?: UserRole;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image';
  channelId?: string; // 'general', 'wins', etc. (Optional if DM)
  recipientId?: string; // If set, it's a DM
  likes: string[]; // User IDs
}

export interface LevelRequirement {
  level: number;
  xpRequired: number;
  title: string;
}

export interface LootBoxItem {
  artifactId: string;
  dropChance: number; // 0-100%
}

export interface Artifact {
  id: string;
  name: string;
  description: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  type: 'badge' | 'consumable' | 'ticket';
  quantity: number;
  price?: number;
  effectType?: 'xp_boost' | 'loot_box';
  effectDuration?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'custom'; // Custom = uživatelská
  targetCount: number;
  rewardXP: number;
  rewardArtifactId?: string;
  creatorId?: string; // Pokud je custom
}

export interface UserChallengeProgress {
  challengeId: string;
  currentCount: number;
  completed: boolean;
  lastUpdated: string;
  history: boolean[];
}

export interface Certificate {
  id: string;
  courseId: string;
  courseName: string;
  studentName: string;
  issueDate: string;
  code: string;
  qrCodeUrl?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'webinar' | 'workshop' | 'meetup';
  link?: string; // Join link (Zoom, Meet)
  registrationLink?: string; // External link to buy ticket
  freeRegistrationLink?: string; // External link for free registration
  registeredUserIds: string[];
  approvedUserIds: string[]; // Pro XP reward
  maxAttendees?: number;
  price?: number;
  isFreeForVip?: boolean;
  isFreeForPremium?: boolean;
  xpReward?: number;
}

export interface Stream {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  streamUrl: string;
  date: string;
  status: 'upcoming' | 'live' | 'ended';
  viewers: number;
  minRole: UserRole; // Kdo může sledovat záznam/live
}

export interface Ebook {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  downloadUrl: string;
  pages: number;
  author: string;
  minRole: UserRole;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  hourlyRate: number;
  xpRate: number; // Cena v XP
  isAvailable: boolean;
  nextAvailableDate?: string;
}

export interface Booking {
  id: string;
  mentorId: string;
  userId: string;
  userEmail: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  note: string;
  meetingLink?: string;
  adminNote?: string;
  rating?: number;
  paymentType: 'free_trial' | 'xp' | 'cash' | 'unlimited_vip';
}

export interface CommunitySession {
  id: string;
  hostUserId: string;
  hostName: string;
  topic: string;
  date: string;
  description: string;
  maxAttendees: number;
  attendees: string[];
}

export interface SupportTicket {
  id: string;
  userId: string;
  userEmail: string;
  subject: string;
  status: 'open' | 'closed' | 'pending';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  messages: {
    sender: 'user' | 'support';
    text: string;
    timestamp: string;
  }[];
}

export interface BonusTask {
  id: string;
  title: string;
  description: string;
  rewardXP: number;
  deadline?: string;
  proofType: 'text' | 'image' | 'link';
}

export interface BonusSubmission {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  // Fix: Added 'claimed' to status type
  status: 'pending' | 'approved' | 'rejected' | 'claimed';
  submittedAt: string;
}

// --- LMS TYPES ---

export type LessonType = 'video' | 'text' | 'quiz' | 'assignment';

export interface LessonAttachment {
  name: string;
  url: string;
  type: 'pdf' | 'link' | 'file';
}

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  content: string; // Video URL, Text content, or Assignment Prompt
  duration: number;
  isMandatory: boolean;
  questions?: QuizQuestion[];
  attachments?: LessonAttachment[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  level: UserRole;
  unlockPriceXP?: number; // Možnost odemknout za XP i bez role
  author: string;
  modules: CourseModule[];
  totalDuration: number;
  published: boolean;
  xpReward: number;
  learningPoints: string[];
}

export interface UserCourseProgress {
  courseId: string;
  completedLessonIds: string[];
  lastPlayedLessonId?: string;
  isCompleted: boolean;
  quizScores: Record<string, number>;
  assignments?: Record<string, string>; // lessonId -> submission content
  notes?: string; // Poznámky ke kurzu
  isRepeated?: boolean; // Pokud opakuje, nedostává XP
}

// --- QUIZ SYSTEM TYPES ---

export interface Quiz {
  id: string;
  title: string;
  description: string;
  image: string;
  level: UserRole;
  xpReward: number;
  passingScore: number;
  questions: QuizQuestion[];
  published: boolean;
}

export interface UserQuizHistory {
  quizId: string;
  score: number;
  passed: boolean;
  completedAt: string;
  attempts: number;
}

export interface AdminNote {
  id: string;
  author: string;
  text: string;
  date: string;
}

export interface DashboardMessage {
  text: string;
  imageUrl?: string;
  pdfUrl?: string;
  active: boolean;
}

export interface Transaction {
    id: string;
    date: string; // ISO Date
    amount: number;
    type: 'income' | 'expense';
    category: string;
    note?: string;
}

export interface PersonalNote {
    id: string;
    title: string;
    content: string;
    updatedAt: string;
    tags?: string[];
}

export interface Habit {
    id: string;
    name: string;
    created: string;
    completedDates: string[]; // ['2023-10-01', '2023-10-02']
}

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role: UserRole;
  level: number;
  xp: number;
  xpBoostUntil?: string;
  planExpires?: string; // ISO date string. If undefined/null = NO active plan (unless admin/lifetime)
  isBanned: boolean;
  mutedUntil?: string; // ISO date when mute expires
  joinDate: string;
  lastLogin: string;
  loginStreak?: number; // Daily login streak
  lastStreakUpdate?: string; 
  lastDailyClaim?: string; // ISO Date of last daily XP claim
  bio?: string;
  avatarUrl?: string;
  
  // Settings
  isPublicProfile: boolean; // Leaderboard visibility
  skills?: string[]; // New: User skills (e.g. Sales, Marketing)
  interests?: string[]; // New: What user is looking for (e.g. Co-founder)
  notifiedExpiring?: boolean; // Flag to track if we already warned user

  // Finance & Tools
  financialRecords: Transaction[];
  financialProfit?: number; // Calculated or stored profit
  profitHistory?: any[]; // For graphs
  habits?: Habit[]; // NEW: Habit Tracker

  // Gamification
  inventory: Artifact[];
  activeChallenges: UserChallengeProgress[];
  certificates: Certificate[];
  
  // LMS
  courseProgress: UserCourseProgress[];
  lessonNotes: Record<string, string>; // lessonId -> note text
  personalNotes?: PersonalNote[]; // General independent notes
  quizHistory: UserQuizHistory[];
  
  // Admin & Communication
  adminNotes: AdminNote[];
  dashboardMessage?: DashboardMessage;
  messages: Message[]; // Inbox system
  notifications: Notification[]; // System alerts
}
