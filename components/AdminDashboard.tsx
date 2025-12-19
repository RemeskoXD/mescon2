
import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, BookOpen, Brain, Calendar, MessageSquare, 
  Settings, LogOut, Shield, Gift, FileText, Video, Award, 
  ShoppingBag, CheckSquare, Zap, Megaphone, Menu, X, BarChart3
} from 'lucide-react';
import { 
  User, SystemSettings, Challenge, Artifact, CalendarEvent, BonusTask, 
  BonusSubmission, Course, Quiz, Mentor, Booking, Ebook, Stream, 
  SupportTicket, LevelRequirement, Channel, Message 
} from '../types';

import AdminOverview from './admin/AdminOverview';
import AdminUsers from './admin/AdminUsers';
import AdminCourses from './admin/AdminCourses';
import AdminQuizzes from './admin/AdminQuizzes';
import AdminMentoring from './admin/AdminMentoring';
import AdminBookings from './admin/AdminBookings';
import AdminSupport from './admin/AdminSupport';
import AdminCalendar from './admin/AdminCalendar';
import AdminEbooks from './admin/AdminEbooks';
import AdminStreams from './admin/AdminStreams';
import AdminGamification from './admin/AdminGamification';
import AdminSubmissions from './admin/AdminSubmissions';
import AdminSettings from './admin/AdminSettings';
import AdminCommunity from './admin/AdminCommunity';
import AdminCampaigns from './admin/AdminCampaigns';
import AdminCertificates from './admin/AdminCertificates';
import AdminTools from './admin/AdminTools';

