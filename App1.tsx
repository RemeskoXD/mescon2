
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import CoursesComponent from './components/Courses';
import Pricing from './components/Pricing';
import Team from './components/Team';
import FAQ from './components/FAQ';
import ComingSoonAI from './components/ComingSoonAI';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import CertificateVerify from './components/CertificateVerify';
import CheckoutModal from './components/CheckoutModal';
import LandingTicketSection from './components/LandingTicketSection'; // New Import
import { motion, AnimatePresence } from 'framer-motion';
import { User, Challenge, Artifact, Certificate, CalendarEvent, BonusTask, BonusSubmission, SystemSettings, Course, Quiz, Mentor, Booking, Ebook, Stream, SupportTicket, LevelRequirement, Message, Channel, Notification, ToastMessage } from './types';
import { auth, db } from './firebase';
// @ts-ignore
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot, updateDoc, setDoc, collection, query, writeBatch, deleteDoc, orderBy, limit, arrayUnion, getDoc, arrayRemove } from 'firebase/firestore';
import { CheckCircle, XCircle, Info } from 'lucide-react';

const MotionDiv = motion.div as any;

const ADMIN_EMAILS = [
  'betvix8@gmail.com',
  'ludvikremeskework@gmail.com',
  'vasek.gabriel@mescon.cz'
];

const INITIAL_COURSES: Course[] = [
  {
    id: 'course-sales-101',
    title: 'Sales Masterclass: Psychologie Prodeje',
    description: 'Základní pilíř akademie. Kompletní průvodce moderním prodejem. Naučte se uzavírat obchody, pracovat s námitkami a chápat psychologii nákupu.',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800',
    level: 'student',
    author: 'Vašek Gabriel',
    totalDuration: 180,
    published: true,
    xpReward: 500,
    learningPoints: ['Psychologie nákupu', 'Handling námitek', 'High-Ticket Sales', 'CRM Systémy'],
    modules: [
      {
        id: 'mod-sales-1',
        title: 'Základy a Mindset Obchodníka',
        lessons: [
          { id: 'les-s1-1', title: 'Úvod do Sales Masterclass', type: 'video', content: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: 10, isMandatory: true },
          { id: 'les-s1-2', title: 'Proč lidé nakupují?', type: 'text', content: 'Lidé nekupují produkty, kupují řešení.', duration: 15, isMandatory: true }
        ]
      }
    ]
  }
];

const INITIAL_ARTIFACTS: Artifact[] = [
    { id: 'art-basic-box', name: 'BASIC BOX', description: 'Základní balíček pro začátečníky.', image: '📦', rarity: 'common', type: 'consumable', price: 1000, quantity: 0, effectType: 'loot_box' },
    { id: 'art-xp-potion', name: 'Lektvar Soustředění', description: 'Zvyšuje zisk XP o 100% (2x) na 2 hodiny.', image: '🧪', rarity: 'rare', type: 'consumable', price: 500, quantity: 0, effectType: 'xp_boost', effectDuration: 2 },
    { id: 'art-mystery-box', name: 'Mystery Box', description: 'Obsahuje náhodnou odměnu (XP nebo předmět).', image: '🎁', rarity: 'epic', type: 'consumable', price: 800, quantity: 0, effectType: 'loot_box' },
    { id: 'art-badge-loyalty', name: 'Odznak Věrnosti', description: 'Sběratelský předmět pro věrné členy.', image: '🏅', rarity: 'legendary', type: 'badge', price: 5000, quantity: 0 },
    { id: 'art-coffee', name: 'Káva pro Mentora', description: 'Symbolický dar, nic nedělá, ale potěší.', image: '☕', rarity: 'common', type: 'consumable', price: 50, quantity: 0 }
];

const INITIAL_SETTINGS: SystemSettings = { 
    maintenanceMode: false, 
    allowRegistrations: true, 
    globalBanner: '', 
    version: '2.4.0 PRO-GOLD',
    leaderboardBanner: {
        active: true,
        title: 'Týdenní Odměna',
        text: 'Top 10 hráčů získá v neděli náhodný předmět!',
        timer: '3d 12h'
    }
};

const INITIAL_LEVELS: LevelRequirement[] = Array.from({length: 100}, (_, i) => ({
    level: i + 1,
    xpRequired: i === 0 ? 0 : Math.floor(1000 * Math.pow(i, 1.4)),
    title: i < 5 ? 'Nováček' : i < 15 ? 'Učeň' : i < 30 ? 'Pokročilý' : i < 50 ? 'Expert' : i < 80 ? 'Mistr' : 'Legenda'
}));

