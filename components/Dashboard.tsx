
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, BookOpen, Film, Calendar, Users, HelpCircle, 
  FileText, Award, Gem, LogOut, Zap, Gift, 
  Settings, Mail, Package, Filter, MessageCircle, BarChart2, Trophy, ShoppingBag, Bell, Bot, Book, Menu, X, Lock
} from 'lucide-react';
import { User, CalendarEvent, BonusTask, BonusSubmission, Course, Quiz, Mentor, Booking, Ebook, Stream, SupportTicket, LevelRequirement, CommunitySession, Message, Challenge, Artifact, Notification, Channel, SystemSettings } from '../types';

// Import Sub-Components
import DashboardHome from './dashboard/DashboardHome';
import DashboardTools from './dashboard/DashboardTools';
import DashboardCommunity from './dashboard/DashboardCommunity';
import DashboardLeaderboard from './dashboard/DashboardLeaderboard';
import DashboardCourses from './dashboard/DashboardCourses';
import DashboardChallenges from './dashboard/DashboardChallenges';
import DashboardQuizzes from './dashboard/DashboardQuizzes';
import DashboardEvents from './dashboard/DashboardEvents';
import DashboardMentoring from './dashboard/DashboardMentoring';
import DashboardSupport from './dashboard/DashboardSupport';
import DashboardEbooks from './dashboard/DashboardEbooks';
import DashboardStreams from './dashboard/DashboardStreams';
import DashboardInventory from './dashboard/DashboardInventory';
import DashboardCertificates from './dashboard/DashboardCertificates';
import DashboardSettings from './dashboard/DashboardSettings';
import DashboardNotifications from './dashboard/DashboardNotifications';
import DashboardAI from './dashboard/DashboardAI';
import DashboardNotes from './dashboard/DashboardNotes';
import UserProfileModal from './dashboard/UserProfileModal';
import LevelUpModal from './dashboard/LevelUpModal';
import PaywallModal from './PaywallModal';
import CheckoutModal from './CheckoutModal';

interface DashboardProps {
    user: User;
    challenges: Challenge[];
    allUsers: User[];
    events: CalendarEvent[];
    bonusTasks: BonusTask[];
    submissions: BonusSubmission[];
    courses: Course[];
    quizzes: Quiz[];
    mentors: Mentor[];
    bookings: Booking[];
    ebooks: Ebook[];
    streams: Stream[];
    tickets: SupportTicket[];
    nextLevelRequirement: LevelRequirement | undefined;
    communitySessions: CommunitySession[];
    communityMessages: Message[];
    channels: Channel[];
    artifacts?: Artifact[]; 
    settings?: SystemSettings;
    notify: any;
    onNavigate: (view: string) => void;
    onLogout: () => void;
    onUpdateProfile: (u: User) => void;
    onRegisterEvent: (eid: string, uid: string) => void;
    onSubmitTask: (tid: string, uid: string, content: string) => void;
    onCourseProgress: (cid: string, lid: string) => void;
    onQuizComplete: (qid: string, score: number, passed: boolean) => void;
    onBookMentor: (mid: string, date: string, note: string) => void;
    onCreateTicket: (subject: string) => void;
    onReplyTicket: (tid: string, msg: string) => void;
    onUseArtifact: (aid: string) => void;
    onChallengeAction: (cid: string) => void;
    onCreateSession: (topic: string, date: string, desc: string, max: number) => void;
    onJoinSession: (sid: string) => void;
    onSendCommunityMessage: (msg: Message) => void;
    onEditCommunityMessage?: (msgId: string, newContent: string) => void;
    onClaimSubmissionXP?: (subId: string, amount: number) => void;
    onBuyItem?: (item: Artifact) => void;
    onClaimDaily?: () => void;
    showLevelUp?: number; 
    onCloseLevelUp?: () => void;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const { user, onNavigate, onLogout, onUpdateProfile, notify } = props;
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [chatTargetUserId, setChatTargetUserId] = useState<string | null>(null);
  
  const [showPaywall, setShowPaywall] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState('PREMIUM_YEARLY');
  const [checkoutPrice, setCheckoutPrice] = useState(9480);

  const isSubscriptionValid = () => {
      if (user.role === 'admin') return true;
      if (user.role === 'nope') return false;
      if (user.planExpires) return new Date(user.planExpires) > new Date();
      return true;
  };

  const hasAccess = isSubscriptionValid();
  const allowedTabs = ['dashboard', 'settings'];

