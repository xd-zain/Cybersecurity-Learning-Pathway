import React, { useState } from 'react';
import { 
  Shield, 
  Terminal, 
  Lock, 
  Cpu, 
  Award, 
  CheckCircle, 
  ArrowRight, 
  Sparkles, 
  Eye, 
  Database,
  Wifi,
  ChevronDown,
  Layers,
  Zap,
  Globe,
  Users
} from 'lucide-react';
import SculptureHero from './ui/liquid-sculpture-hero';
import GlassFolder from './ui/glass-folder-cards';
import { COURSE_MODULES } from '../data/curriculum';

interface LandingPageProps {
  onEnrollClick: () => void;
  onExploreModules: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnrollClick, onExploreModules }) => {
  // Interactive Terminal Simulator state
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "Security Analyzires v4.2 [Zero-Trust Sandbox Initialized]",
    "Type 'help' or click a command preset below to inspect threat intelligence telemetry.",
  ]);

  const handleRunCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    let response: string[] = [];
    if (trimmed === 'help') {
      response = [
        "Available commands:",
        "  nmap -sS 192.168.1.1       : Execute stealth TCP SYN port scan",
        "  wireshark --filter 'syn'    : Inspect raw packet capture headers",
        "  hashcat -m 0 hash.txt       : Decrypt SHA-256 cryptographic hash",
        "  whois threat-actor.io       : Query autonomous system registration",
        "  clear                       : Reset terminal buffer"
      ];
    } else if (trimmed === 'clear') {
      setTerminalLogs([]);
      setTerminalInput('');
      return;
    } else if (trimmed.includes('nmap')) {
      response = [
        "Starting Nmap 7.94 ( https://nmap.org ) at 2026-10-19 15:12 UTC",
        "Nmap scan report for target-gateway (192.168.1.1)",
        "Host is up (0.0014s latency).",
        "PORT     STATE SERVICE       VERSION",
        "22/tcp   open  ssh           OpenSSH 9.2p1 (Protocol 2.0 - Hardened)",
        "80/tcp   open  http          Nginx 1.24.0 (TLS 1.3 Strict Enforced)",
        "443/tcp  open  https         Nginx 1.24.0 (HSTS Preloaded, AES-256-GCM)",
        "3306/tcp closed mysql         Firewall Blocked (Stateful Rule #14)",
        "Nmap done: 1 IP address (1 host up) scanned in 0.42 seconds"
      ];
    } else if (trimmed.includes('wireshark')) {
      response = [
        "Packet #1402: 10.0.0.42 -> 192.168.1.1 [TCP SYN] Seq=0 Win=64240 Len=0 MSS=1460",
        "Packet #1403: 192.168.1.1 -> 10.0.0.42 [TCP SYN, ACK] Seq=0 Ack=1 Win=65160 Len=0",
        "Packet #1404: 10.0.0.42 -> 192.168.1.1 [TCP ACK] Seq=1 Ack=1 Win=64240 Len=0",
        "Status: Clean 3-Way Handshake Confirmed. No ARP cache tampering detected."
      ];
    } else if (trimmed.includes('hashcat')) {
      response = [
        "Session..........: hashcat-sec",
        "Status...........: Cracked",
        "Hash.Type........: SHA256",
        "Target...........: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "Recovered.Time...: 0.08 secs (Dictionary Hash Match)",
        "Plaintext........: [Empty Byte Payload / RFC 6234 Compliance Validated]"
      ];
    } else if (trimmed.includes('whois')) {
      response = [
        "Domain Name: THREAT-ACTOR.IO",
        "Registry Domain ID: D503348003-CNIC",
        "Registrar Abuse Contact Email: abuse@securityanalyzires.io",
        "Name Server: NS1.CLOUDFLARE.COM",
        "DNSSEC: signedDelegation",
        "Risk Score: 98/100 [High Threat Flagged by SOC Intel]"
      ];
    } else {
      response = [
        `Command not recognized: '${trimmed}'. Type 'help' to view valid defense commands.`
      ];
    }

    setTerminalLogs(prev => [...prev, `> ${trimmed}`, ...response]);
    setTerminalInput('');
  };

  return (
    <div className="w-full bg-[#111110] text-[#F1EFEA] selection:bg-[#F1EFEA] selection:text-[#111110]">
      
      {/* 1. SCULPTURE HERO — LIQUID PARTICLE WebGL2 HERO */}
      <SculptureHero
        showNav={false}
        height="86vh"
        backdropText="ANALYZIRES"
        brand="Security Analyzires"
        eyebrow="Zero-Trust Cybersecurity Academy — Est. 2026"
        headline={"Cyber Defense\nFrom Scratch."}
        headlineAccent="From Scratch."
        body="We engineer cyber defense practitioners with the precision of systems engineering and the rigor of real-world packet telemetry. 10 structured lectures, graded labs, and dual-Gemini AI mentors."
        primaryCta={{
          label: "Launch 10-Module Dashboard",
          href: "#",
          onClick: onExploreModules,
        }}
        secondaryCta={{
          label: "Curriculum Roadmap",
          href: "#curriculum",
          onClick: onExploreModules,
        }}
        hint="Hover across the cyber defense core"
        theme="dark"
        background="#111110"
        darkBackground="#111110"
        textColor="#F1EFEA"
        accentColor="#F1EFEA"
        src="/src/assets/images/cyber_hero_defense_1792447409816.jpg"
        darkSrc="/src/assets/images/cyber_hero_defense_1792447409816.jpg"
        showCredit={false}
      />

      {/* PROOF BADGES STRIP IN MINIMAL FORMA STYLE */}
      <div className="border-y border-[rgba(241,239,234,0.08)] bg-[#141413] py-5 px-6">
        <div className="max-w-[1360px] mx-auto flex flex-wrap items-center justify-between gap-6 text-xs text-[#98968f]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F1EFEA]" />
            <span className="text-[#F1EFEA] font-medium">10 Sequential Modules</span>
            <span className="opacity-40">·</span>
            <span>Zero to Advanced</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F1EFEA]" />
            <span className="text-[#F1EFEA] font-medium">Graded Lab Quizzes</span>
            <span className="opacity-40">·</span>
            <span>75% Benchmark</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F1EFEA]" />
            <span className="text-[#F1EFEA] font-medium">Dual-Gemini AI</span>
            <span className="opacity-40">·</span>
            <span>Flash & Pro Modes</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[#F1EFEA] font-medium">Official Certificate</span>
            <span className="opacity-40">·</span>
            <span>QR Verifiable</span>
          </div>
        </div>
      </div>

      {/* 2. WHY CHOOSE SECURITY ANALYZIRES — VALUE PROPOSITION */}
      <section className="py-24 px-6 max-w-[1360px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#98968f]">
            Clear Value Proposition
          </span>
          <h2 className="text-3xl sm:text-4xl font-normal text-[#F1EFEA] tracking-tight mt-3">
            Why Learn Cybersecurity <span className="font-serif italic font-normal text-[#F1EFEA]">From Scratch</span> With Us?
          </h2>
          <p className="text-sm text-[#98968f] mt-3 leading-relaxed">
            Rather than disparate videos or expensive bootcamps, Security Analyzires delivers an integrated, structured defense academy.
          </p>
        </div>

        {/* 3 Value Proposition Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-8 rounded-2xl bg-[#171716] border border-[rgba(241,239,234,0.1)] flex flex-col justify-between group hover:border-[rgba(241,239,234,0.25)] transition-all">
            <div>
              <div className="text-3xl font-serif italic text-[#98968f] mb-4">01.</div>
              <h3 className="text-lg font-medium text-[#F1EFEA] mb-2">
                Zero Prerequisites
              </h3>
              <p className="text-xs text-[#98968f] leading-relaxed">
                Start from foundational networking, OSI model, and TCP/IP handshakes before moving to penetration testing and cloud infrastructure.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[rgba(241,239,234,0.06)] flex items-center gap-2 text-xs text-[#98968f]">
              <CheckCircle className="w-3.5 h-3.5 text-[#F1EFEA]" />
              <span>Foundational to Advanced</span>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-[#171716] border border-[rgba(241,239,234,0.1)] flex flex-col justify-between group hover:border-[rgba(241,239,234,0.25)] transition-all">
            <div>
              <div className="text-3xl font-serif italic text-[#98968f] mb-4">02.</div>
              <h3 className="text-lg font-medium text-[#F1EFEA] mb-2">
                Instant Graded Assessments
              </h3>
              <p className="text-xs text-[#98968f] leading-relaxed">
                Every video lecture includes a 4-question graded quiz with automated scoring, instant explanations, and retake opportunities.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[rgba(241,239,234,0.06)] flex items-center gap-2 text-xs text-[#98968f]">
              <CheckCircle className="w-3.5 h-3.5 text-[#F1EFEA]" />
              <span>75% Passing Standard</span>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-[#171716] border border-[rgba(241,239,234,0.1)] flex flex-col justify-between group hover:border-[rgba(241,239,234,0.25)] transition-all">
            <div>
              <div className="text-3xl font-serif italic text-[#98968f] mb-4">03.</div>
              <h3 className="text-lg font-medium text-[#F1EFEA] mb-2">
                Dual-Gemini AI Mentoring
              </h3>
              <p className="text-xs text-[#98968f] leading-relaxed">
                Switch seamlessly between Flash mode for rapid Q&A and Pro mode for deep architectural security analysis and exploit debugging.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-[rgba(241,239,234,0.06)] flex items-center gap-2 text-xs text-[#98968f]">
              <CheckCircle className="w-3.5 h-3.5 text-[#F1EFEA]" />
              <span>Google Gen AI Powered</span>
            </div>
          </div>

        </div>
      </section>

      {/* 3. INTERACTIVE COURSE DOSSIERS (GLASS FOLDERS) */}
      <section className="py-20 px-6 max-w-[1360px] mx-auto border-t border-[rgba(241,239,234,0.08)]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-widest text-[#98968f]">
            Interactive Course Dossiers
          </span>
          <h2 className="text-3xl font-normal text-[#F1EFEA] tracking-tight mt-2">
            Inspect Course Resources in <span className="font-serif italic font-normal">Glass Folders</span>
          </h2>
          <p className="text-xs text-[#98968f] mt-2">
            Click any frosted folder below to reveal enclosed labs, PCAP files, and cryptographic notes.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-10 pt-2">
          <GlassFolder 
            label="Network Inspection" 
            meta="Wireshark & PCAP" 
            art="ember" 
            seed={7}
            files={[
              { name: "HTTP Auth Leak.pcap", meta: "Network · 3.4 MB", art: "ember" },
              { name: "SYN Flood Capture", meta: "DDoS Trace · 1.8 MB", art: "aurora" },
              { name: "DNS Poisoning Analysis", meta: "PDF Report · 450 KB" }
            ]}
          />

          <GlassFolder 
            label="Cryptographic Labs" 
            meta="PKI & Ciphers" 
            art="aurora" 
            seed={19}
            files={[
              { name: "RSA-4096 Key Pair", meta: "Keys · PEM format", art: "glacier" },
              { name: "Diffie-Hellman Handshake", meta: "Lab 04 Guide", art: "dusk" },
              { name: "Argon2 vs PBKDF2 Bench", meta: "CSV Telemetry" }
            ]}
          />

          <GlassFolder 
            label="Incident Response" 
            meta="Forensics & SOC" 
            art="verdant" 
            seed={42}
            files={[
              { name: "Memory Dump Artifacts", meta: "RAM · 8.2 GB", art: "ember" },
              { name: "MITRE ATT&CK Matrix Map", meta: "JSON TTPs", art: "verdant" },
              { name: "Ransomware Triage Note", meta: "SOC Briefing" }
            ]}
          />
        </div>
      </section>

      {/* 4. LIVE THREAT LAB TERMINAL SIMULATOR */}
      <section className="py-20 px-6 max-w-[1360px] mx-auto border-t border-[rgba(241,239,234,0.08)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#98968f]">
              Hands-On Simulation
            </span>
            <h2 className="text-3xl font-normal text-[#F1EFEA] tracking-tight">
              Test Real Cyber Tools in Your <span className="font-serif italic font-normal">Browser</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#98968f] leading-relaxed">
              Cybersecurity is an active discipline. In our curriculum, you do not just watch lectures—you learn how to read raw packet streams, audit open ports, and understand adversary techniques.
            </p>

            <div className="space-y-2 pt-2">
              <div className="text-xs font-mono text-[#F1EFEA]">Quick Presets:</div>
              <div className="flex flex-wrap gap-2">
                {['nmap -sS 192.168.1.1', "wireshark --filter 'syn'", 'hashcat -m 0 hash.txt', 'whois threat-actor.io'].map((c, i) => (
                  <button
                    key={i}
                    onClick={() => handleRunCommand(c)}
                    className="px-3 py-1.5 rounded-full bg-[#181817] border border-[rgba(241,239,234,0.14)] hover:border-[rgba(241,239,234,0.3)] text-[#F1EFEA] text-xs font-mono transition-colors cursor-pointer"
                  >
                    $ {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-[rgba(241,239,234,0.12)] bg-[#141413] shadow-2xl overflow-hidden font-mono text-xs">
              {/* Terminal Title Bar */}
              <div className="px-4 py-3 bg-[#181817] border-b border-[rgba(241,239,234,0.08)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20 inline-block" />
                  <span className="text-[#98968f] text-xs ml-2">analyzer@securityanalyzires: ~</span>
                </div>
                <button
                  onClick={() => handleRunCommand('clear')}
                  className="text-[#98968f] hover:text-[#F1EFEA] text-[11px]"
                >
                  Clear
                </button>
              </div>

              {/* Terminal Screen Logs */}
              <div className="p-4 h-72 overflow-y-auto space-y-1.5 text-[#F1EFEA]/80 select-text">
                {terminalLogs.map((log, idx) => (
                  <div key={idx} className={log.startsWith('>') ? 'text-[#F1EFEA] font-semibold' : 'text-[#98968f]'}>
                    {log}
                  </div>
                ))}
              </div>

              {/* Terminal Command Input */}
              <form 
                onSubmit={(e) => { e.preventDefault(); handleRunCommand(terminalInput); }}
                className="flex items-center px-4 py-3 bg-[#111110] border-t border-[rgba(241,239,234,0.08)]"
              >
                <span className="text-[#F1EFEA] font-bold mr-2">$</span>
                <input
                  type="text"
                  placeholder="Type a command (or click preset above)..."
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  className="flex-1 bg-transparent border-0 outline-none text-[#F1EFEA] text-xs font-mono placeholder-[#98968f]/50"
                />
                <button type="submit" className="text-xs text-[#F1EFEA] hover:opacity-80 font-medium">
                  Run ↵
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* 5. 10-MODULE CURRICULUM OVERVIEW */}
      <section id="curriculum" className="py-24 px-6 max-w-[1360px] mx-auto border-t border-[rgba(241,239,234,0.08)]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#98968f]">
            Full Academy Roadmap
          </span>
          <h2 className="text-3xl sm:text-4xl font-normal text-[#F1EFEA] tracking-tight mt-2">
            The 10-Part Curriculum <span className="font-serif italic font-normal">Breakdown</span>
          </h2>
          <p className="text-sm text-[#98968f] mt-2">
            Progress step-by-step from fundamental principles to production-level cloud security operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {COURSE_MODULES.map((m) => (
            <div 
              key={m.id}
              onClick={onExploreModules}
              className="p-5 rounded-xl bg-[#171716] border border-[rgba(241,239,234,0.1)] flex flex-col justify-between hover:border-[rgba(241,239,234,0.3)] transition-all group cursor-pointer shadow-md"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-3">
                  <span className="text-[#F1EFEA] font-medium">MODULE 0{m.id}</span>
                  <span className="text-[#98968f]">{m.duration}</span>
                </div>
                <h3 className="text-sm font-medium text-[#F1EFEA] mb-2 group-hover:underline transition-colors line-clamp-2">
                  {m.title}
                </h3>
                <p className="text-[11px] text-[#98968f] line-clamp-3 leading-relaxed">
                  {m.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[rgba(241,239,234,0.06)] flex items-center justify-between text-[10px] font-mono">
                <span className="text-[#98968f]">{m.level}</span>
                <span className="text-[#F1EFEA] group-hover:translate-x-0.5 transition-transform font-sans font-medium">
                  Open Lab →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section id="faq" className="py-20 px-6 max-w-[900px] mx-auto border-t border-[rgba(241,239,234,0.08)]">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-[#98968f]">
            Questions & Answers
          </span>
          <h2 className="text-2xl sm:text-3xl font-normal text-[#F1EFEA] tracking-tight mt-2">
            Frequently Asked <span className="font-serif italic font-normal">Questions</span>
          </h2>
        </div>

        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-[#171716] border border-[rgba(241,239,234,0.1)]">
            <h3 className="text-sm font-medium text-[#F1EFEA] mb-1">
              Is Security Analyzires really 100% free to enroll?
            </h3>
            <p className="text-xs text-[#98968f] leading-relaxed">
              Yes. All 10 video lectures, interactive lab simulations, quizzes, and verified course completion certificates are completely free for students worldwide.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#171716] border border-[rgba(241,239,234,0.1)]">
            <h3 className="text-sm font-medium text-[#F1EFEA] mb-1">
              How does the email verification workflow work?
            </h3>
            <p className="text-xs text-[#98968f] leading-relaxed">
              Upon registration, a verification link is dispatched to your registered address. Clicking the link authenticates your session and unlocks the student LMS dashboard.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#171716] border border-[rgba(241,239,234,0.1)]">
            <h3 className="text-sm font-medium text-[#F1EFEA] mb-1">
              How does the dual-Gemini AI assistant operate?
            </h3>
            <p className="text-xs text-[#98968f] leading-relaxed">
              You can toggle between Gemini Flash for fast, everyday cybersecurity explanations and Gemini Pro for deep code auditing, reverse engineering, and threat modeling.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-[rgba(241,239,234,0.08)] text-center text-xs text-[#98968f]">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium text-[#F1EFEA]">
            <span className="w-2 h-2 rounded-full bg-[#F1EFEA]" />
            <span>Security Analyzires® Academy</span>
          </div>
          <div>
            Built with modern zero-trust standards · Verified Credentials
          </div>
        </div>
      </footer>

    </div>
  );
};