interface AdminDashboardProps {
  currentUser: User | null;
  allUsers: User[];
  settings: SystemSettings;
  challenges: Challenge[];
  artifacts: Artifact[];
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
  levelRequirements: LevelRequirement[];
  channels: Channel[];
  communityMessages: Message[];
  notify: (type: any, title: string, message: string) => void;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
  onImpersonate: (userId: string) => void;
  onSendMessage: (msg: Message) => void;
  onSaveCourse: (course: Course) => void;
  onDeleteCourse: (id: string) => void;
  onSaveQuiz: (quiz: Quiz) => void;
  onDeleteQuiz: (id: string) => void;
  onSaveMentor: (mentor: Mentor) => void;
  onDeleteMentor: (id: string) => void;
  onSaveEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (id: string) => void;
  onApproveEventRegistration?: (eventId: string, userId: string) => void;
  onRejectEventRegistration?: (eventId: string, userId: string) => void;
  onSaveEbook: (ebook: Ebook) => void;
  onDeleteEbook: (id: string) => void;
  onSaveStream: (stream: Stream) => void;
  onDeleteStream: (id: string) => void;
  onSaveArtifact: (item: Artifact) => void;
  onDeleteArtifact: (id: string) => void;
  onSaveChallenge: (challenge: Challenge) => void;
  onDeleteChallenge: (id: string) => void;
  onSaveChannel: (channel: Channel) => void;
  onDeleteChannel: (id: string) => void;
  onUpdateBooking: (booking: Booking) => void;
  onUpdateTask: (task: BonusTask) => void;
  onDeleteTask: (id: string) => void;
  onUpdateSettings: (settings: SystemSettings) => void;
  onUpdateLevels: (levels: LevelRequirement[]) => void;
  onDeleteMessage: (msgId: string) => void;
  onSendCampaign: (role: string, subject: string, body: string) => void;
  onReviewSubmission: (id: string, status: 'approved' | 'rejected') => void;
  onReplyTicket: (id: string, message: string) => void;
  onCloseTicket: (id: string) => void;
  onFactoryReset: () => void;
  onMuteUser: (userId: string, duration: number | 'forever') => void;
  onUpdateCertificate: (userId: string, certificateId: string, newName: string) => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
      { id: 'overview', label: 'Přehled', icon: <LayoutDashboard size={20}/> },
      { id: 'users', label: 'Uživatelé', icon: <Users size={20}/> },
      { id: 'tools', label: 'Nástroje', icon: <BarChart3 size={20}/> },
      { id: 'courses', label: 'Kurzy & Lekce', icon: <BookOpen size={20}/> },
      { id: 'quizzes', label: 'Kvízy', icon: <Brain size={20}/> },
      { id: 'mentoring', label: 'Mentoři', icon: <Shield size={20}/> }, 
      { id: 'bookings', label: 'Rezervace', icon: <Calendar size={20}/> },
      { id: 'calendar', label: 'Kalendář Akcí', icon: <Calendar size={20}/> },
      { id: 'community', label: 'Komunita & Chat', icon: <MessageSquare size={20}/> },
      { id: 'support', label: 'Support Desk', icon: <MessageSquare size={20}/> },
      { id: 'gamification', label: 'Gamifikace & Shop', icon: <Gift size={20}/> },
      { id: 'submissions', label: 'Úkoly & Review', icon: <CheckSquare size={20}/> },
      { id: 'ebooks', label: 'E-booky', icon: <FileText size={20}/> },
      { id: 'streams', label: 'Streamy', icon: <Video size={20}/> },
      { id: 'certificates', label: 'Certifikáty', icon: <Award size={20}/> },
      { id: 'campaigns', label: 'Kampaně', icon: <Megaphone size={20}/> },
      { id: 'settings', label: 'Nastavení', icon: <Settings size={20}/> },
  ];

  const handleTabChange = (id: string) => {
      setActiveTab(id);
      setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex font-sans overflow-hidden">
        {/* Fixed Mobile Header */}
        <div className="lg:hidden fixed top-0 w-full bg-[#05080f] border-b border-gray-800 z-[100] px-4 h-16 flex items-center justify-between">
            <div className="font-black text-xl tracking-tighter">MESCON<span className="text-red-600">ADMIN</span></div>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-400">
                {isMobileMenuOpen ? <X/> : <Menu/>}
            </button>
        </div>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
            <div className="fixed inset-0 bg-black/70 z-[90] lg:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
        )}

        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 w-72 bg-[#05080f] border-r border-gray-800 flex flex-col flex-shrink-0 z-[110] transition-transform duration-300 transform lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-6 hidden lg:block">
                <div className="font-black text-2xl tracking-tighter text-white">MESCON<span className="text-red-600">ADMIN</span></div>
            </div>
            
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 custom-scrollbar mt-16 lg:mt-0">
                {menuItems.map(item => (
                    <button key={item.id} onClick={() => handleTabChange(item.id)} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition ${activeTab === item.id ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                        {item.icon} {item.label}
                    </button>
                ))}
            </div>

            <div className="p-4 border-t border-gray-800">
                <button onClick={props.onLogout} className="w-full py-2.5 border border-gray-700 rounded-lg text-xs font-bold text-gray-400 hover:text-white hover:bg-gray-800 transition flex items-center justify-center gap-2">
                    <LogOut size={14}/> Odhlásit se
                </button>
            </div>
        </div>

        <div className="flex-1 flex flex-col h-screen overflow-hidden pt-16 lg:pt-0">
            <div className="flex-1 overflow-y-auto p-4 lg:p-10 custom-scrollbar">
                {activeTab === 'overview' && <AdminOverview allUsers={props.allUsers} courses={props.courses} quizzes={props.quizzes} tickets={props.tickets} submissions={props.submissions} mrr={0} onImpersonate={props.onImpersonate}/>}
                {activeTab === 'users' && <AdminUsers allUsers={props.allUsers} courses={props.courses} onUpdateUser={props.onUpdateUser} onDeleteUser={props.onDeleteUser} onMuteUser={props.onMuteUser} onImpersonate={props.onImpersonate} notify={props.notify}/>}
                {activeTab === 'tools' && <AdminTools allUsers={props.allUsers} />}
                {activeTab === 'courses' && <AdminCourses courses={props.courses} allUsers={props.allUsers} onSaveCourse={props.onSaveCourse} onDeleteCourse={props.onDeleteCourse} notify={props.notify}/>}
                {activeTab === 'quizzes' && <AdminQuizzes quizzes={props.quizzes} onSaveQuiz={props.onSaveQuiz} onDeleteQuiz={props.onDeleteQuiz} notify={props.notify}/>}
                {activeTab === 'mentoring' && <AdminMentoring mentors={props.mentors} onSaveMentor={props.onSaveMentor} onDeleteMentor={props.onDeleteMentor} notify={props.notify}/>}
                {activeTab === 'bookings' && <AdminBookings bookings={props.bookings} mentors={props.mentors} onUpdateBooking={props.onUpdateBooking} notify={props.notify}/>}
                {activeTab === 'calendar' && <AdminCalendar events={props.events} allUsers={props.allUsers} onSaveEvent={props.onSaveEvent} onDeleteEvent={props.onDeleteEvent} onApproveRegistration={props.onApproveEventRegistration || (() => {})} onRejectRegistration={props.onRejectEventRegistration || (() => {})} notify={props.notify} />}
                {activeTab === 'community' && <AdminCommunity channels={props.channels} messages={props.communityMessages} allUsers={props.allUsers} onSaveChannel={props.onSaveChannel} onDeleteChannel={props.onDeleteChannel} onDeleteMessage={props.onDeleteMessage} onMuteUser={props.onMuteUser} onUpdateUser={props.onUpdateUser} notify={props.notify}/>}
                {activeTab === 'support' && <AdminSupport tickets={props.tickets} onReplyTicket={props.onReplyTicket} onCloseTicket={props.onCloseTicket} notify={props.notify}/>}
                {activeTab === 'gamification' && <AdminGamification artifacts={props.artifacts} challenges={props.challenges} levelRequirements={props.levelRequirements} onSaveArtifact={props.onSaveArtifact} onDeleteArtifact={props.onDeleteArtifact} onSaveChallenge={props.onSaveChallenge} onDeleteChallenge={props.onDeleteChallenge} onUpdateLevels={props.onUpdateLevels} notify={props.notify}/>}
                {activeTab === 'submissions' && <AdminSubmissions bonusTasks={props.bonusTasks} submissions={props.submissions} allUsers={props.allUsers} onUpdateTask={props.onUpdateTask} onDeleteTask={props.onDeleteTask} onReviewSubmission={props.onReviewSubmission} notify={props.notify}/>}
                {activeTab === 'ebooks' && <AdminEbooks ebooks={props.ebooks} onSaveEbook={props.onSaveEbook} onDeleteEbook={props.onDeleteEbook} notify={props.notify}/>}
                {activeTab === 'streams' && <AdminStreams streams={props.streams} onSaveStream={props.onSaveStream} onDeleteStream={props.onDeleteStream} notify={props.notify}/>}
                {activeTab === 'certificates' && <AdminCertificates allUsers={props.allUsers} onUpdateCertificate={props.onUpdateCertificate} notify={props.notify}/>}
                {activeTab === 'campaigns' && <AdminCampaigns allUsers={props.allUsers} onSendCampaign={props.onSendCampaign} notify={props.notify}/>}
                {activeTab === 'settings' && <AdminSettings settings={props.settings} onUpdateSettings={props.onUpdateSettings} onFactoryReset={props.onFactoryReset} notify={props.notify}/>}
            </div>
        </div>
    </div>
  );
};

export default AdminDashboard;