const App1: React.FC = () => {
  const [view, setView] = useState<'landing' | 'dashboard' | 'admin' | 'verify'>('landing');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState({ name: 'BASIC_YEARLY', price: 9480 });
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [realUser, setRealUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(INITIAL_SETTINGS);
  const [challenges, setChallenges] = useState<Challenge[]>([]); 
  const [courses, setCourses] = useState<Course[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [bonusTasks, setBonusTasks] = useState<BonusTask[]>([]);
  const [submissions, setSubmissions] = useState<BonusSubmission[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [levelRequirements, setLevelRequirements] = useState<LevelRequirement[]>([]);
  const [communityMessages, setCommunityMessages] = useState<Message[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [showLevelUp, setShowLevelUp] = useState<number | undefined>(undefined);

  useEffect(() => {
      const unsubscribeUsers = onSnapshot(query(collection(db, "users")), (snap) => {
          const list: User[] = [];
          snap.forEach(d => list.push(d.data() as User));
          setAllUsers(list);
      });

      const sync = (col: string, init: any[], set: any, seed = true) => {
          return onSnapshot(query(collection(db, col)), 
            (snap) => {
                if (!snap.empty) {
                    const list: any[] = [];
                    snap.forEach(d => list.push(d.data()));
                    set(list);
                } else if (seed && init.length > 0) {
                    const batch = writeBatch(db);
                    init.forEach((item) => {
                       const ref = item.id ? doc(db, col, item.id) : (item.level ? doc(db, col, `lvl-${item.level}`) : doc(collection(db, col)));
                       batch.set(ref, item);
                    });
                    batch.commit().then(() => set(init));
                } else {
                    set([]);
                }
            }, 
            (err) => console.warn(`Firestore error ${col}:`, err)
          );
      };

      const unsubs = [
          unsubscribeUsers,
          sync("system", [], (d: any[]) => d.length && setSystemSettings(d[0]), false),
          sync("courses", INITIAL_COURSES, setCourses, true),
          sync("artifacts", INITIAL_ARTIFACTS, setArtifacts, true),
          sync("challenges", [], setChallenges, false),
          sync("quizzes", [], setQuizzes, false),
          sync("mentors", [], setMentors, false),
          sync("ebooks", [], setEbooks, false),
          sync("streams", [], setStreams, false),
          sync("calendar_events", [], setEvents, false),
          sync("bonus_tasks", [], setBonusTasks, false),
          sync("levels", INITIAL_LEVELS, setLevelRequirements, true),
          sync("channels", [], setChannels, false),
          sync("bookings", [], setBookings, false),
          sync("tickets", [], setTickets, false),
          sync("submissions", [], setSubmissions, false),
          onSnapshot(query(collection(db, "community_messages"), orderBy('timestamp', 'asc'), limit(200)), (s) => {
              const m: any[] = []; s.forEach(d => m.push(d.data())); setCommunityMessages(m);
          })
      ];
      return () => unsubs.forEach(u => u());
  }, []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser: any) => {
        if (firebaseUser) {
            const userDocRef = doc(db, "users", firebaseUser.uid);
            const unsubscribeUser = onSnapshot(userDocRef, async (docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data() as User;
                    
                    // --- AUTOMATIC SUBSCRIPTION CHECK ---
                    const now = new Date();
                    if (userData.planExpires && userData.role !== 'admin' && userData.role !== 'nope') {
                        const expireDate = new Date(userData.planExpires);
                        
                        // 1. HARD EXPIRATION
                        if (expireDate < now) {
                            await updateDoc(userDocRef, { 
                                role: 'nope', 
                                notifiedExpiring: false,
                                notifications: arrayUnion(createSystemNotification('Předplatné vypršelo', 'Vaše členství bylo ukončeno. Pro další přístup si prosím obnovte plán.', 'error'))
                            });
                            notify('error', 'Expirace', 'Vaše předplatné vypršelo.');
                            return;
                        }

                        // 2. WARNING BEFORE EXPIRATION (7 Days)
                        const diffTime = expireDate.getTime() - now.getTime();
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        
                        if (diffDays > 0 && diffDays <= 7 && !userData.notifiedExpiring) {
                            await updateDoc(userDocRef, { 
                                notifiedExpiring: true,
                                notifications: arrayUnion(createSystemNotification('Předplatné brzy končí', `Vaše členství vyprší za ${diffDays} dní (${expireDate.toLocaleDateString()}). Nezapomeňte si ho prodloužit.`, 'warning'))
                            });
                            notify('warning', 'Předplatné končí', `Zbývá vám posledních ${diffDays} dní.`);
                        }
                    }

                    if (levelRequirements.length > 0) {
                        const { newLevel } = calculateXPAndLevel(userData, 0);
                        if (newLevel !== userData.level) {
                            await updateDoc(userDocRef, { level: newLevel });
                        }
                    }
                    if (ADMIN_EMAILS.includes(userData.email) && userData.role !== 'admin') {
                         await updateDoc(userDocRef, { role: 'admin' });
                    }
                    if (!realUser) {
                        setCurrentUser(userData);
                        if(view === 'landing') setView(userData.role === 'admin' ? 'admin' : 'dashboard');
                    }
                }
            });
            return () => unsubscribeUser();
        } else {
            if (!currentUser || !currentUser.id.startsWith('mock_')) {
                 if(view !== 'verify') {
                     setCurrentUser(null);
                     if(view === 'dashboard' || view === 'admin') setView('landing');
                 }
            }
        }
    });
    return () => unsubscribeAuth();
  }, [realUser, levelRequirements]);

  const notify = (type: ToastMessage['type'], title: string, message: string) => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts(prev => [...prev, { id, type, title, message }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };

  /**
   * HELPERS
   */
  const createSystemNotification = (title: string, message: string, type: Notification['type'] = 'info'): Notification => ({
      id: `ntf-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString()
  });

  const calculateXPAndLevel = (user: User, xpToAdd: number) => {
      // Handle XP Boost only for positive gains
      const hasBoost = xpToAdd > 0 && user.xpBoostUntil && new Date(user.xpBoostUntil) > new Date();
      const finalXpChange = hasBoost ? xpToAdd * 2 : xpToAdd;
      
      const totalXp = Math.max(0, (user.xp || 0) + finalXpChange);
      let calculatedLevel = 1;
      
      const sortedReqs = [...levelRequirements].sort((a,b) => a.level - b.level);
      for(const req of sortedReqs) {
          if (totalXp >= req.xpRequired) {
              calculatedLevel = req.level;
          } else {
              break;
          }
      }

      // V této verzi dovolujeme levelu klesat, pokud se utratí XP
      const newLevel = calculatedLevel; 
      const leveledUp = newLevel > user.level;
      const leveledDown = newLevel < user.level;
      
      return { totalXp, newLevel, leveledUp, leveledDown, gain: finalXpChange };
  };

  const dbHandlers = {
      handleSaveDoc: async (col: string, data: any) => {
          await setDoc(doc(db, col, data.id), data);
          notify('success', 'Uloženo', 'Data byla úspěšně aktualizována.');
      },
      handleDeleteDoc: async (col: string, id: string) => {
          await deleteDoc(doc(db, col, id));
          notify('success', 'Smazáno', 'Položka byla odstraněna.');
      },
      handleUpdateUser: async (u: User) => {
          const cleanUser = JSON.parse(JSON.stringify(u));
          await updateDoc(doc(db, "users", u.id), cleanUser);
          if (currentUser?.id === u.id) setCurrentUser(u);
      },
      handleRegisterEvent: async (eventId: string, userId: string) => {
          const eventRef = doc(db, "calendar_events", eventId);
          await updateDoc(eventRef, { registeredUserIds: arrayUnion(userId) });
          notify('info', 'Žádost odeslána', 'Vaše registrace čeká na schválení administrátorem.');
      },
      handleRejectEventRegistration: async (eventId: string, userId: string) => {
          const eventRef = doc(db, "calendar_events", eventId);
          await updateDoc(eventRef, { 
              registeredUserIds: arrayRemove(userId),
              approvedUserIds: arrayRemove(userId)
          });
          notify('info', 'Registrace zrušena', 'Uživatel byl odstraněn ze seznamu účastníků.');
      },
      handleApproveEventRegistration: async (eventId: string, userId: string) => {
          const eventRef = doc(db, "calendar_events", eventId);
          const event = events.find(e => e.id === eventId);
          if (!event) return;
          const targetUser = allUsers.find(u => u.id === userId);
          if (!targetUser) return;

          const batch = writeBatch(db);
          batch.update(eventRef, { approvedUserIds: arrayUnion(userId) });
          
          if (event.xpReward) {
              const { totalXp, newLevel, leveledUp } = calculateXPAndLevel(targetUser, event.xpReward);
              const updates: any = { xp: totalXp, level: newLevel };
              
              const notif = createSystemNotification('Účast schválena', `Byla schválena vaše účast na akci: ${event.title}. Získáváte ${event.xpReward} XP.`, 'success');
              updates.notifications = arrayUnion(notif);
              
              if (leveledUp) {
                  updates.notifications = arrayUnion(notif, createSystemNotification('LEVEL UP!', `Dosáhl jsi úrovně ${newLevel}!`, 'level_up'));
              }
              
              batch.update(doc(db, "users", userId), updates);
          }
          
          await batch.commit();
          notify('success', 'Schváleno', 'Uživatel byl schválen na akci.');
      },
      handleBookMentor: async (mentorId: string, date: string, note: string) => {
          if(!currentUser) return;
          const booking: Booking = {
              id: `bk-${Date.now()}`, mentorId, userId: currentUser.id, userEmail: currentUser.email,
              date, status: 'pending', note, paymentType: currentUser.role === 'vip' ? 'unlimited_vip' : 'xp'
          };
          await setDoc(doc(db, "bookings", booking.id), booking);
          notify('success', 'Odesláno', 'Žádost o mentoring byla vytvořena.');
      },
      handleBuyItem: async (item: Artifact) => {
          if (!currentUser) return;
          const userDocRef = doc(db, "users", currentUser.id);
          const snap = await getDoc(userDocRef);
          if (!snap.exists()) return;
          
          const u = snap.data() as User;
          const price = item.price || 0;
          if ((u.xp || 0) < price) return notify('error', 'Chyba', 'Nedostatek XP bodů.');
          
          // Utratíme XP a přepočítáme level (může klesnout)
          const { totalXp, newLevel, leveledDown } = calculateXPAndLevel(u, -price);
          
          let newInventory = [...(u.inventory || [])];
          const idx = newInventory.findIndex(i => i.id === item.id);
          if (idx > -1) {
              newInventory[idx] = { ...newInventory[idx], quantity: (newInventory[idx].quantity || 1) + 1 };
          } else {
              newInventory.push({ ...item, quantity: 1 });
          }

          const buyNotif = createSystemNotification('Předmět zakoupen 🛒', `Úspěšně jsi zakoupil ${item.name}. Předmět najdeš ve svém inventáři.`, 'success');
          let updates: any = {
              xp: totalXp,
              level: newLevel,
              inventory: newInventory,
              notifications: arrayUnion(buyNotif)
          };

          if (leveledDown) {
              const downNotif = createSystemNotification('Změna úrovně', `Tvá úroveň klesla na ${newLevel} kvůli útratě XP bodů.`, 'warning');
              updates.notifications = arrayUnion(buyNotif, downNotif);
          }

          await updateDoc(userDocRef, updates);
          notify('success', 'Nákup úspěšný', `${item.name} byl přidán do tvého inventáře.`);
      },
      handleUseArtifact: async (itemId: string, reward?: { type: 'xp' | 'item', value: string, artifact?: Artifact, amount?: number }) => {
          if (!currentUser) return;
          const userDocRef = doc(db, "users", currentUser.id);
          const snap = await getDoc(userDocRef);
          if (!snap.exists()) return;
          
          const u = snap.data() as User;
          const inventory = [...(u.inventory || [])];
          const itemIdx = inventory.findIndex(i => i.id === itemId);
          if (itemIdx === -1) return;

          const item = inventory[itemIdx];
          let updates: any = {};
          
          if (item.quantity > 1) {
              inventory[itemIdx] = { ...item, quantity: item.quantity - 1 };
          } else {
              inventory.splice(itemIdx, 1);
          }
          updates.inventory = inventory;

          if (item.effectType === 'xp_boost') {
              const boostTime = new Date();
              boostTime.setHours(boostTime.getHours() + (item.effectDuration || 1));
              updates.xpBoostUntil = boostTime.toISOString();
              notify('success', 'Aktivováno!', `Získáváš 2x XP po dobu ${item.effectDuration}h.`);
          }

          if (reward) {
              if (reward.type === 'xp' && reward.amount) {
                  const { totalXp, newLevel, leveledUp } = calculateXPAndLevel(u, reward.amount);
                  updates.xp = totalXp;
                  updates.level = newLevel;
                  if (leveledUp) {
                      setShowLevelUp(newLevel);
                      updates.notifications = arrayUnion(createSystemNotification('LEVEL UP!', `Dosáhl jsi úrovně ${newLevel}!`, 'level_up'));
                  }
                  notify('success', 'Odměna', `Získáno ${reward.amount} XP!`);
              } else if (reward.type === 'item' && reward.artifact) {
                  const rewardIdx = updates.inventory.findIndex((i: any) => i.id === reward.artifact?.id);
                  if (rewardIdx > -1) {
                      updates.inventory[rewardIdx] = { ...updates.inventory[rewardIdx], quantity: (updates.inventory[rewardIdx].quantity || 1) + 1 };
                  } else {
                      updates.inventory.push({ ...reward.artifact, quantity: 1 });
                  }
                  notify('success', 'Nová položka', `${reward.artifact.name} byl přidán do inventáře.`);
              }
          }

          await updateDoc(userDocRef, updates);
      },
      handleClaimDaily: async () => {
          if (!currentUser) return;
          const today = new Date().toDateString();
          if (currentUser.lastDailyClaim === today) return notify('info', 'Už máš vybráno', 'Dnes už jsi svoji odměnu dostal.');
          
          const { totalXp, newLevel, leveledUp, gain } = calculateXPAndLevel(currentUser, 100);
          const updates: any = { lastDailyClaim: today, xp: totalXp, level: newLevel };
          
          if (leveledUp) {
              setShowLevelUp(newLevel);
              updates.notifications = arrayUnion(createSystemNotification('LEVEL UP!', `Dosáhl jsi úrovně ${newLevel}!`, 'level_up'));
          }
          
          await updateDoc(doc(db, "users", currentUser.id), updates);
          notify('success', `+${gain} XP`, 'Denní odměna připsána!');
      },
      handleCourseProgress: async (courseId: string, lessonId: string) => {
          if (!currentUser) return;
          const course = courses.find(c => c.id === courseId);
          if (!course) return;

          let progressList = [...(currentUser.courseProgress || [])];
          let progress = progressList.find(p => p.courseId === courseId);
          if (!progress) {
              progress = { courseId, completedLessonIds: [], isCompleted: false, quizScores: {} };
              progressList.push(progress);
          }

          if (!progress.completedLessonIds.includes(lessonId)) {
              progress.completedLessonIds.push(lessonId);
          }
          progress.lastPlayedLessonId = lessonId;

          const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
          let updates: any = { courseProgress: progressList };

          if (progress.completedLessonIds.length === totalLessons && !progress.isCompleted) {
              progress.isCompleted = true;
              const { totalXp, newLevel, leveledUp } = calculateXPAndLevel(currentUser, course.xpReward || 500);
              updates.xp = totalXp;
              updates.level = newLevel;
              
              const cert: Certificate = {
                  id: `cert-${Date.now()}`, courseId: course.id, courseName: course.title,
                  studentName: currentUser.name || currentUser.email, issueDate: new Date().toLocaleDateString('cs-CZ'),
                  code: `MES-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
              };
              updates.certificates = arrayUnion(cert);
              
              const finishNotif = createSystemNotification('Kurz dokončen! 🎓', `Gratulujeme k dokončení kurzu ${course.title}. Certifikát byl vystaven.`, 'success');
              updates.notifications = arrayUnion(finishNotif);

              if (leveledUp) {
                  setShowLevelUp(newLevel);
                  updates.notifications = arrayUnion(finishNotif, createSystemNotification('LEVEL UP!', `Dosáhl jsi úrovně ${newLevel}!`, 'level_up'));
              }
              notify('success', 'Kurz Dokončen!', `Získal jsi certifikát a XP odměnu.`);
          }

          await updateDoc(doc(db, "users", currentUser.id), updates);
      },
      handleQuizComplete: async (quizId: string, score: number, passed: boolean) => {
          if (!currentUser) return;
          const quiz = quizzes.find(q => q.id === quizId);
          if (!quiz) return;

          const history = [...(currentUser.quizHistory || [])];
          const existing = history.find(h => h.quizId === quizId);
          let updates: any = {};
          const alreadyPassed = existing?.passed;

          if (existing) {
              existing.score = Math.max(existing.score, score);
              existing.passed = existing.passed || passed;
              existing.completedAt = new Date().toISOString();
              existing.attempts = (existing.attempts || 1) + 1;
          } else {
              history.push({ quizId, score, passed, completedAt: new Date().toISOString(), attempts: 1 });
          }
          updates.quizHistory = history;

          if (passed && !alreadyPassed) {
              const { totalXp, newLevel, leveledUp, gain } = calculateXPAndLevel(currentUser, quiz.xpReward || 100);
              updates.xp = totalXp;
              updates.level = newLevel;
              
              const quizNotif = createSystemNotification('Kvíz splněn ✅', `Úspěšně jsi splnil kvíz ${quiz.title} a získal ${gain} XP.`, 'success');
              updates.notifications = arrayUnion(quizNotif);

              if (leveledUp) {
                  setShowLevelUp(newLevel);
                  updates.notifications = arrayUnion(quizNotif, createSystemNotification('LEVEL UP!', `Dosáhl jsi úrovně ${newLevel}!`, 'level_up'));
              }
              notify('success', 'Kvíz splněn', `Získáno ${gain} XP.`);
          }
          await updateDoc(doc(db, "users", currentUser.id), updates);
      },
      handleChallengeAction: async (challengeId: string) => {
          if (!currentUser) return;
          const challenge = challenges.find(c => c.id === challengeId);
          if (!challenge) return;

          const progressList = [...(currentUser.activeChallenges || [])];
          let progress = progressList.find(p => p.challengeId === challengeId);
          if (!progress) {
              progress = { challengeId, currentCount: 0, completed: false, lastUpdated: new Date().toISOString(), history: [] };
              progressList.push(progress);
          }
          if (progress.completed) return;
          progress.currentCount += 1;
          progress.lastUpdated = new Date().toISOString();
          let updates: any = { activeChallenges: progressList };

          if (progress.currentCount >= challenge.targetCount) {
              progress.completed = true;
              const { totalXp, newLevel, leveledUp, gain } = calculateXPAndLevel(currentUser, challenge.rewardXP || 100);
              updates.xp = totalXp;
              updates.level = newLevel;
              
              const challNotif = createSystemNotification('Výzva splněna! ⚡', `Splnil jsi výzvu: ${challenge.title}. Odměna: ${gain} XP.`, 'success');
              updates.notifications = arrayUnion(challNotif);

              if (leveledUp) {
                  setShowLevelUp(newLevel);
                  updates.notifications = arrayUnion(challNotif, createSystemNotification('LEVEL UP!', `Dosáhl jsi úrovně ${newLevel}!`, 'level_up'));
              }
              notify('success', 'Výzva Splněna!', `Získáno ${gain} XP.`);
          }
          await updateDoc(doc(db, "users", currentUser.id), updates);
      },
      handleReplyTicket: async (ticketId: string, text: string, sender: 'user' | 'support') => {
          const ticketRef = doc(db, "tickets", ticketId);
          const newMessage = { sender, text, timestamp: new Date().toISOString() };
          await updateDoc(ticketRef, {
              messages: arrayUnion(newMessage),
              status: sender === 'support' ? 'pending' : 'open'
          });
      },
      handleMuteUser: async (userId: string, duration: number | 'forever') => {
          const userRef = doc(db, "users", userId);
          let mutedUntil: string | undefined;
          if (duration === 'forever') {
              mutedUntil = new Date(2100, 0, 1).toISOString();
          } else {
              const d = new Date();
              d.setHours(d.getHours() + duration);
              mutedUntil = d.toISOString();
          }
          await updateDoc(userRef, { mutedUntil });
          notify('success', 'Uživatel ztlumen', `Uživatel byl ztlumen.`);
      },
      handleSendCampaign: async (role: string, subject: string, body: string) => {
          const batch = writeBatch(db);
          let targets = allUsers;
          if (role !== 'all') {
              targets = allUsers.filter(u => u.role === role);
          }
          targets.forEach(u => {
              const notif = createSystemNotification(subject, body, 'info');
              batch.update(doc(db, "users", u.id), { notifications: arrayUnion(notif) });
          });
          await batch.commit();
          notify('success', 'Kampaň odeslána', `Notifikace byly odeslány.`);
      },
      handleUpdateCertificate: async (userId: string, certId: string, newName: string) => {
          const userRef = doc(db, "users", userId);
          const snap = await getDoc(userRef);
          if (!snap.exists()) return;
          const u = snap.data() as User;
          const updatedCerts = (u.certificates || []).map(c => c.id === certId ? { ...c, studentName: newName } : c);
          await updateDoc(userRef, { certificates: updatedCerts });
      },
      handleUpdateLevels: async (levels: LevelRequirement[]) => {
          const batch = writeBatch(db);
          levels.forEach(l => {
              batch.set(doc(db, "levels", `lvl-${l.level}`), l);
          });
          await batch.commit();
      },
      handleClaimSubmissionXP: async (subId: string, amount: number) => {
          if (!currentUser) return;
          const { totalXp, newLevel, leveledUp, gain } = calculateXPAndLevel(currentUser, amount);
          const updates: any = { xp: totalXp, level: newLevel };
          
          const claimNotif = createSystemNotification('XP Odměna připsána', `Tvůj úkol byl schválen a bylo ti připsáno ${gain} XP.`, 'success');
          updates.notifications = arrayUnion(claimNotif);

          if (leveledUp) {
              setShowLevelUp(newLevel);
              updates.notifications = arrayUnion(claimNotif, createSystemNotification('LEVEL UP!', `Dosáhl jsi úrovně ${newLevel}!`, 'level_up'));
          }

          const batch = writeBatch(db);
          batch.update(doc(db, "submissions", subId), { status: 'claimed' });
          batch.update(doc(db, "users", currentUser.id), updates);
          await batch.commit();
          notify('success', 'XP získáno', `Bylo vám připsáno ${gain} XP.`);
      }
  };

  if (view === 'verify') return <CertificateVerify allUsers={allUsers} onBack={() => setView('landing')} />;

  return (
    <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden font-sans">
      <div className="fixed top-4 right-4 z-[200] space-y-2 pointer-events-none">
          <AnimatePresence>
              {toasts.map(toast => (
                  <MotionDiv key={toast.id} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className={`pointer-events-auto min-w-[300px] p-4 rounded-xl border shadow-2xl flex items-start gap-3 backdrop-blur-md ${toast.type === 'success' ? 'bg-green-900/80 border-green-500' : toast.type === 'error' ? 'bg-red-900/80 border-red-500' : 'bg-blue-900/80 border-blue-500'}`}>
                      {toast.type === 'success' ? <CheckCircle size={20}/> : toast.type === 'error' ? <XCircle size={20}/> : <Info size={20}/>}
                      <div><h4 className="font-bold text-sm">{toast.title}</h4><p className="text-xs text-gray-200">{toast.message}</p></div>
                  </MotionDiv>
              ))}
          </AnimatePresence>
      </div>

      {view === 'admin' && currentUser?.role === 'admin' ? (
        <AdminDashboard 
          currentUser={currentUser} allUsers={allUsers} settings={systemSettings} challenges={challenges} artifacts={artifacts} events={events}
          bonusTasks={bonusTasks} submissions={submissions} courses={courses} quizzes={quizzes} mentors={mentors} bookings={bookings}
          ebooks={ebooks} streams={streams} tickets={tickets} levelRequirements={levelRequirements} channels={channels} communityMessages={communityMessages}
          notify={notify} onUpdateUser={dbHandlers.handleUpdateUser} onDeleteUser={(id) => dbHandlers.handleDeleteDoc('users', id)}
          onImpersonate={(uid) => { setRealUser(currentUser); setCurrentUser(allUsers.find(u=>u.id===uid)!); setView('dashboard'); }}
          onSendMessage={() => {}} onSaveCourse={(c) => dbHandlers.handleSaveDoc('courses', c)} onDeleteCourse={(id) => dbHandlers.handleDeleteDoc('courses', id)}
          onSaveQuiz={(q) => dbHandlers.handleSaveDoc('quizzes', q)} onDeleteQuiz={(id) => dbHandlers.handleDeleteDoc('quizzes', id)}
          onSaveMentor={(m) => dbHandlers.handleSaveDoc('mentors', m)} onDeleteMentor={(id) => dbHandlers.handleDeleteDoc('mentors', id)}
          onSaveEvent={(e) => dbHandlers.handleSaveDoc('calendar_events', e)} onDeleteEvent={(id) => dbHandlers.handleDeleteDoc('calendar_events', id)}
          onApproveEventRegistration={dbHandlers.handleApproveEventRegistration} onRejectEventRegistration={dbHandlers.handleRejectEventRegistration}
          onSaveEbook={(e) => dbHandlers.handleSaveDoc('ebooks', e)} onDeleteEbook={(id) => dbHandlers.handleDeleteDoc('ebooks', id)}
          onSaveStream={(s) => dbHandlers.handleSaveDoc('streams', s)} onDeleteStream={(id) => dbHandlers.handleDeleteDoc('streams', id)}
          onSaveArtifact={(a) => dbHandlers.handleSaveDoc('artifacts', a)} onDeleteArtifact={(id) => dbHandlers.handleDeleteDoc('artifacts', id)}
          onSaveChallenge={(c) => dbHandlers.handleSaveDoc('challenges', c)} onDeleteChallenge={(id) => dbHandlers.handleDeleteDoc('challenges', id)}
          onSaveChannel={(c) => dbHandlers.handleSaveDoc('channels', c)} onDeleteChannel={(id) => dbHandlers.handleDeleteDoc('channels', id)}
          onUpdateBooking={(b) => dbHandlers.handleSaveDoc('bookings', b)} onUpdateTask={(t) => dbHandlers.handleSaveDoc('bonus_tasks', t)} 
          onDeleteTask={(id) => dbHandlers.handleDeleteDoc('bonus_tasks', id)} onUpdateSettings={(s) => dbHandlers.handleSaveDoc('system', { ...s, id: 'config' })} 
          onUpdateLevels={dbHandlers.handleUpdateLevels} onDeleteMessage={(id) => dbHandlers.handleDeleteDoc('community_messages', id)} 
          onSendCampaign={dbHandlers.handleSendCampaign}
          onReviewSubmission={(id, status) => dbHandlers.handleSaveDoc('submissions', { ...submissions.find(s=>s.id===id), status })}
          onReplyTicket={(id, msg) => dbHandlers.handleReplyTicket(id, msg, 'support')}
          onCloseTicket={(id) => dbHandlers.handleSaveDoc('tickets', { ...tickets.find(t=>t.id===id), status: 'closed' })}
          onFactoryReset={() => {}} onMuteUser={dbHandlers.handleMuteUser} onUpdateCertificate={dbHandlers.handleUpdateCertificate}
          onLogout={() => signOut(auth).then(() => setView('landing'))} onNavigate={(v) => setView(v as any)}
        />
      ) : view === 'dashboard' && currentUser ? (
        <Dashboard 
          user={currentUser} challenges={challenges} allUsers={allUsers} events={events} bonusTasks={bonusTasks} submissions={submissions}
          courses={courses} quizzes={quizzes} mentors={mentors} bookings={bookings} ebooks={ebooks} streams={streams} tickets={tickets}
          nextLevelRequirement={levelRequirements.find(l => l.level === currentUser.level + 1)} communitySessions={[]}
          communityMessages={communityMessages} channels={channels} artifacts={artifacts} notify={notify}
          onNavigate={(v) => setView(v as any)} onLogout={() => { if(realUser) { setCurrentUser(realUser); setRealUser(null); setView('admin'); } else signOut(auth).then(() => setView('landing')); }}
          onUpdateProfile={dbHandlers.handleUpdateUser} onRegisterEvent={dbHandlers.handleRegisterEvent} 
          onSubmitTask={(tid, uid, c) => dbHandlers.handleSaveDoc('submissions', { id: `sub-${Date.now()}`, taskId: tid, userId: uid, content: c, status: 'pending', submittedAt: new Date().toISOString() })} 
          onCourseProgress={dbHandlers.handleCourseProgress} 
          onQuizComplete={dbHandlers.handleQuizComplete}
          onBookMentor={dbHandlers.handleBookMentor} 
          onCreateTicket={(s) => dbHandlers.handleSaveDoc('tickets', { id: `tck-${Date.now()}`, userId: currentUser.id, userEmail: currentUser.email, subject: s, status: 'open', priority: 'medium', createdAt: new Date().toISOString(), messages: [] })} 
          onReplyTicket={(id, msg) => dbHandlers.handleReplyTicket(id, msg, 'user')}
          onUseArtifact={dbHandlers.handleUseArtifact} 
          onBuyItem={dbHandlers.handleBuyItem} 
          onChallengeAction={dbHandlers.handleChallengeAction}
          onClaimDaily={dbHandlers.handleClaimDaily} onCreateSession={() => {}} onJoinSession={() => {}} 
          onSendCommunityMessage={(m) => dbHandlers.handleSaveDoc('community_messages', m)} 
          onEditCommunityMessage={(id, msg) => dbHandlers.handleSaveDoc('community_messages', { ...communityMessages.find(m=>m.id===id), content: msg })} 
          onClaimSubmissionXP={dbHandlers.handleClaimSubmissionXP}
          showLevelUp={showLevelUp} onCloseLevelUp={() => setShowLevelUp(undefined)} settings={systemSettings}
        />
      ) : (
        <>
            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLogin={(u) => {setCurrentUser(u); setView(u.role==='admin'?'admin':'dashboard');}} />
            <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} onSuccess={() => {}} planName={checkoutPlan.name} price={checkoutPlan.price} user={currentUser || undefined} />
            <div className="relative z-10">
                <Navbar onLoginClick={() => setIsAuthOpen(true)} />
                <Hero onLoginClick={() => setIsAuthOpen(true)} />
                <Features />
                <CoursesComponent courses={courses} />
                <Pricing onLoginClick={(plan, price) => { setCheckoutPlan({name: plan, price}); setIsCheckoutOpen(true); }} />
                <Team />
                <FAQ />
                <ComingSoonAI />
                <LandingTicketSection settings={systemSettings} onDefaultBuy={() => { setCheckoutPlan({name: 'BASIC_YEARLY', price: 9480}); setIsCheckoutOpen(true); }} />
                <Footer onVerifyClick={() => setView('verify')} />
            </div>
        </>
      )}
    </div>
  );
};

export default App1;