  const unreadNotifications = (user.notifications || []).filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
      const updatedNotifs = (user.notifications || []).map(n => n.id === id ? { ...n, read: true } : n);
      onUpdateProfile({ ...user, notifications: updatedNotifs });
  };

  const handleDeleteNotification = (id: string) => {
      const updatedNotifs = (user.notifications || []).filter(n => n.id !== id);
      onUpdateProfile({ ...user, notifications: updatedNotifs });
  };

  const handleClearAllNotifications = () => {
      onUpdateProfile({ ...user, notifications: [] });
  };

  const handleOpenChat = (targetUserId: string) => {
      setViewingUserId(null);
      setChatTargetUserId(targetUserId);
      if (!hasAccess) {
          setShowPaywall(true);
      } else {
          setActiveTab('community');
      }
  };

  const handleStartCheckout = (plan: string, price: number) => {
      setCheckoutPlan(plan);
      setCheckoutPrice(price);
      setShowCheckout(true);
  };

  const menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20}/> },
      { id: 'notifications', label: 'Upozornění', icon: <Bell size={20}/>, badge: unreadNotifications },
      { id: 'ai', label: 'AI Mentor (Nexus)', icon: <Bot size={20}/>, highlight: true }, 
      { id: 'notes', label: 'Znalostní Báze', icon: <Book size={20}/> }, 
      { id: 'community', label: 'Komunita', icon: <MessageCircle size={20}/> },
      { id: 'leaderboard', label: 'Žebříček', icon: <Trophy size={20}/> },
      { id: 'courses', label: 'Kurzy', icon: <BookOpen size={20}/> },
      { id: 'tools', label: 'Nástroje', icon: <BarChart2 size={20}/> },
      { id: 'challenges', label: 'Výzvy', icon: <Zap size={20}/> },
      { id: 'quizzes', label: 'Kvízy', icon: <HelpCircle size={20}/> },
      { id: 'events', label: 'Akce', icon: <Calendar size={20}/> },
      { id: 'mentoring', label: 'Mentoring', icon: <Users size={20}/> },
      { id: 'support', label: 'Podpora', icon: <Mail size={20}/> },
      { id: 'ebooks', label: 'E-booky', icon: <FileText size={20}/> },
      { id: 'streams', label: 'Streamy', icon: <Film size={20}/> },
      { id: 'inventory', label: 'Inventář & Shop', icon: <ShoppingBag size={20}/> },
      { id: 'certificates', label: 'Certifikáty', icon: <Award size={20}/> },
  ];

  const handleTabChange = (tab: string) => {
      if (!allowedTabs.includes(tab) && !hasAccess) {
          setShowPaywall(true);
          return;
      }
      setActiveTab(tab);
      setIsMobileMenuOpen(false);
      if (tab !== 'community') setChatTargetUserId(null);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex font-sans overflow-hidden">
        
        {/* Mobile Header - Fixed */}
        <div className="lg:hidden fixed top-0 w-full bg-[#05080f] border-b border-gray-800 z-[100] px-4 h-16 flex items-center justify-between">
            <div className="font-black text-xl tracking-tighter" onClick={() => handleTabChange('dashboard')}>
              MESCON<span className="text-blue-500">ACADEMY</span>
            </div>
            <div className="flex items-center gap-4">
                {unreadNotifications > 0 && (
                    <button onClick={() => handleTabChange('notifications')} className="relative text-gray-400">
                        <Bell size={20}/>
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">{unreadNotifications}</span>
                    </button>
                )}
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-400">
                    {isMobileMenuOpen ? <X/> : <Menu/>}
                </button>
            </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
            <div 
                className="fixed inset-0 bg-black/70 z-[90] lg:hidden backdrop-blur-sm"
                onClick={() => setIsMobileMenuOpen(false)}
            ></div>
        )}

        {/* Sidebar */}
        <div className={`
            fixed inset-y-0 left-0 w-72 bg-[#05080f] border-r border-gray-800 flex flex-col flex-shrink-0 z-[110] transition-transform duration-300 transform lg:relative lg:translate-x-0
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
            <div className="p-6 hidden lg:block">
                <div className="font-black text-2xl tracking-tighter cursor-pointer" onClick={() => onNavigate('landing')}>MESCON<span className="text-blue-500">ACADEMY</span></div>
            </div>
            
            <div className="px-4 py-2 mt-16 lg:mt-0 space-y-1 overflow-y-auto h-[calc(100vh-160px)] custom-scrollbar">
                {menuItems.map(item => {
                    const isLocked = !hasAccess && !allowedTabs.includes(item.id);
                    return (
                        <button 
                            key={item.id}
                            onClick={() => handleTabChange(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition relative group ${
                                activeTab === item.id 
                                ? (item.highlight ? 'bg-green-600 text-white shadow-lg' : 'bg-blue-600 text-white shadow-lg') 
                                : (item.highlight ? 'text-green-400 hover:text-white hover:bg-green-900/20 border border-green-900/30' : 'text-gray-400 hover:text-white hover:bg-gray-800')
                            }`}
                        >
                            {item.icon} 
                            <span className={isLocked ? 'opacity-50' : ''}>{item.label}</span>
                            
                            {isLocked && <Lock size={14} className="ml-auto text-gray-600"/>}
                            
                            {!isLocked && item.badge ? (
                                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{item.badge}</span>
                            ) : null}
                        </button>
                    );
                })}
            </div>

            <div className="mt-auto p-4 bg-[#05080f] border-t border-gray-800">
                <div className="flex items-center gap-3 mb-4 cursor-pointer hover:bg-gray-800 p-2 rounded-xl transition" onClick={() => handleTabChange('settings')}>
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white border border-gray-700 overflow-hidden shrink-0">
                        {user.avatarUrl ? <img src={user.avatarUrl} className="w-full h-full object-cover"/> : user.email.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                        <div className="font-bold text-sm truncate">{user.name || 'Uživatel'}</div>
                        <div className="text-[10px] text-blue-400 font-black uppercase tracking-widest">{user.role}</div>
                    </div>
                    <Settings size={16} className="ml-auto text-gray-500"/>
                </div>
                <button onClick={onLogout} className="w-full py-2.5 border border-gray-700 rounded-lg text-xs font-bold text-gray-400 hover:text-white hover:bg-gray-800 transition flex items-center justify-center gap-2">
                    <LogOut size={14}/> Odhlásit se
                </button>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative pt-16 lg:pt-0">
            <div className="flex-1 overflow-y-auto p-4 lg:p-10 custom-scrollbar">
                {activeTab === 'dashboard' && <DashboardHome user={user} nextLevel={props.nextLevelRequirement} events={props.events} onNavigate={handleTabChange} onStartCheckout={handleStartCheckout} onClaimDaily={props.onClaimDaily} />}
                {activeTab === 'settings' && <DashboardSettings user={user} onUpdateProfile={onUpdateProfile} notify={notify} onLogout={onLogout} onNavigate={handleTabChange}/>}
                {hasAccess && (
                    <>
                        {activeTab === 'notifications' && <DashboardNotifications notifications={user.notifications || []} onMarkAsRead={handleMarkAsRead} onDelete={handleDeleteNotification} onClearAll={handleClearAllNotifications} />}
                        {activeTab === 'ai' && <DashboardAI user={user} />}
                        {activeTab === 'notes' && <DashboardNotes user={user} courses={props.courses} onUpdateProfile={onUpdateProfile} notify={notify} />}
                        {activeTab === 'tools' && <DashboardTools user={user} onUpdate={onUpdateProfile} notify={notify} />}
                        {activeTab === 'community' && <DashboardCommunity user={user} messages={props.communityMessages || []} onSend={props.onSendCommunityMessage} onEdit={props.onEditCommunityMessage} onViewUser={setViewingUserId} allUsers={props.allUsers} initialChatUserId={chatTargetUserId} channels={props.channels} notify={notify} />}
                        {activeTab === 'leaderboard' && <DashboardLeaderboard allUsers={props.allUsers} currentUser={user} onTogglePublic={(val) => { onUpdateProfile({...user, isPublicProfile: val}); notify('success', 'Nastavení', val ? 'Jste viditelní v žebříčku.' : 'Jste skrytí.'); }} onViewUser={setViewingUserId} settings={props.settings} />}
                        {activeTab === 'courses' && <DashboardCourses courses={props.courses} user={user} onStart={props.onCourseProgress} notify={notify} onUpdateProfile={onUpdateProfile} />}
                        {activeTab === 'challenges' && <DashboardChallenges challenges={props.challenges} bonusTasks={props.bonusTasks} submissions={props.submissions} user={user} onChallengeAction={props.onChallengeAction} onSubmitTask={props.onSubmitTask} onClaimReward={props.onClaimSubmissionXP} notify={notify} />}
                        {activeTab === 'quizzes' && <DashboardQuizzes quizzes={props.quizzes} user={user} onQuizComplete={props.onQuizComplete} notify={notify} />}
                        {activeTab === 'events' && <DashboardEvents events={props.events} user={user} onRegister={props.onRegisterEvent} />}
                        {activeTab === 'mentoring' && <DashboardMentoring mentors={props.mentors} bookings={props.bookings} user={user} onBookMentor={props.onBookMentor} notify={notify} />}
                        {activeTab === 'support' && <DashboardSupport tickets={props.tickets} user={user} onCreateTicket={props.onCreateTicket} onReplyTicket={props.onReplyTicket} notify={notify} />}
                        {activeTab === 'ebooks' && <DashboardEbooks ebooks={props.ebooks} user={user} />}
                        {activeTab === 'streams' && <DashboardStreams streams={props.streams} user={user} />}
                        {activeTab === 'inventory' && <DashboardInventory user={user} shopArtifacts={props.artifacts || []} onUseItem={props.onUseArtifact} onBuyItem={props.onBuyItem || (() => {})} notify={notify} />}
                        {activeTab === 'certificates' && <DashboardCertificates certificates={user.certificates} user={user} />}
                    </>
                )}
            </div>
        </div>

        <UserProfileModal viewingUserId={viewingUserId} allUsers={props.allUsers} currentUser={user} onClose={() => setViewingUserId(null)} onMessage={handleOpenChat} />
        {props.showLevelUp && <LevelUpModal level={props.showLevelUp} onClose={props.onCloseLevelUp || (() => {})} />}
        <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} onBuy={(plan, price) => { setShowPaywall(false); setCheckoutPlan(plan); setCheckoutPrice(price); setShowCheckout(true); }} />
        <CheckoutModal isOpen={showCheckout} onClose={() => setShowCheckout(false)} onSuccess={() => {}} planName={checkoutPlan} price={checkoutPrice} user={user} />
    </div>
  );
};

export default Dashboard;
