import React, { useEffect, useRef } from 'react';
import { Award, CheckCircle, Download, Printer, X, Shield, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CertificateData } from '../context/AuthContext';

interface CertificateModalProps {
  certificate: CertificateData;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fire festive celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Ignore in non-browser context
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8">
        
        {/* Modal actions header */}
        <div className="flex items-center justify-between pb-3 text-slate-300">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Shield className="w-4 h-4" />
            <span>VERIFIED ACADEMIC CREDENTIAL · REGISTRY ID: {certificate.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Card Printable Container */}
        <div 
          ref={certRef}
          className="relative bg-gradient-to-b from-[#0c1222] via-[#090e1c] to-[#060913] border-2 border-cyan-500/40 rounded-2xl p-10 md:p-14 shadow-[0_0_60px_rgba(6,182,212,0.2)] overflow-hidden text-center"
        >
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-cyan-400/50 rounded-tl-lg pointer-events-none" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-cyan-400/50 rounded-tr-lg pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-cyan-400/50 rounded-bl-lg pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-cyan-400/50 rounded-br-lg pointer-events-none" />

          {/* Watermark badge */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <Shield className="w-[500px] h-[500px] text-cyan-400" />
          </div>

          {/* Institution Header */}
          <div className="relative z-10 flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-600/30 border border-cyan-400/50 flex items-center justify-center mb-3 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
              <Award className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white font-sans uppercase">
              Security Analyzires Academy
            </h1>
            <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest mt-1">
              Certificate of Academic & Technical Mastery
            </p>
          </div>

          <div className="relative z-10 my-4 text-slate-300 text-sm">
            This is to officially certify that
          </div>

          {/* Recipient Name */}
          <div className="relative z-10 text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-300 font-sans tracking-tight my-2">
            {certificate.recipientName}
          </div>

          <div className="relative z-10 max-w-xl mx-auto text-xs md:text-sm text-slate-400 leading-relaxed mt-4">
            has demonstrated exceptional competence by successfully completing all 10 intensive curriculum modules, technical hands-on labs, and graded assessments covering Cryptography, Network Packet Inspection, Linux OS Hardening, Web App Security, Threat Intelligence, and Cloud Defense.
          </div>

          {/* Key Metrics Strip */}
          <div className="relative z-10 grid grid-cols-3 gap-4 max-w-md mx-auto my-8 p-4 rounded-xl bg-white/[0.03] border border-white/10 text-center">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Curriculum</div>
              <div className="text-sm font-bold text-white font-mono mt-0.5">10/10 Modules</div>
            </div>
            <div className="border-x border-white/10">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Grade Score</div>
              <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">{certificate.averageScore}%</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Issue Date</div>
              <div className="text-sm font-bold text-white font-mono mt-0.5">{certificate.issuedAt}</div>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="relative z-10 flex items-end justify-between pt-6 border-t border-white/10 max-w-xl mx-auto">
            <div className="text-left">
              <div className="font-serif italic text-sm text-cyan-300">Marcus Sterling, CISSP</div>
              <div className="text-[10px] text-slate-400 font-mono">Dean of Offensive & Defensive Studies</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-emerald-400/60 flex items-center justify-center text-emerald-400 bg-emerald-500/10">
                <CheckCircle className="w-6 h-6" />
              </div>
              <span className="text-[9px] font-mono text-emerald-400 mt-1 uppercase">Cryptographically Verified</span>
            </div>

            <div className="text-right">
              <div className="font-serif italic text-sm text-cyan-300">Dr. Elena Rostova</div>
              <div className="text-[10px] text-slate-400 font-mono">Head of Threat Intelligence Lab</div>
            </div>
          </div>

          {/* Hash footer */}
          <div className="relative z-10 mt-6 pt-4 border-t border-white/5 text-[9px] font-mono text-slate-500 break-all">
            VERIFICATION SIGNATURE: {certificate.verificationHash} · REGISTERED TO: {certificate.recipientEmail}
          </div>
        </div>
      </div>
    </div>
  );
};
