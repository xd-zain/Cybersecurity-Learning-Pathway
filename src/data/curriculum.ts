export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface CourseModule {
  id: number;
  title: string;
  slug: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  youtubeId: string;
  summary: string;
  keyConcepts: string[];
  handsOnLab: string;
  quiz: QuizQuestion[];
}

export const COURSE_MODULES: CourseModule[] = [
  {
    id: 1,
    title: "Cyber Fundamentals & The CIA Triad",
    slug: "cyber-fundamentals-cia-triad",
    duration: "24 min",
    level: "Beginner",
    youtubeId: "inWWhr5tnEA", // Cybersecurity full course for beginners
    summary: "Establish a rock-solid foundation in digital security. Understand Confidentiality, Integrity, and Availability (The CIA Triad), threat actor classifications (Script Kiddies, APTs, Insiders), and fundamental attack surfaces.",
    keyConcepts: [
      "Confidentiality vs Integrity vs Availability",
      "Threat Models, Vulnerabilities & Exploits",
      "Authentication vs Authorization vs Accounting (AAA)",
      "Defense-in-Depth Layering Strategy"
    ],
    handsOnLab: "Map the attack surface of a hypothetical e-commerce application and establish an asset classification matrix.",
    quiz: [
      {
        id: "q1_1",
        question: "Which component of the CIA Triad is compromised when a ransomware attack encrypts files, preventing access?",
        options: [
          "Confidentiality",
          "Availability",
          "Integrity",
          "Non-repudiation"
        ],
        correctAnswer: 1,
        explanation: "Availability ensures that authorized parties have timely, reliable access to information assets. Ransomware denies access, directly breaching availability."
      },
      {
        id: "q1_2",
        question: "What is the primary difference between a vulnerability and an exploit?",
        options: [
          "A vulnerability is a weapon, while an exploit is a bug",
          "A vulnerability is a flaw or weakness; an exploit is code or action that takes advantage of it",
          "Vulnerabilities only exist in software, exploits exist in hardware",
          "They are synonymous terms in cybersecurity standards"
        ],
        correctAnswer: 1,
        explanation: "A vulnerability is an inherent flaw, defect, or weakness in a system. An exploit is the specific method or script crafted to take advantage of that vulnerability."
      },
      {
        id: "q1_3",
        question: "Which architectural principle dictates that multiple independent layers of security controls should protect assets?",
        options: [
          "Security through obscurity",
          "Single point of failure",
          "Defense-in-Depth",
          "Air-gapping"
        ],
        correctAnswer: 2,
        explanation: "Defense-in-depth is the strategy of employing multiple layered defenses so that if one security control fails, subsequent layers continue to protect the asset."
      },
      {
        id: "q1_4",
        question: "In the AAA security model, which element verifies who the user claims to be?",
        options: [
          "Authorization",
          "Accounting",
          "Authentication",
          "Audit"
        ],
        correctAnswer: 2,
        explanation: "Authentication proves the identity of an entity (e.g. via password, certificate, or biometric token)."
      }
    ]
  },
  {
    id: 2,
    title: "Computer Networking & Packet Inspection",
    slug: "networking-packet-inspection",
    duration: "32 min",
    level: "Beginner",
    youtubeId: "qiQR5rTSshw", // Network Security basics & Wireshark tutorial
    summary: "Master the OSI 7-layer model, TCP/IP stack, handshake mechanics (SYN, SYN-ACK, ACK), ARP spoofing, DNS poisoning, and real-time packet inspection using Wireshark filters.",
    keyConcepts: [
      "OSI & TCP/IP Model Protocol Mapping",
      "TCP 3-Way Handshake & Flag Analysis",
      "Wireshark Display Filters (ip.addr, tcp.flags, http)",
      "Man-in-the-Middle (MitM) via ARP Spoofing"
    ],
    handsOnLab: "Analyze a sample .pcap packet capture to isolate an unencrypted HTTP Basic Authentication credential leak.",
    quiz: [
      {
        id: "q2_1",
        question: "What is the correct sequence of TCP flags sent during a standard connection establishment?",
        options: [
          "ACK -> SYN -> SYN-ACK",
          "SYN -> SYN-ACK -> ACK",
          "FIN -> ACK -> RST",
          "SYN -> ACK -> SYN-ACK"
        ],
        correctAnswer: 1,
        explanation: "The TCP three-way handshake follows: Client sends SYN, Server replies with SYN-ACK, and Client confirms with ACK."
      },
      {
        id: "q2_2",
        question: "At which layer of the OSI model does an Address Resolution Protocol (ARP) attack operate?",
        options: [
          "Layer 1 - Physical",
          "Layer 2 - Data Link",
          "Layer 4 - Transport",
          "Layer 7 - Application"
        ],
        correctAnswer: 1,
        explanation: "ARP maps IP addresses (Layer 3) to MAC addresses (Layer 2) on local Ethernet segments, operating directly at the Data Link layer."
      },
      {
        id: "q2_3",
        question: "Which Wireshark filter will only display packets sent to or received from IP address 192.168.1.100?",
        options: [
          "filter.ip == 192.168.1.100",
          "ip.addr == 192.168.1.100",
          "host.target: 192.168.1.100",
          "packet.ip = 192.168.1.100"
        ],
        correctAnswer: 1,
        explanation: "'ip.addr == 192.168.1.100' is the standard Wireshark display filter to capture both source and destination traffic for that host."
      },
      {
        id: "q2_4",
        question: "Why is DNS over HTTPS (DoH) or DNS over TLS (DoT) recommended for privacy and security?",
        options: [
          "Standard DNS requests over UDP port 53 are sent in unencrypted plain text",
          "It accelerates packet routing by bypassing local routers",
          "It eliminates the need for authoritative name servers",
          "It prevents IP spoofing at Layer 3"
        ],
        correctAnswer: 0,
        explanation: "Standard DNS requests are sent unencrypted over port 53, making them easily interceptable by network sniffers and susceptible to DNS cache poisoning."
      }
    ]
  },
  {
    id: 3,
    title: "Linux Command Line & OS Hardening",
    slug: "linux-command-line-hardening",
    duration: "28 min",
    level: "Beginner",
    youtubeId: "lZAoFs75_cs", // Linux Security & Bash CLI
    summary: "Deep dive into Linux security administration. Master permissions (chmod, chown, SUID/SGID bits), SSH key hardening, PAM authentication, process audits via htop/ps, and disabling legacy services.",
    keyConcepts: [
      "POSIX Permissions & Octal Notation (755, 644, 4755)",
      "SUID/SGID Vulnerabilities & Privilege Escalation",
      "Hardening /etc/ssh/sshd_config (disabling root login, password auth)",
      "Auditd, Syslog & /var/log/auth.log Inspection"
    ],
    handsOnLab: "Identify misconfigured SUID binaries on a hardened Linux filesystem and remediate open permissions.",
    quiz: [
      {
        id: "q3_1",
        question: "What danger does an executable binary with an active SUID bit set by root present?",
        options: [
          "It slows down system boot times",
          "Any non-root user running the binary executes it with the effective privileges of root",
          "It automatically broadcasts traffic to the internet",
          "It permanently disables firewall rules"
        ],
        correctAnswer: 1,
        explanation: "SetUID (SUID) allows users to run an executable with the file owner's permissions (if owned by root, it executes with root privileges)."
      },
      {
        id: "q3_2",
        question: "Which directive in /etc/ssh/sshd_config prevents direct brute-forcing of the administrative account?",
        options: [
          "DisableAdmin Yes",
          "PermitRootLogin no",
          "BlockRootUser 1",
          "AllowOnlyUsers admin"
        ],
        correctAnswer: 1,
        explanation: "'PermitRootLogin no' ensures remote attackers cannot log in directly as root, requiring attackers to compromise an unprivileged account first."
      },
      {
        id: "q3_3",
        question: "What command finds all files with SUID bit set starting from the root directory?",
        options: [
          "find / -perm -u=s -type f 2>/dev/null",
          "ls -la / --suid",
          "grep -r 'SUID' /bin",
          "chmod -R 4000 /"
        ],
        correctAnswer: 0,
        explanation: "'find / -perm -u=s -type f 2>/dev/null' searches the entire filesystem for files with the user SUID permission bit set while suppressing permission errors."
      },
      {
        id: "q3_4",
        question: "What octal permission mode gives Read+Write to owner, and Read-Only to group and others?",
        options: [
          "755",
          "644",
          "700",
          "600"
        ],
        correctAnswer: 1,
        explanation: "6 (Read=4 + Write=2), 4 (Read=4), 4 (Read=4) equals 644."
      }
    ]
  },
  {
    id: 4,
    title: "Cryptography, Hashing & Public Key Infrastructure (PKI)",
    slug: "cryptography-pki-hashing",
    duration: "35 min",
    level: "Intermediate",
    youtubeId: "jhXCTbFnK8o", // Cryptography fundamentals
    summary: "Demystify modern cryptography: Symmetric encryption (AES-GCM), Asymmetric cryptography (RSA, ECC), Cryptographic hashing (SHA-256, Argon2, bcrypt), Salt & Pepper, Digital Signatures, and TLS 1.3 certificate chains.",
    keyConcepts: [
      "Symmetric vs Asymmetric Cipher Mechanics",
      "Hashing vs Encryption vs Encoding",
      "Diffie-Hellman Key Exchange (Elliptic Curve DH)",
      "Certificate Authorities (CA), CRL, and OCSP Stapling"
    ],
    handsOnLab: "Generate an RSA 4096-bit key pair, create a self-signed X.509 certificate, and encrypt/decrypt confidential payload using openssl.",
    quiz: [
      {
        id: "q4_1",
        question: "Which of the following is a one-way mathematical function that cannot be decrypted back to plaintext?",
        options: [
          "AES-256",
          "RSA-4096",
          "SHA-256",
          "Base64"
        ],
        correctAnswer: 2,
        explanation: "Cryptographic hash functions like SHA-256 are deterministic one-way algorithms; they cannot be reversed or decrypted back into the original plaintext."
      },
      {
        id: "q4_2",
        question: "Why should passwords never be hashed with plain SHA-256 or MD5?",
        options: [
          "SHA-256 produces variable length output",
          "Fast general-purpose hashes can be brute-forced at billions of guesses/sec with GPUs; slow KDFs like Argon2 or bcrypt are required",
          "SHA-256 is an asymmetric algorithm",
          "Plain hashes are easily reversible by math factoring"
        ],
        correctAnswer: 1,
        explanation: "Modern GPUs can compute billions of SHA-256 hashes per second. Password storage requires memory-hard and computationally slow algorithms like Argon2id or bcrypt."
      },
      {
        id: "q4_3",
        question: "In public-key asymmetric cryptography, which key is used to create a digital signature?",
        options: [
          "The sender's public key",
          "The sender's private key",
          "The recipient's public key",
          "The CA's public key"
        ],
        correctAnswer: 1,
        explanation: "A digital signature is created by encrypting the document's hash with the sender's private key. Anyone with the corresponding public key can verify authenticity."
      },
      {
        id: "q4_4",
        question: "What is the primary benefit of Perfect Forward Secrecy (PFS) in TLS 1.3?",
        options: [
          "It permanently disables certificate renewal",
          "Compromise of the server's long-term private key does not compromise past session keys or recorded traffic",
          "It compresses HTTP headers automatically",
          "It allows passwords to be transmitted without hashing"
        ],
        correctAnswer: 1,
        explanation: "PFS generates unique ephemeral session keys for every communication; even if the server private key is stolen later, past recorded sessions cannot be decrypted."
      }
    ]
  },
  {
    id: 5,
    title: "Web Application Security & OWASP Top 10",
    slug: "web-app-security-owasp-top-10",
    duration: "38 min",
    level: "Intermediate",
    youtubeId: "2_lswM1S264", // OWASP Top 10 web vulnerabilities
    summary: "Explore the most critical web security flaws. Detailed dissection of SQL Injection (SQLi), Cross-Site Scripting (Stored, Reflected, DOM XSS), Broken Access Control, CSRF, SSRF, and secure header configurations.",
    keyConcepts: [
      "SQL Injection (SQLi) & Parameterized Queries",
      "Cross-Site Scripting (XSS) & Content Security Policy (CSP)",
      "Cross-Site Request Forgery (CSRF) & SameSite Cookies",
      "Server-Side Request Forgery (SSRF) in Cloud Deployments"
    ],
    handsOnLab: "Execute parameterized query remediation on vulnerable vulnerable Node.js/Python endpoint code.",
    quiz: [
      {
        id: "q5_1",
        question: "What is the most effective primary defense against SQL Injection attacks?",
        options: [
          "Regular expression blacklisting of characters",
          "Parameterized queries (Prepared Statements)",
          "Encoding database inputs in Base64",
          "Using HTTP POST instead of GET"
        ],
        correctAnswer: 1,
        explanation: "Parameterized queries ensure user input is treated strictly as data literals and never compiled or interpreted as executable SQL syntax."
      },
      {
        id: "q5_2",
        question: "An attacker injects a malicious script that is permanently stored inside a public forum database. What type of attack is this?",
        options: [
          "Reflected XSS",
          "Stored (Persistent) XSS",
          "DOM-based XSS",
          "SQL Smuggling"
        ],
        correctAnswer: 1,
        explanation: "Stored XSS occurs when malicious input is saved in the database and subsequently served to multiple unsuspecting visitors without proper sanitization."
      },
      {
        id: "q5_3",
        question: "Which HTTP cookie flag prevents client-side JavaScript from accessing session tokens, mitigating XSS token theft?",
        options: [
          "Secure",
          "HttpOnly",
          "SameSite=Strict",
          "Domain=Secure"
        ],
        correctAnswer: 1,
        explanation: "The 'HttpOnly' flag instructs the browser that the cookie must not be exposed through document.cookie, thwarting cookie extraction via XSS."
      },
      {
        id: "q5_4",
        question: "What occurs during a Server-Side Request Forgery (SSRF) exploit against an AWS EC2 instance?",
        options: [
          "The client browser is crashed by infinite loops",
          "The attacker forces the server to query internal endpoints (e.g. 169.254.169.254) to leak cloud metadata credentials",
          "The DNS server is flooded with UDP requests",
          "The SSL certificate is replaced with a rogue certificate"
        ],
        correctAnswer: 1,
        explanation: "SSRF tricks the vulnerable server into sending requests to internal-only endpoints like AWS IMDS (169.254.169.254) to exfiltrate IAM role credentials."
      }
    ]
  },
  {
    id: 6,
    title: "Network Defense, Firewalls & IDS/IPS",
    slug: "network-defense-firewalls-ids-ips",
    duration: "30 min",
    level: "Intermediate",
    youtubeId: "kL_gC23jGoc", // Firewalls, IDS, and IPS
    summary: "Architect perimeter and internal defenses. Understand Stateless vs Stateful packet inspection, Next-Gen Firewalls (NGFW), Snort/Suricata rule syntax, Signature vs Anomaly-based intrusion detection, and DMZ network topology.",
    keyConcepts: [
      "Stateful Inspection vs Deep Packet Inspection (DPI)",
      "IDS (Detection/Alerting) vs IPS (Inline Prevention)",
      "Snort Rule Anatomy (alert tcp any any -> $HOME_NET 80)",
      "Demilitarized Zones (DMZ) & Microsegmentation"
    ],
    handsOnLab: "Write a Snort detection rule to identify aggressive port scanning attempts and test it against a mock pcap.",
    quiz: [
      {
        id: "q6_1",
        question: "What is the critical operational difference between an IDS and an IPS?",
        options: [
          "An IDS operates at Layer 7; an IPS operates at Layer 2",
          "An IDS passively monitors and alerts; an IPS sits inline and actively drops malicious packets",
          "An IDS uses hardware; an IPS is only software",
          "An IDS requires cryptographic keys; an IPS does not"
        ],
        correctAnswer: 1,
        explanation: "Intrusion Detection Systems (IDS) detect and notify without interrupting traffic. Intrusion Prevention Systems (IPS) sit inline in the packet flow and actively block threats."
      },
      {
        id: "q6_2",
        question: "Why is a Stateful Firewall superior to a Stateless Packet Filter?",
        options: [
          "It uses faster hardware chips",
          "It tracks established TCP connections and only allows inbound replies to authorized outbound requests",
          "It encrypts all passing network traffic",
          "It eliminates the need for IP addressing"
        ],
        correctAnswer: 1,
        explanation: "Stateful firewalls maintain a connection table, automatically permitting return traffic that matches an established outbound session."
      },
      {
        id: "q6_3",
        question: "Where should public-facing web servers be placed within an enterprise network architecture?",
        options: [
          "Directly inside the internal database VLAN",
          "In a Demilitarized Zone (DMZ) separated by dual firewalls",
          "Directly connected to the public Internet without NAT",
          "On the Active Directory Domain Controller subnet"
        ],
        correctAnswer: 1,
        explanation: "A DMZ isolates public-facing servers from internal core subnets; if a public server is compromised, the attacker cannot pivot directly to internal servers."
      },
      {
        id: "q6_4",
        question: "In a Snort rule, what does the keyword 'msg' specify?",
        options: [
          "The destination email address for alerts",
          "The text message printed in the log or alert console when rule matches",
          "The protocol name",
          "The payload encryption algorithm"
        ],
        correctAnswer: 1,
        explanation: "The 'msg' option defines the human-readable description displayed in the alerts log when the rule criteria match."
      }
    ]
  },
  {
    id: 7,
    title: "Vulnerability Assessment & Ethical Penetration Testing",
    slug: "vulnerability-assessment-pentesting",
    duration: "34 min",
    level: "Intermediate",
    youtubeId: "WnN6dbosJJA", // Penetration testing methodology
    summary: "Step through the ethical hacking lifecycle. Reconnaissance (OSINT, Nmap), Vulnerability Scanning (Nessus, OpenVAS), Exploitation Frameworks (Metasploit), CVSS v3.1 scoring formulas, and responsible disclosure reporting.",
    keyConcepts: [
      "Ethical Hacking Stages: Recon -> Scan -> Exploit -> Post-Exploit -> Report",
      "Nmap Scan Types (-sS SYN Stealth, -sV Version Detection, -sC Default Scripts)",
      "CVSS v3.1 Metrics (Attack Vector, Complexity, Privileges Required, Impact)",
      "Rules of Engagement (ROE) & Legal Authorization"
    ],
    handsOnLab: "Execute a non-intrusive Nmap service enumeration against a sandbox server and calculate CVSS base scores for detected exposures.",
    quiz: [
      {
        id: "q7_1",
        question: "Why is an Nmap TCP SYN scan (-sS) often called a 'stealth scan'?",
        options: [
          "It hides the sender's real IP address completely",
          "It sends an encrypted packet payload",
          "It sends a RST before completing the 3-way handshake, avoiding socket connection logging on legacy services",
          "It only scans port 443"
        ],
        correctAnswer: 2,
        explanation: "An Nmap SYN scan tears down the connection with a RST immediately after receiving SYN-ACK, leaving the handshake incomplete."
      },
      {
        id: "q7_2",
        question: "What legal document must always be finalized before commencing any penetration test against an organization?",
        options: [
          "ISO 27001 Certificate",
          "Rules of Engagement (ROE) & Signed Scope Agreement",
          "Software License Agreement",
          "GitHub Pull Request"
        ],
        correctAnswer: 1,
        explanation: "Performing security testing without explicit, written authorization and defined Rules of Engagement (ROE) constitutes illegal unauthorized computer access."
      },
      {
        id: "q7_3",
        question: "What CVSS v3.1 score range indicates a 'Critical' severity vulnerability?",
        options: [
          "7.0 - 8.9",
          "9.0 - 10.0",
          "4.0 - 6.9",
          "10.0 only"
        ],
        correctAnswer: 1,
        explanation: "Under the Common Vulnerability Scoring System (CVSS v3.1), scores from 9.0 to 10.0 represent Critical severity."
      },
      {
        id: "q7_4",
        question: "Which Nmap argument executes safe default vulnerability detection scripts?",
        options: [
          "-sC",
          "-O",
          "-Pn",
          "-T4"
        ],
        correctAnswer: 0,
        explanation: "'-sC' instructs Nmap to run the default set of NSE (Nmap Scripting Engine) scripts."
      }
    ]
  },
  {
    id: 8,
    title: "Threat Intelligence, SOC Operations & SIEM",
    slug: "threat-intelligence-soc-siem",
    duration: "30 min",
    level: "Advanced",
    youtubeId: "2bWjV6U2gY8", // SOC Analyst & SIEM tutorial
    summary: "Step inside a modern Security Operations Center. Master Security Information and Event Management (SIEM), MITRE ATT&CK framework mapping, Indicators of Compromise (IoCs), and threat hunting methodologies.",
    keyConcepts: [
      "SIEM Log Aggregation, Normalization & Correlation Rules",
      "MITRE ATT&CK Matrix TTPs (Tactics, Techniques, Procedures)",
      "Indicators of Compromise (IoCs: Hashes, IPs, Domains, Mutexes)",
      "The Pyramid of Pain (David Bianco)"
    ],
    handsOnLab: "Investigate a simulated SIEM alert correlating multiple failed Kerberos logons with lateral movement attempts.",
    quiz: [
      {
        id: "q8_1",
        question: "According to the Pyramid of Pain, which indicator of compromise is hardest for an adversary to alter?",
        options: [
          "Hash Values",
          "IP Addresses",
          "Domain Names",
          "Tactics, Techniques, and Procedures (TTPs)"
        ],
        correctAnswer: 3,
        explanation: "Changing TTPs requires retraining operators, rewriting attack toolchains, and altering fundamental behavior—making it the most painful tier for adversaries."
      },
      {
        id: "q8_2",
        question: "What is the primary role of a SIEM system in a Security Operations Center?",
        options: [
          "To host web applications securely",
          "To centrally collect, normalize, aggregate, and correlate logs across disparate network devices and detect anomalies",
          "To automatically patch operating system kernel bugs",
          "To generate SSL certificates for enterprise domains"
        ],
        correctAnswer: 1,
        explanation: "A SIEM ingests diverse log streams, converts them into standard formats, and triggers alerts based on correlation rules and threat feeds."
      },
      {
        id: "q8_3",
        question: "What is the MITRE ATT&CK framework primarily used for?",
        options: [
          "Encrypting database connections",
          "A comprehensive, open knowledge base of real-world adversary tactics and techniques used for threat mapping",
          "Writing firewall packet filters",
          "Calculating employee productivity scores"
        ],
        correctAnswer: 1,
        explanation: "MITRE ATT&CK documents documented adversary behavior across distinct kill-chain stages (Initial Access, Persistence, Privilege Escalation, Lateral Movement, etc.)."
      },
      {
        id: "q8_4",
        question: "Which of the following is considered an Indicator of Compromise (IoC)?",
        options: [
          "A SHA-256 hash of a known malicious dropper executable",
          "The company mission statement",
          "The CPU clock speed of a server",
          "A valid TLS certificate expiry date"
        ],
        correctAnswer: 0,
        explanation: "Known malicious file hashes, command-and-control IP addresses, and rogue domain names are standard technical Indicators of Compromise (IoCs)."
      }
    ]
  },
  {
    id: 9,
    title: "Incident Response, Digital Forensics & Malware Analysis",
    slug: "incident-response-digital-forensics",
    duration: "36 min",
    level: "Advanced",
    youtubeId: "WnN6dbosJJA", // Forensics & Incident Response
    summary: "Handle live active security breaches. Master the NIST SP 800-61 lifecycle (Preparation, Detection, Containment, Eradication, Recovery, Lessons Learned), RAM volatility preservation, and basic static/dynamic malware triage.",
    keyConcepts: [
      "NIST Incident Response Phases & Chain of Custody",
      "Order of Volatility (Registers/Cache -> RAM -> Disk -> Backup)",
      "Static Analysis (Strings, PE headers, VirusTotal) vs Dynamic Sandbox Triage",
      "Containment Strategies (Network Isolation vs Host Shutdown)"
    ],
    handsOnLab: "Extract artifact strings from an unknown binary and reconstruct timeline of events from compromised machine memory dump.",
    quiz: [
      {
        id: "q9_1",
        question: "In digital forensic evidence collection, what must be captured FIRST according to the Order of Volatility?",
        options: [
          "Hard drive optical media",
          "CPU registers and CPU cache, followed by RAM (system memory)",
          "Archival backup tapes",
          "Network cables"
        ],
        correctAnswer: 1,
        explanation: "Registers, cache, and RAM are volatile: power interruption or system shutdown destroys this state forever. They must be acquired before non-volatile disk media."
      },
      {
        id: "q9_2",
        question: "Why is 'Chain of Custody' critical when handling digital forensic evidence?",
        options: [
          "It speeds up file decompression",
          "It documents everyone who accessed or handled evidence, ensuring integrity and legal admissibility in court",
          "It decrypts password protected drives",
          "It removes malware automatically"
        ],
        correctAnswer: 1,
        explanation: "Chain of custody proves that evidence was preserved, uncorrupted, and accounted for from seizure to courtroom presentation."
      },
      {
        id: "q9_3",
        question: "What is the key difference between static and dynamic malware analysis?",
        options: [
          "Static analyzes code without executing it; dynamic observes behavior while safely executing it in an isolated sandbox",
          "Static is only for Android; dynamic is for Windows",
          "Static requires an internet connection; dynamic does not",
          "There is no difference"
        ],
        correctAnswer: 0,
        explanation: "Static analysis examines file properties, hashes, strings, and disassembly without running the malware. Dynamic analysis executes the binary in an instrumented sandbox."
      },
      {
        id: "q9_4",
        question: "In the NIST SP 800-61 Incident Response framework, which phase immediately follows Containment?",
        options: [
          "Preparation",
          "Lessons Learned",
          "Eradication",
          "Identification"
        ],
        correctAnswer: 2,
        explanation: "The lifecycle proceeds: Preparation -> Detection & Analysis -> Containment -> Eradication -> Recovery -> Post-Incident Activity (Lessons Learned)."
      }
    ]
  },
  {
    id: 10,
    title: "Cloud Security Architecture & DevSecOps",
    slug: "cloud-security-devsecops",
    duration: "40 min",
    level: "Advanced",
    youtubeId: "tV13C6d8jY4", // Cloud Security & DevSecOps
    summary: "Secure the modern cloud frontier. Cloud Shared Responsibility Model (IaaS vs PaaS vs SaaS), IAM least-privilege policies, Kubernetes container hardening, CI/CD automated security gates (SAST/DAST/SCA), and Infrastructure-as-Code scanning.",
    keyConcepts: [
      "Shared Responsibility Model across Cloud Providers",
      "Identity and Access Management (IAM) Least Privilege",
      "Container Security & Dockerfile Non-Root Hardening",
      "DevSecOps Pipeline: SAST (SonarQube), DAST (OWASP ZAP), SCA (Trivy, Snyk)"
    ],
    handsOnLab: "Audit a Terraform configuration file for exposed S3 buckets, open security groups (0.0.0.0/0), and hardcoded secrets.",
    quiz: [
      {
        id: "q10_1",
        question: "Under the Cloud Shared Responsibility Model for Infrastructure-as-a-Service (IaaS), who is responsible for operating system patching?",
        options: [
          "The Cloud Provider (e.g. AWS/GCP/Azure) exclusively",
          "The Customer",
          "The Internet Service Provider",
          "The hardware manufacturer"
        ],
        correctAnswer: 1,
        explanation: "In IaaS, the cloud provider manages physical hardware, hypervisors, and data centers. The customer is strictly responsible for guest OS patching, networking, and data."
      },
      {
        id: "q10_2",
        question: "What security tool type examines source code repositories without running the application to uncover vulnerabilities?",
        options: [
          "DAST (Dynamic Application Security Testing)",
          "SAST (Static Application Security Testing)",
          "WAF (Web Application Firewall)",
          "EDR (Endpoint Detection and Response)"
        ],
        correctAnswer: 1,
        explanation: "SAST tools scan raw source code or bytecode for insecure patterns, hardcoded secrets, and logic flaws prior to deployment."
      },
      {
        id: "q10_3",
        question: "Which Dockerfile practice adheres to container security best practices?",
        options: [
          "Always running container entrypoints as the default 'root' user",
          "Creating a dedicated unprivileged user and switching with 'USER appuser'",
          "Embedding SSH private keys directly in image layers",
          "Exposing all port ranges from 1 to 65535"
        ],
        correctAnswer: 1,
        explanation: "Running containers as non-root mitigates container breakout attacks by ensuring an attacker who escapes a process has minimal host permissions."
      },
      {
        id: "q10_4",
        question: "What is the core philosophy of 'Shift-Left' in DevSecOps?",
        options: [
          "Only conducting security testing right before production release",
          "Integrating security controls, automated testing, and compliance scans as early as possible in the development lifecycle",
          "Shifting all computing from cloud back to on-premise",
          "Moving development teams to physical left wings of corporate offices"
        ],
        correctAnswer: 1,
        explanation: "'Shift-Left' embeds security practices during design, coding, and CI/CD stages so vulnerabilities are resolved before software ever reaches production."
      }
    ]
  }
];
