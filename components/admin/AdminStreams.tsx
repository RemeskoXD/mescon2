import React, { useState } from 'react';
import { Film, Plus, Edit, Trash2, Save, X, Play, Clock, CheckCircle } from 'lucide-react';
import { Stream } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

interface AdminStreamsProps {
  streams: Stream[];
  onSaveStream: (stream: Stream) => void;
  onDeleteStream: (id: string) => void;
  notify: (type: any, title: string, message: string) => void;
}

const AdminStreams: React.FC<AdminStreamsProps> = ({ streams, onSaveStream, onDeleteStream, notify }) => {
  const [editingStream, setEditingStream] = useState<Stream | null>(null);

  const handleCreate = () => {
      setEditingStream({
          id: `s-${Date.now()}`,
          title: '',
          description: '',
          thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
          streamUrl: '',
          date: new Date().toISOString(),
          status: 'upcoming',
          viewers: 0,
          minRole: 'student'
      });
  };

  const handleSave = () => {
      if (!editingStream || !editingStream.title) return;
      onSaveStream(editingStream);
      setEditingStream(null);
  };

  const handleDelete = (id: string) => {
      if(window.confirm('Opravdu smazat tento stream?')) {
          onDeleteStream(id);
      }
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-white">Streamy & Živé Vysílání</h2>
                <p className="text-gray-400 text-sm">Plánujte vysílání a spravujte záznamy.</p>
            </div>
            <button onClick={handleCreate} className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-xl font-bold text-white flex items-center gap-2 shadow-lg shadow-red-900/20">
                <Plus size={18}/> Nový Stream
            </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
            {streams.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(stream => (
                <div key={stream.id} className="bg-[#0B0F19] border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row gap-6 hover:border-gray-700 transition">
                    <div className="w-full md:w-64 h-36 bg-gray-900 rounded-lg relative overflow-hidden flex-shrink-0 group">
                        <img src={stream.thumbnail} className="w-full h-full object-cover"/>
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                            <Play size={32} className="text-white fill-white"/>
                        </div>
                        <div className={`absolute top-2 left-2 px-2 py-1 rounded text-[10px] font-bold uppercase ${
                            stream.status === 'live' ? 'bg-red-600 text-white animate-pulse' : 
                            stream.status === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'
                        }`}>
                            {stream.status === 'live' ? '● ŽIVĚ' : stream.status === 'upcoming' ? 'PLÁNOVÁNO' : 'ZÁZNAM'}
                        </div>
                    </div>
                    
                    <div className="flex-1 py-2">
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                            <Clock size={12}/> {new Date(stream.date).toLocaleString()}
                        </div>
                        <h3 className="font-bold text-xl text-white mb-2">{stream.title}</h3>
                        <p className="text-gray-400 text-sm line-clamp-2 mb-4">{stream.description}</p>
                        <div className="text-xs text-gray-600 font-mono truncate bg-black/30 p-2 rounded border border-gray-800">
                            Embed: {stream.streamUrl}
                        </div>
                    </div>

                    <div className="flex flex-row md:flex-col justify-center gap-2 border-t md:border-t-0 md:border-l border-gray-800 pt-4 md:pt-0 md:pl-4">
                        <button onClick={() => setEditingStream(stream)} className="p-2 bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white rounded-lg transition"><Edit size={16}/></button>
                        <button onClick={() => handleDelete(stream.id)} className="p-2 bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white rounded-lg transition"><Trash2 size={16}/></button>
                    </div>
                </div>
            ))}
        </div>

        <AnimatePresence>
            {editingStream && (
                <MotionDiv initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <MotionDiv initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} className="bg-[#0B0F19] w-full max-w-lg rounded-3xl border border-gray-800 shadow-2xl p-8 space-y-6">
                        <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                            <h3 className="text-xl font-bold text-white">Nastavení Streamu</h3>
                            <button onClick={() => setEditingStream(null)}><X className="text-gray-500 hover:text-white"/></button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="label">Název</label>
                                <input value={editingStream.title} onChange={e => setEditingStream({...editingStream, title: e.target.value})} className="input"/>
                            </div>
                            <div>
                                <label className="label">Popis</label>
                                <textarea value={editingStream.description} onChange={e => setEditingStream({...editingStream, description: e.target.value})} className="input h-20"/>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Datum a Čas</label>
                                    <input type="datetime-local" value={editingStream.date.substring(0, 16)} onChange={e => setEditingStream({...editingStream, date: new Date(e.target.value).toISOString()})} className="input"/>
                                </div>
                                <div>
                                    <label className="label">Status</label>
                                    <select value={editingStream.status} onChange={e => setEditingStream({...editingStream, status: e.target.value as any})} className="input">
                                        <option value="upcoming">Plánováno</option>
                                        <option value="live">ŽIVĚ (Live)</option>
                                        <option value="ended">Záznam (Ended)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="label">Stream URL (YouTube/Vimeo Embed)</label>
                                <input value={editingStream.streamUrl} onChange={e => setEditingStream({...editingStream, streamUrl: e.target.value})} className="input font-mono text-blue-400" placeholder="https://www.youtube.com/embed/..."/>
                            </div>
                            <div>
                                <label className="label">Náhledový obrázek</label>
                                <input value={editingStream.thumbnail} onChange={e => setEditingStream({...editingStream, thumbnail: e.target.value})} className="input"/>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                            <button onClick={() => setEditingStream(null)} className="px-4 py-2 text-gray-400 hover:text-white font-bold">Zrušit</button>
                            <button onClick={handleSave} className="px-6 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white font-bold shadow-lg">Uložit Stream</button>
                        </div>
                    </MotionDiv>
                </MotionDiv>
            )}
        </AnimatePresence>
    </div>
  );
};

export default AdminStreams;