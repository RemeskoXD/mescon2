import React, { useState } from 'react';
import { FileText, Plus, Edit, Trash2, Save, X, Download, Image as ImageIcon } from 'lucide-react';
import { Ebook } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

interface AdminEbooksProps {
  ebooks: Ebook[];
  onSaveEbook: (ebook: Ebook) => void;
  onDeleteEbook: (id: string) => void;
  notify: (type: any, title: string, message: string) => void;
}

const AdminEbooks: React.FC<AdminEbooksProps> = ({ ebooks, onSaveEbook, onDeleteEbook, notify }) => {
  const [editingBook, setEditingBook] = useState<Ebook | null>(null);

  const handleCreate = () => {
      setEditingBook({
          id: `b-${Date.now()}`,
          title: '',
          description: '',
          coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800',
          downloadUrl: '#',
          pages: 0,
          author: 'Mescon Academy',
          minRole: 'student'
      });
  };

  const handleSave = () => {
      if (!editingBook || !editingBook.title) return;
      onSaveEbook(editingBook);
      setEditingBook(null);
  };

  const handleDelete = (id: string) => {
      if(window.confirm('Opravdu smazat tuto knihu?')) {
          onDeleteEbook(id);
      }
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-white">Knihovna (E-booky)</h2>
                <p className="text-gray-400 text-sm">Spravujte studijní materiály a PDF.</p>
            </div>
            <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white flex items-center gap-2 shadow-lg shadow-blue-900/20">
                <Plus size={18}/> Přidat E-book
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {ebooks.map(book => (
                <div key={book.id} className="bg-[#0B0F19] border border-gray-800 rounded-2xl overflow-hidden group hover:border-blue-500/30 transition shadow-xl flex flex-col">
                    <div className="h-64 bg-gray-900 relative overflow-hidden">
                        <img src={book.coverImage} className="w-full h-full object-cover transition duration-500 group-hover:scale-105"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="font-bold text-white text-lg leading-tight mb-1 line-clamp-2">{book.title}</h3>
                            <p className="text-xs text-gray-400">{book.author}</p>
                        </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                        <p className="text-gray-400 text-xs line-clamp-3 mb-4 flex-1">{book.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pt-4 border-t border-gray-800">
                            <span>{book.pages} stran</span>
                            <span className="flex items-center gap-1"><Download size={12}/> {Math.floor(Math.random() * 500)} stažení</span>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setEditingBook(book)} className="flex-1 py-2 bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white rounded-lg font-bold text-xs transition flex items-center justify-center gap-2">
                                <Edit size={14}/> Upravit
                            </button>
                            <button onClick={() => handleDelete(book.id)} className="px-3 py-2 bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white rounded-lg transition">
                                <Trash2 size={14}/>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <AnimatePresence>
            {editingBook && (
                <MotionDiv initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <MotionDiv initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} className="bg-[#0B0F19] w-full max-w-lg rounded-3xl border border-gray-800 shadow-2xl p-8 space-y-6">
                        <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                            <h3 className="text-xl font-bold text-white">Editor E-booku</h3>
                            <button onClick={() => setEditingBook(null)}><X className="text-gray-500 hover:text-white"/></button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="label">Název</label>
                                <input value={editingBook.title} onChange={e => setEditingBook({...editingBook, title: e.target.value})} className="input"/>
                            </div>
                            <div>
                                <label className="label">Autor</label>
                                <input value={editingBook.author} onChange={e => setEditingBook({...editingBook, author: e.target.value})} className="input"/>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Počet stran</label>
                                    <input type="number" value={editingBook.pages} onChange={e => setEditingBook({...editingBook, pages: parseInt(e.target.value)})} className="input"/>
                                </div>
                                <div>
                                    <label className="label">Odkaz ke stažení</label>
                                    <input value={editingBook.downloadUrl} onChange={e => setEditingBook({...editingBook, downloadUrl: e.target.value})} className="input"/>
                                </div>
                            </div>
                            <div>
                                <label className="label">Popis</label>
                                <textarea value={editingBook.description} onChange={e => setEditingBook({...editingBook, description: e.target.value})} className="input h-24"/>
                            </div>
                            <div>
                                <label className="label">URL Obálky</label>
                                <div className="flex gap-2">
                                    <input value={editingBook.coverImage} onChange={e => setEditingBook({...editingBook, coverImage: e.target.value})} className="input flex-1"/>
                                    <div className="w-12 h-12 rounded bg-gray-900 border border-gray-700 overflow-hidden flex-shrink-0">
                                        <img src={editingBook.coverImage} className="w-full h-full object-cover"/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                            <button onClick={() => setEditingBook(null)} className="px-4 py-2 text-gray-400 hover:text-white font-bold">Zrušit</button>
                            <button onClick={handleSave} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-bold shadow-lg">Uložit</button>
                        </div>
                    </MotionDiv>
                </MotionDiv>
            )}
        </AnimatePresence>
    </div>
  );
};

export default AdminEbooks;