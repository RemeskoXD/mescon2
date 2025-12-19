import React from 'react';
import { FileText, Download, Lock, Book } from 'lucide-react';
import { Ebook, User } from '../../types';

interface DashboardEbooksProps {
    ebooks: Ebook[];
    user: User;
}

const DashboardEbooks: React.FC<DashboardEbooksProps> = ({ ebooks, user }) => {
    
    const hasAccess = (minRole: string) => {
        if (!user || !user.role) return false;
        const roles = ['student', 'premium', 'vip', 'admin'];
        const userRoleIdx = roles.indexOf(user.role);
        const minRoleIdx = roles.indexOf(minRole);
        return userRoleIdx >= minRoleIdx;
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Studijní Materiály</h2>
                    <p className="text-gray-400 text-sm">E-booky, PDF checklisty a šablony.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {ebooks.map(book => {
                    const access = hasAccess(book.minRole);
                    return (
                        <div key={book.id} className={`bg-[#0B0F19] border border-gray-800 rounded-2xl overflow-hidden group hover:border-blue-500/30 transition shadow-lg flex flex-col ${!access ? 'opacity-75 grayscale-[0.5]' : ''}`}>
                            <div className="h-56 bg-gray-900 relative overflow-hidden">
                                <img src={book.coverImage} className="w-full h-full object-cover transition duration-500 group-hover:scale-105"/>
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] to-transparent"></div>
                                {!access && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                                        <div className="text-center">
                                            <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2"/>
                                            <span className="text-xs font-bold uppercase text-gray-400 border border-gray-600 px-2 py-1 rounded">Vyžaduje {book.minRole}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="font-bold text-white text-lg mb-1 line-clamp-1">{book.title}</h3>
                                <p className="text-xs text-blue-400 font-bold uppercase mb-3">{book.author}</p>
                                <p className="text-gray-400 text-xs line-clamp-3 mb-4 flex-1">{book.description}</p>
                                
                                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                                    <span className="text-xs text-gray-500 flex items-center gap-1"><FileText size={12}/> {book.pages} stran</span>
                                    {access ? (
                                        <a href={book.downloadUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg transition">
                                            <Download size={14}/> Stáhnout
                                        </a>
                                    ) : (
                                        <button disabled className="text-xs font-bold text-gray-500 bg-gray-800 px-3 py-1.5 rounded-lg cursor-not-allowed">
                                            Zamčeno
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {ebooks.length === 0 && (
                <div className="text-center py-20 text-gray-500 flex flex-col items-center">
                    <Book size={48} className="mb-4 opacity-20"/>
                    <p>Zatím žádné materiály v knihovně.</p>
                </div>
            )}
        </div>
    );
};

export default DashboardEbooks;