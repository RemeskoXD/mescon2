import React from 'react';
import { Users, DollarSign, BookOpen, Brain, MessageSquare, AlertCircle, TrendingUp, CheckCircle, Eye, Crown, Zap, User as UserIcon } from 'lucide-react';
import { User, Course, Quiz, SupportTicket, BonusSubmission, UserRole } from '../../types';

interface AdminOverviewProps {
  allUsers: User[];
  courses: Course[];
  quizzes: Quiz[];
  tickets: SupportTicket[];
  submissions: BonusSubmission[];
  mrr: number;
  onImpersonate: (userId: string) => void;
}

const AdminOverview: React.FC<AdminOverviewProps> = ({ allUsers, courses, quizzes, tickets, submissions, mrr, onImpersonate }) => {
  
  const activeUsers = allUsers.filter(u => !u.isBanned);
  const openTickets = tickets.filter(t => t.status === 'open').length;
  const pendingSubmissions = submissions.filter(s => s.status === 'pending').length;

  // Role counts for simulation buttons
  const studentUsers = allUsers.filter(u => u.role === 'student');
  const premiumUsers = allUsers.filter(u => u.role === 'premium');
  const vipUsers = allUsers.filter(u => u.role === 'vip');

  const stats = [
    { label: 'Měsíční Příjem (MRR)', value: `${mrr.toLocaleString()} Kč`, icon: <DollarSign size={24} className="text-green-500" />, color: 'border-green-500/20 bg-green-500/5' },
    { label: 'Aktivní Uživatelé', value: activeUsers.length, sub: `${premiumUsers.length} Premium, ${vipUsers.length} VIP`, icon: <Users size={24} className="text-blue-500" />, color: 'border-blue-500/20 bg-blue-500/5' },
    { label: 'Publikované Kurzy', value: courses.filter(c => c.published).length, sub: `Celkem ${courses.length} kurzů`, icon: <BookOpen size={24} className="text-purple-500" />, color: 'border-purple-500/20 bg-purple-500/5' },
    { label: 'Aktivní Kvízy', value: quizzes.filter(q => q.published).length, sub: `Celkem ${quizzes.length} kvízů`, icon: <Brain size={24} className="text-pink-500" />, color: 'border-pink-500/20 bg-pink-500/5' },
  ];

  const attentionItems = [
    { label: 'Nevyřešené Tickety', value: openTickets, icon: <MessageSquare size={20} />, alert: openTickets > 0 },
    { label: 'Úkoly ke schválení', value: pendingSubmissions, icon: <CheckCircle size={20} />, alert: pendingSubmissions > 0 },
  ];

  const handleSimulateRole = (role: UserRole) => {
      const targets = allUsers.filter(u => u.role === role);
      
      if (targets.length > 0) {
          // Pick a random user from that role to simulate
          const randomTarget = targets[Math.floor(Math.random() * targets.length)];
          
          if (window.confirm(`Přihlásit se jako náhodný ${role} uživatel?\n\nVybrán: ${randomTarget.email}`)) {
              onImpersonate(randomTarget.id);
          }
      } else {
          alert(`Nenalezen žádný uživatel s rolí ${role}. Pro testování musíte nejprve vytvořit uživatele s touto rolí.`);
      }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-white">Přehled Akademie</h2>
            <p className="text-gray-400">Statistiky a metriky v reálném čase.</p>
          </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`p-6 rounded-2xl border ${stat.color} backdrop-blur-sm relative overflow-hidden group hover:border-opacity-50 transition-all`}>
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 bg-gray-900/50 rounded-xl border border-gray-800">
                 {stat.icon}
               </div>
               <TrendingUp size={16} className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"/>
            </div>
            <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</div>
            {stat.sub && <div className="text-xs text-gray-400 mt-2 border-t border-gray-800/50 pt-2">{stat.sub}</div>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Action Needed Section */}
          <div className="lg:col-span-2 bg-[#0B0F19] border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <AlertCircle size={20} className="text-yellow-500"/> Vyžaduje pozornost
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {attentionItems.map((item, i) => (
                      <div key={i} className={`p-4 rounded-xl border flex items-center justify-between ${item.alert ? 'bg-red-900/10 border-red-500/30' : 'bg-gray-900 border-gray-800'}`}>
                          <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${item.alert ? 'bg-red-900/20 text-red-400' : 'bg-gray-800 text-gray-400'}`}>{item.icon}</div>
                              <span className="text-sm font-medium text-gray-300">{item.label}</span>
                          </div>
                          <span className={`text-xl font-bold ${item.alert ? 'text-red-400' : 'text-gray-500'}`}>{item.value}</span>
                      </div>
                  ))}
              </div>
          </div>
          
          {/* Role Simulator Widget */}
          <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-6 flex flex-col">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Eye size={20} className="text-blue-400"/> Simulace Rolí
              </h3>
              <p className="text-xs text-gray-500 mb-4">Rychlý náhled dashboardu z pohledu studenta. Vybere náhodného uživatele dané role.</p>
              
              <div className="space-y-3 flex-1">
                  <button 
                    onClick={() => handleSimulateRole('student')}
                    disabled={studentUsers.length === 0}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition group ${studentUsers.length > 0 ? 'border-gray-800 hover:bg-gray-800 hover:border-blue-500/50 cursor-pointer' : 'border-gray-800/50 opacity-50 cursor-not-allowed'}`}
                  >
                      <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-900/20 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition"><UserIcon size={16}/></div>
                          <div className="text-left">
                              <span className="text-sm font-bold text-gray-300 group-hover:text-white block">Basic (Student)</span>
                              <span className="text-[10px] text-gray-500">{studentUsers.length} uživatelů</span>
                          </div>
                      </div>
                      <Eye size={16} className="text-gray-600 group-hover:text-blue-400"/>
                  </button>

                  <button 
                    onClick={() => handleSimulateRole('premium')}
                    disabled={premiumUsers.length === 0}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition group ${premiumUsers.length > 0 ? 'border-gray-800 hover:bg-gray-800 hover:border-purple-500/50 cursor-pointer' : 'border-gray-800/50 opacity-50 cursor-not-allowed'}`}
                  >
                      <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-900/20 flex items-center justify-center text-purple-500 group-hover:bg-purple-600 group-hover:text-white transition"><Zap size={16}/></div>
                          <div className="text-left">
                              <span className="text-sm font-bold text-gray-300 group-hover:text-white block">Premium</span>
                              <span className="text-[10px] text-gray-500">{premiumUsers.length} uživatelů</span>
                          </div>
                      </div>
                      <Eye size={16} className="text-gray-600 group-hover:text-purple-400"/>
                  </button>

                  <button 
                    onClick={() => handleSimulateRole('vip')}
                    disabled={vipUsers.length === 0}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition group ${vipUsers.length > 0 ? 'border-gray-800 hover:bg-gray-800 hover:border-yellow-500/50 cursor-pointer' : 'border-gray-800/50 opacity-50 cursor-not-allowed'}`}
                  >
                      <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-yellow-900/20 flex items-center justify-center text-yellow-500 group-hover:bg-yellow-600 group-hover:text-white transition"><Crown size={16}/></div>
                          <div className="text-left">
                              <span className="text-sm font-bold text-gray-300 group-hover:text-white block">VIP Klient</span>
                              <span className="text-[10px] text-gray-500">{vipUsers.length} uživatelů</span>
                          </div>
                      </div>
                      <Eye size={16} className="text-gray-600 group-hover:text-yellow-400"/>
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
};

export default AdminOverview;