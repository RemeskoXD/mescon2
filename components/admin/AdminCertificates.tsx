
import React, { useState } from 'react';
import { Search, Award, Edit, Save, X, Printer, ShieldCheck } from 'lucide-react';
import { User, Certificate } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

interface AdminCertificatesProps {
    allUsers: User[];
    onUpdateCertificate: (userId: string, certificateId: string, newName: string) => void;
    notify: (type: any, title: string, message: string) => void;
}

const AdminCertificates: React.FC<AdminCertificatesProps> = ({ allUsers, onUpdateCertificate, notify }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [editingCert, setEditingCert] = useState<{ cert: Certificate, userId: string, newName: string } | null>(null);

    const allCertificates = allUsers.flatMap(user => 
        (user.certificates || []).map(cert => ({ ...cert, userId: user.id, userEmail: user.email }))
    );

    const filteredCertificates = allCertificates.filter(c => 
        c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditClick = (cert: any) => {
        setEditingCert({
            cert: cert,
            userId: cert.userId,
            newName: cert.studentName
        });
    };

    const handleSave = () => {
        if (!editingCert) return;
        onUpdateCertificate(editingCert.userId, editingCert.cert.id, editingCert.newName);
        setEditingCert(null);
    };

    const handlePrint = (cert: Certificate) => {
        const printWindow = window.open('', '', 'width=1200,height=800');
        if (!printWindow) return;

        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${window.location.origin}?verify=${cert.code}`;

        printWindow.document.write(`
            <html>
                <head>
                    <title>Certifikát - ${cert.courseName}</title>
                    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Montserrat:wght@300;400;700&family=Pinyon+Script&display=swap" rel="stylesheet">
                    <style>
                        @page { size: landscape; margin: 0; }
                        * {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                        body { 
                            margin: 0; padding: 0; background: white; 
                            display: flex; justify-content: center; align-items: center; 
                            min-height: 100vh; font-family: 'Montserrat', sans-serif;
                        }
                        .cert-container {
                            width: 297mm; height: 210mm; padding: 15mm;
                            box-sizing: border-box; position: relative; overflow: hidden;
                            background-image: url('https://www.transparenttextures.com/patterns/cream-paper.png');
                        }
                        .border-outer { position: absolute; inset: 10mm; border: 4px double #1e3a8a; z-index: 1; }
                        .border-inner { position: absolute; inset: 13mm; border: 1px solid #d4af37; z-index: 2; }
                        .main-content {
                            position: relative; z-index: 10; height: 100%;
                            display: flex; flex-direction: column; align-items: center;
                            justify-content: center; text-align: center; padding: 20mm;
                        }
                        h1 { font-family: 'Cinzel', serif; font-size: 58pt; color: #1e3a8a; margin: 0; letter-spacing: 12pt; text-transform: uppercase; }
                        .student-name { font-family: 'Pinyon Script', cursive; font-size: 68pt; color: #111; margin: 5mm 0; border-bottom: 1px solid rgba(212, 175, 55, 0.3); min-width: 70%; }
                        .course-title { font-family: 'Cinzel', serif; font-weight: 700; color: #1e3a8a; font-size: 24pt; display: block; margin-top: 5mm; }
                        .footer-section { margin-top: auto; width: 100%; display: flex; justify-content: space-between; align-items: flex-end; }
                        .sig-block { text-align: center; width: 240px; }
                        .sig-name { font-family: 'Pinyon Script', cursive; font-size: 32pt; color: #1e3a8a; }
                        .sig-line { border-top: 1.5px solid #333; padding-top: 2mm; font-size: 10pt; text-transform: uppercase; font-weight: 700; color: #666; }
                        .qr-box img { width: 85px; height: 85px; background: white; }
                    </style>
                </head>
                <body>
                    <div class="cert-container">
                        <div class="border-outer"></div><div class="border-inner"></div>
                        <div class="main-content">
                            <h1>Certifikát</h1>
                            <div style="font-size: 16pt; color: #d4af37; letter-spacing: 5pt; text-transform: uppercase; margin-top: 5mm;">Úspěšného Absolvování</div>
                            <div style="font-size: 14pt; color: #555; margin-top: 10mm;">Tímto potvrzujeme, že student</div>
                            <div class="student-name">${cert.studentName}</div>
                            <div style="font-size: 16pt; color: #444; margin-top: 10mm;">úspěšně dokončil program<br/><span class="course-title">${cert.courseName}</span></div>
                            <div class="footer-section">
                                <div class="qr-box"><img src="${qrUrl}" /><div style="font-size: 7pt; margin-top: 2mm; color: #999;">ID: ${cert.code}</div></div>
                                <div class="sig-block"><div class="sig-name">Vašek Gabriel</div><div class="sig-line">Zakladatel Mescon Academy</div></div>
                            </div>
                        </div>
                    </div>
                    <script>window.onload = () => { setTimeout(() => { window.print(); window.close(); }, 1000); }</script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Správa Certifikátů</h2>
                    <p className="text-gray-400 text-sm">Přehled a editace vydaných certifikátů.</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                        type="text" 
                        placeholder="Jméno, kód, kurz..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                    />
                </div>
            </div>

            <div className="bg-[#0B0F19] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-gray-900/80 text-xs uppercase font-bold tracking-wider border-b border-gray-800">
                            <tr>
                                <th className="p-4 min-w-[120px]">Kód</th>
                                <th className="p-4 min-w-[150px]">Jméno na certifikátu</th>
                                <th className="p-4 min-w-[200px]">Kurz</th>
                                <th className="p-4 min-w-[100px]">Datum Vydání</th>
                                <th className="p-4 text-right min-w-[100px]">Akce</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {filteredCertificates.map((cert) => (
                                <tr key={cert.id} className="hover:bg-gray-800/30 transition">
                                    <td className="p-4 font-mono text-blue-400 text-xs">{cert.code}</td>
                                    <td className="p-4 font-bold text-white text-lg font-serif italic">{cert.studentName}</td>
                                    <td className="p-4">{cert.courseName}</td>
                                    <td className="p-4">{cert.issueDate}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handlePrint(cert as any)} className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition" title="Náhled / Tisk">
                                                <Printer size={16}/>
                                            </button>
                                            <button onClick={() => handleEditClick(cert)} className="p-2 bg-blue-600/20 text-blue-500 hover:bg-blue-600 hover:text-white rounded-lg transition" title="Upravit jméno">
                                                <Edit size={16}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {editingCert && (
                    <MotionDiv initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                        <MotionDiv initial={{y: 20, opacity:0}} animate={{y:0, opacity:1}} className="bg-[#0B0F19] w-full max-w-md rounded-2xl border border-gray-800 shadow-2xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2"><Edit size={20}/> Upravit Certifikát</h3>
                                <button onClick={() => setEditingCert(null)}><X className="text-gray-500 hover:text-white"/></button>
                            </div>
                            <input value={editingCert.newName} onChange={e => setEditingCert({...editingCert, newName: e.target.value})} className="input text-lg" autoFocus />
                            <div className="flex gap-3 mt-6">
                                <button onClick={() => setEditingCert(null)} className="flex-1 py-3 text-gray-400 font-bold">Zrušit</button>
                                <button onClick={handleSave} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg">Uložit</button>
                            </div>
                        </MotionDiv>
                    </MotionDiv>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminCertificates;
