
import React from 'react';
import { Award, Download, ShieldCheck, Printer, CheckCircle2, Star } from 'lucide-react';
import { Certificate, User } from '../../types';
import { motion } from 'framer-motion';

const MotionDiv = motion.div as any;

interface DashboardCertificatesProps {
    certificates: Certificate[];
    user: User;
}

const DashboardCertificates: React.FC<DashboardCertificatesProps> = ({ certificates, user }) => {

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
                        @page { 
                            size: landscape; 
                            margin: 0; 
                        }
                        * {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                        body { 
                            margin: 0; 
                            padding: 0; 
                            background: white; 
                            display: flex; 
                            justify-content: center; 
                            align-items: center; 
                            min-height: 100vh; 
                            font-family: 'Montserrat', sans-serif;
                        }
                        
                        .cert-container {
                            width: 297mm;
                            height: 210mm;
                            padding: 15mm;
                            box-sizing: border-box;
                            position: relative;
                            overflow: hidden;
                            background-color: #fff;
                            background-image: url('https://www.transparenttextures.com/patterns/cream-paper.png');
                        }

                        .border-outer {
                            position: absolute;
                            inset: 10mm;
                            border: 4px double #1e3a8a;
                            z-index: 1;
                        }

                        .border-inner {
                            position: absolute;
                            inset: 13mm;
                            border: 1px solid #d4af37;
                            z-index: 2;
                        }

                        .main-content {
                            position: relative;
                            z-index: 10;
                            height: 100%;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            text-align: center;
                            padding: 20mm;
                        }

                        .logo-badge {
                            width: 90px;
                            height: 90px;
                            margin-bottom: 8mm;
                        }

                        h1 {
                            font-family: 'Cinzel', serif;
                            font-size: 58pt;
                            color: #1e3a8a;
                            margin: 0;
                            letter-spacing: 12pt;
                            text-transform: uppercase;
                            line-height: 1;
                        }

                        .cert-type {
                            font-size: 16pt;
                            color: #d4af37;
                            letter-spacing: 5pt;
                            text-transform: uppercase;
                            margin: 4mm 0 12mm 0;
                            font-weight: 700;
                        }

                        .intro-text {
                            font-size: 14pt;
                            color: #555;
                            margin-bottom: 4mm;
                        }

                        .student-name {
                            font-family: 'Pinyon Script', cursive;
                            font-size: 68pt;
                            color: #111;
                            margin: 2mm 0;
                            padding-bottom: 2mm;
                            min-width: 80%;
                            border-bottom: 1px solid rgba(212, 175, 55, 0.3);
                        }

                        .course-description {
                            font-size: 16pt;
                            color: #444;
                            max-width: 85%;
                            line-height: 1.6;
                            margin-top: 8mm;
                        }

                        .course-title {
                            font-family: 'Cinzel', serif;
                            font-weight: 700;
                            color: #1e3a8a;
                            font-size: 24pt;
                            display: block;
                            margin-top: 2mm;
                        }

                        .footer-section {
                            margin-top: auto;
                            width: 100%;
                            display: flex;
                            justify-content: space-between;
                            align-items: flex-end;
                            padding-top: 10mm;
                        }

                        .sig-block {
                            text-align: center;
                            width: 240px;
                        }

                        .sig-name {
                            font-family: 'Pinyon Script', cursive;
                            font-size: 32pt;
                            color: #1e3a8a;
                            margin-bottom: -4mm;
                        }

                        .sig-line {
                            border-top: 1.5px solid #333;
                            padding-top: 2mm;
                            font-size: 10pt;
                            text-transform: uppercase;
                            font-weight: 700;
                            color: #666;
                            letter-spacing: 1pt;
                        }

                        .qr-code-box {
                            text-align: left;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                        }

                        .qr-code-box img {
                            width: 85px;
                            height: 85px;
                            border: 1px solid #f0f0f0;
                            padding: 2px;
                            background: white;
                        }

                        .qr-label {
                            font-size: 7pt;
                            margin-top: 2mm;
                            color: #999;
                            font-weight: 700;
                            letter-spacing: 0.5pt;
                        }

                        .seal {
                            position: absolute;
                            bottom: 25mm;
                            right: 45mm;
                            width: 130px;
                            height: 130px;
                            opacity: 0.85;
                        }

                        .cert-id-tag {
                            position: absolute;
                            bottom: 6mm;
                            left: 50%;
                            transform: translateX(-50%);
                            font-family: monospace;
                            font-size: 9pt;
                            color: #aaa;
                            letter-spacing: 1pt;
                        }
                    </style>
                </head>
                <body>
                    <div class="cert-container">
                        <div class="border-outer"></div>
                        <div class="border-inner"></div>
                        
                        <div class="main-content">
                            <div class="logo-badge">
                                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M50 5L15 20V45C15 66.6 29.9 86.4 50 95C70.1 86.4 85 66.6 85 45V20L50 5Z" fill="#1e3a8a"/>
                                    <path d="M40 65L25 50L30 45L40 55L70 25L75 30L40 65Z" fill="#d4af37"/>
                                </svg>
                            </div>
                            
                            <h1>Certifikát</h1>
                            <div class="cert-type">Úspěšného Absolvování</div>
                            
                            <div class="intro-text">Tímto čestně potvrzujeme, že student</div>
                            <div class="student-name">${cert.studentName}</div>
                            
                            <div class="course-description">
                                úspěšně splnil veškeré studijní moduly, praktické úkoly a finální zkoušku v rámci certifikačního programu
                                <span class="course-title">${cert.courseName}</span>
                            </div>

                            <div class="footer-section">
                                <div class="qr-code-box">
                                    <img src="${qrUrl}" />
                                    <div class="qr-label">VERIFICATION ID: ${cert.code}</div>
                                </div>
                                
                                <div class="sig-block">
                                    <div class="sig-name">Vašek Gabriel</div>
                                    <div class="sig-line">Zakladatel Mescon Academy</div>
                                </div>
                            </div>
                        </div>

                        <div class="seal">
                            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="100" cy="100" r="95" fill="none" stroke="#d4af37" stroke-width="1" stroke-dasharray="3,3"/>
                                <circle cx="100" cy="100" r="80" fill="#d4af37" fill-opacity="0.05" stroke="#d4af37" stroke-width="0.5"/>
                                <text x="50%" y="45%" text-anchor="middle" fill="#d4af37" font-family="Cinzel" font-size="18" font-weight="bold">MESCON</text>
                                <text x="50%" y="62%" text-anchor="middle" fill="#d4af37" font-family="Cinzel" font-size="14">ELITE ACADEMY</text>
                                <text x="50%" y="75%" text-anchor="middle" fill="#d4af37" font-family="Cinzel" font-size="11">OFFICIAL SEAL</text>
                            </svg>
                        </div>

                        <div class="cert-id-tag">VYDÁNO SYSTÉMEM MESCON ACADEMY • AUTENTICITA ZARUČENA</div>
                    </div>
                    <script>
                        window.onload = () => {
                            setTimeout(() => {
                                window.print();
                            }, 1000);
                        }
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight uppercase">Moje <span className="text-blue-500">Úspěchy</span></h2>
                    <p className="text-gray-400 text-sm">Získejte oficiální uznání za své dovednosti.</p>
                </div>
            </div>

            {certificates.length === 0 ? (
                <div className="text-center py-24 bg-[#0B0F19] rounded-[2.5rem] border-2 border-dashed border-gray-800 flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-900 rounded-3xl flex items-center justify-center mb-6 text-gray-700">
                        <Award size={40}/>
                    </div>
                    <h3 className="text-xl font-bold text-gray-400 mb-2">Zatím žádné certifikáty</h3>
                    <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
                        Pokračujte ve studiu. Každý dokončený kurz vám otevře dveře k nové certifikaci.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {certificates.map(cert => (
                        <MotionDiv 
                            key={cert.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -5 }}
                            className="flex flex-col gap-6"
                        >
                            {/* Premium Card Display */}
                            <div className="relative group bg-[#020617] p-1.5 rounded-[2rem] shadow-2xl overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20 opacity-50"></div>
                                
                                <div className="relative bg-white p-6 md:p-10 rounded-[1.8rem] min-h-[350px] flex flex-col items-center text-center justify-center border-4 border-double border-gray-200">
                                    <div className="absolute inset-4 border border-blue-900/10 pointer-events-none"></div>
                                    
                                    <div className="relative z-10 space-y-4">
                                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-xl transform -rotate-3 mb-2">
                                            <Award size={32} />
                                        </div>
                                        
                                        <h3 className="text-3xl font-black uppercase tracking-[0.2em] text-blue-900 leading-none">Certifikát</h3>
                                        <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-yellow-600 uppercase tracking-widest mb-4">
                                            <Star size={10} fill="currentColor"/> MESCON ELITE ACADEMY <Star size={10} fill="currentColor"/>
                                        </div>

                                        <div className="h-px w-32 bg-gray-200 mx-auto"></div>

                                        <div className="py-2">
                                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Držitel certifikátu</p>
                                            <h4 className="text-2xl md:text-3xl font-serif italic font-bold text-gray-900 leading-tight">
                                                {cert.studentName}
                                            </h4>
                                        </div>

                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Absolvovaný program</p>
                                            <p className="text-sm md:text-base font-bold text-blue-800">{cert.courseName}</p>
                                        </div>

                                        <div className="flex justify-between items-end w-full pt-6 mt-6 border-t border-gray-100 text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                                            <div className="text-left">
                                                <p>Vydáno: {cert.issueDate}</p>
                                                <p className="font-mono mt-1 text-blue-600">ID: {cert.code}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="flex items-center gap-1 text-green-600"><ShieldCheck size={10}/> VERIFIED</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => handlePrint(cert)}
                                    className="py-4 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm transition shadow-lg shadow-blue-900/30 flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <Download size={18}/> STÁHNOUT PDF
                                </button>
                                <a 
                                    href={`/verify?verify=${cert.code}`} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="py-4 px-6 bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white rounded-2xl font-black text-sm transition border border-gray-800 flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <ShieldCheck size={18} className="text-green-500"/> OVĚŘIT PRAVOST
                                </a>
                            </div>
                        </MotionDiv>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DashboardCertificates;
