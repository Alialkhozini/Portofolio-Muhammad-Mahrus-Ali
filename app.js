/**
 * Windows XP Developer Portfolio Clone
 * Target: https://alialkhozini.my.id/
 */

const { useState, useEffect, useRef, createElement: h, Fragment } = React;

const WALLPAPER_URL = './assets/wallpaper.jpg';

// --- Mobile Detection Helper ---
function isMobile() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768 || ('ontouchstart' in window);
}

// --- Sound Synthesizer & Audio Manager ---
class SoundManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.volume = 0.8;
    this.pendingStartupSound = false;
    this.bootAudio = null;
  }

  getAudioContext() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => { });
    }
    return this.ctx;
  }

  unlockAudio() {
    const ctx = this.getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => { });
    }
    if (this.pendingStartupSound) {
      this.pendingStartupSound = false;
      const audio = this.getBootAudio();
      if (audio) {
        audio.src = './boot-sound.mp3';
        audio.volume = this.volume;
        audio.play().catch(() => { });
      }
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
  }

  getMuted() {
    return this.isMuted;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  getVolume() {
    return this.volume;
  }

  getBootAudio() {
    if (typeof window === 'undefined') return null;
    if (!this.bootAudio) {
      this.bootAudio = new Audio('./boot-sound.mp3');
    }
    return this.bootAudio;
  }

  playStartupSound() {
    if (this.isMuted) return;
    this.pendingStartupSound = false;
    const audio = this.getBootAudio();
    if (audio) {
      audio.src = './boot-sound.mp3';
      audio.volume = this.volume;
      audio.play().catch(() => {
        this.pendingStartupSound = true;
      });
    }
  }

  playOpenSound() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    this.unlockAudio();
    const t = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(540, t);
    osc1.frequency.exponentialRampToValueAtTime(880, t + 0.08);
    gain1.gain.setValueAtTime(0.001, t);
    gain1.gain.linearRampToValueAtTime(this.volume * 0.35, t + 0.015);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.13);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1200, t + 0.02);
    osc2.frequency.exponentialRampToValueAtTime(600, t + 0.07);
    gain2.gain.setValueAtTime(0.001, t + 0.02);
    gain2.gain.linearRampToValueAtTime(this.volume * 0.15, t + 0.025);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(t + 0.02);
    osc2.stop(t + 0.09);
  }

  playCloseSound() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    this.unlockAudio();
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(620, t);
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.07);
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(this.volume * 0.35, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.11);
  }

  playMinimizeSound() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    this.unlockAudio();
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(740, t);
    osc.frequency.exponentialRampToValueAtTime(260, t + 0.14);
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(this.volume * 0.28, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.16);
  }

  playMaximizeSound() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    this.unlockAudio();
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.12);
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(this.volume * 0.28, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.13);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.14);
  }

  playNotificationSound() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    this.unlockAudio();
    const t = ctx.currentTime;

    [
      { freq: 1046.5, time: 0, dur: 0.25 },
      { freq: 1318.5, time: 0.1, dur: 0.4 }
    ].forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + time);
      gain.gain.setValueAtTime(0.001, t + time);
      gain.gain.linearRampToValueAtTime(this.volume * 0.3, t + time + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + time + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t + time);
      osc.stop(t + time + dur);
    });
  }

  playDingSound() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    this.unlockAudio();
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, t);
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(this.volume * 0.35, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.36);
  }
}

const soundManager = new SoundManager();

// --- Projects Data ---
const PROJECTS_DATA = [
  {
    id: 'automasiku',
    title: 'Automasiku - AI-Powered Website Builder',
    subtitle: 'SaaS Platform • automasiku.com',
    description: 'Multi-product SaaS platform providing digital solutions for UMKM and developers, with shared infrastructure for authentication, billing, and platform services. The flagship product is an AI-powered website builder that generates full-stack web applications — from landing pages to interactive dashboards — based on natural language prompts, with Google Apps Script integration.',
    icon: 'fa-solid fa-robot',
    iconBg: 'bg-indigo-600',
    liveDemoUrl: 'https://automasiku.com',
    tags: ['Node.js', 'Next.js', 'Supabase', 'PostgreSQL', 'Midtrans']
  },
  {
    id: 'toko-online',
    title: 'Toko Online - E-Commerce Platform',
    subtitle: 'UMKM Product • automasiku.com/toko-online',
    description: 'Template-based e-commerce platform with product management, Flash Sale, vouchers, multiple payment methods, RajaOngkir integration, and customer purchase tracking.',
    icon: 'fa-solid fa-store',
    iconBg: 'bg-amber-600',
    liveDemoUrl: 'https://automasiku.com/toko-online',
    tags: ['Node.js', 'Next.js', 'Supabase', 'Midtrans', 'RajaOngkir']
  },
  {
    id: 'qris-dinamis',
    title: 'QRIS Dinamis - Dynamic Payment Gateway',
    subtitle: 'UMKM Product • automasiku.com/qris-dinamis',
    description: 'Converts static QRIS codes into dynamic QRIS payments with real-time amount and merchant data, reducing fraud and settlement risk for UMKM merchants.',
    icon: 'fa-solid fa-qrcode',
    iconBg: 'bg-emerald-600',
    liveDemoUrl: 'https://automasiku.com/qris-dinamis',
    tags: ['Node.js', 'PostgreSQL', 'Midtrans']
  },
  {
    id: 'lingmomen',
    title: 'LingMomen - Digital Invitation Platform',
    subtitle: 'UMKM Product • automasiku.com/undangan',
    description: 'Template-based digital invitation platform with customizable content and mobile-friendly designs.',
    icon: 'fa-solid fa-envelope-open-text',
    iconBg: 'bg-pink-600',
    liveDemoUrl: 'https://automasiku.com/undangan',
    tags: ['Next.js', 'Supabase']
  },
  {
    id: 'armadaku',
    title: 'ArmadaKu — Car Rental Management',
    subtitle: 'UMKM Product • armadaku.automasiku.com',
    description: 'Offline-first desktop app (Windows & macOS) for running a car rental business: bookings, fleet, payments, and automatic backups — no subscription, one-time payment.',
    icon: 'fa-solid fa-car-side',
    iconBg: 'bg-pink-600',
    liveDemoUrl: 'https://armadaku.automasiku.com',
    tags: ['React', 'Vite', 'SQLite', 'Tauri']
  },
  {
    id: 'ai-router',
    title: 'Automasiku Router - AI API Platform',
    subtitle: 'Developer Product • OpenAI-Compatible',
    description: 'AI API platform providing access to multiple AI models through a single OpenAI-compatible API, with multiple API keys, SSE streaming support, usage tracking, and independent billing.',
    icon: 'fa-solid fa-network-wired',
    iconBg: 'bg-purple-600',
    tags: ['Node.js', 'Elysiajs', 'Bun', 'SSE', 'PostgreSQL']
  }
];

// --- Developer Bio Text ---
const BIO_TEXT = `=====================================================
  DEVELOPER BIO: BACKEND / FULLSTACK JAVASCRIPT DEV
 =====================================================

Hi, I'm Muhammad Mahrus Ali — a Backend / Full-Stack
Developer specializing in building production-grade SaaS
systems and multi-product platforms with Node.js and Next.js.

* Core Focus:
  - REST API development (Node.js, Express.js, Restify, Elysiajs, Bun)
  - Multi-product SaaS architecture (auth, billing, shared infra)
  - Third-party integrations, payment systems & business logic
  - Google OAuth, role-based access control, microservices

* Work History:
  - Backend Developer @ SL2 Indonesia (Apr 2025 – May 2025)
    Built REST APIs for a Google Classroom Add-on, SharePoint
    integration, Google OAuth + role-based access (Teacher/Student).
  - Backend Developer @ Pijar Belajar (May 2023 – Sep 2024)
    Developed Flash Sale, leaderboard, Telkomsel integration,
    SPP payment APIs and core platform services within a Node.js
    microservices architecture (Restify).

* Current Venture:
  - Building & operating automasiku — a multi-product SaaS
    platform serving UMKM and developers with AI-powered tools.

* Education:
  - Bachelor of Software Engineering, Telkom University Purwokerto
  - Mathematics and Natural Sciences, SMAN 1 Kedungwuni (2020)

Feel free to ping me via "Contact & Socials" or type 'help' in the Terminal!
`;

// --- 1. Boot Screen Component ---
function BootScreen({ isVisible, onDismiss }) {
  if (!isVisible) return null;

  return h('div', {
    id: 'boot-screen',
    className: 'fixed inset-0 z-50 bg-black flex flex-col justify-between items-center py-14 select-none transition-opacity duration-500 cursor-pointer',
    onClick: onDismiss
  }, [
    h('div', { key: 'content', className: 'flex-1 flex flex-col justify-center items-center' }, [
      h('div', { key: 'logo-area', className: 'flex items-center space-x-3 mb-6' }, [
        h('div', { key: 'logo-grid', className: 'grid grid-cols-2 gap-1.5 w-16 h-16 transform -rotate-12' }, [
          h('div', { key: 'r', className: 'bg-[#e03d15] rounded-tl-lg shadow-md' }),
          h('div', { key: 'g', className: 'bg-[#58a825] rounded-tr-lg shadow-md' }),
          h('div', { key: 'b', className: 'bg-[#0074e8] rounded-bl-lg shadow-md' }),
          h('div', { key: 'y', className: 'bg-[#ffba00] rounded-br-lg shadow-md' })
        ]),
        h('div', { key: 'text-area', className: 'text-white text-left pl-2' }, [
          h('div', { key: 'sub', className: 'text-xs font-sans tracking-widest text-gray-300' }, [
            'fullstack',
            h('sup', { key: 'sup', className: 'text-[9px]' }, 'Developer')
          ]),
          h('div', { key: 'title', className: 'text-3xl font-bold tracking-tight -mt-1 flex items-baseline' }, [
            h('span', { key: 'name' }, 'ali'),
            h('span', { key: 'xp', className: 'text-orange-500 text-xl font-black italic ml-1.5' }, 'XP')
          ]),
          h('div', { key: 'edition', className: 'text-[11px] text-gray-400 font-semibold tracking-wider' }, 'Developer Portfolio Edition')
        ])
      ]),
      h('div', { key: 'progress-area', className: 'mt-6 flex flex-col items-center' }, [
        h('div', { key: 'p-box', className: 'xp-progress-box' }, [
          h('div', { key: 'p-group', className: 'xp-progress-block-group' }, [
            h('div', { key: 'b1', className: 'xp-progress-block' }),
            h('div', { key: 'b2', className: 'xp-progress-block' }),
            h('div', { key: 'b3', className: 'xp-progress-block' })
          ])
        ]),
        h('p', { key: 'msg', className: 'text-gray-300 text-xs mt-4 tracking-wide flex items-center gap-2' }, [
          h('i', { key: 'icon', className: 'fa-solid fa-code text-blue-400' }),
          ' Initializing Developer Environment...'
        ])
      ])
    ])
  ]);
}

// --- 2. Logon Screen Component ---
function LogonScreen({ isVisible, onLogin }) {
  if (!isVisible) return null;

  const mobile = isMobile();

  return h('div', {
    className: 'fixed inset-0 z-50 overflow-hidden flex flex-col justify-between bg-[#001768] text-white font-tahoma select-none'
  }, [
    h('header', { key: 'header', className: `${mobile ? 'h-10' : 'h-[74px]'} w-full bg-[#001a7c] flex-shrink-0 relative` }, [
      h('div', { key: 'line', className: 'absolute bottom-0 left-0 right-0 xp-divider-horizontal' })
    ]),
    h('main', { key: 'main', className: 'flex-grow w-full xp-logon-canvas relative flex items-center justify-center' }, [
      h('div', { className: `w-full h-full max-w-6xl mx-auto flex ${mobile ? 'flex-col' : ''} items-center relative px-6 md:px-12` }, [
        h('div', { key: 'welcome', className: `${mobile ? 'w-full pt-8 pb-4 flex items-center justify-center' : 'w-1/2 h-full flex items-center justify-end pr-10 md:pr-16'}` }, [
          h('h1', { className: `xp-welcome-text ${mobile ? 'text-3xl' : 'text-5xl md:text-[62px] lg:text-[70px]'} select-none tracking-tight` }, 'welcome')
        ]),
        !mobile && h('div', { key: 'divider', className: 'xp-center-divider flex-shrink-0' }),
        h('div', { key: 'user-container', className: `${mobile ? 'w-full flex flex-col items-center' : 'w-1/2 h-full flex flex-col justify-center pl-10 md:pl-16'}` }, [
          h('div', { className: `flex flex-col ${mobile ? 'items-center' : 'items-start'} max-w-sm` }, [
            h('div', {
              className: 'xp-user-item active p-2.5 -ml-2.5 flex items-center gap-4 cursor-pointer group rounded',
              onClick: onLogin,
              title: 'Click to log on'
            }, [
              h('div', { key: 'avatar', className: 'xp-avatar-box w-[54px] h-[54px] rounded-[3px] overflow-hidden flex-shrink-0 bg-[#5b4f8d] flex items-center justify-center relative shadow-sm' }, [
                h('svg', { className: 'w-full h-full', fill: 'none', viewBox: '0 0 48 48' }, [
                  h('rect', { key: 'bg', fill: '#4d4480', width: '48', height: '48' }),
                  h('path', { key: 'p1', d: 'M14 48 L14 26 C14 22 20 20 24 20 C28 20 34 22 34 26 L34 48 Z', fill: '#756bb0' }),
                  h('circle', { key: 'c1', cx: '24', cy: '14', r: '7', fill: '#8e82cf' }),
                  h('path', { key: 'p2', d: 'M6 48 L6 34 C6 30 11 28 15 28 L15 48 Z', fill: '#60549c' }),
                  h('circle', { key: 'c2', cx: '15', cy: '22', r: '5', fill: '#756bb0' }),
                  h('path', { key: 'p3', d: 'M42 48 L42 34 C42 30 37 28 33 28 L33 48 Z', fill: '#60549c' }),
                  h('circle', { key: 'c3', cx: '33', cy: '22', r: '5', fill: '#756bb0' }),
                  h('rect', { key: 'gloss', fill: 'url(#gloss)', x: '0', y: '0', width: '48', height: '48', opacity: '0.3' }),
                  h('defs', { key: 'defs' }, [
                    h('linearGradient', { id: 'gloss', x1: '0', x2: '0', y1: '0', y2: '1' }, [
                      h('stop', { key: 's1', offset: '0%', stopColor: '#ffffff' }),
                      h('stop', { key: 's2', offset: '100%', stopColor: 'transparent' })
                    ])
                  ])
                ])
              ]),
              h('div', { key: 'info', className: 'flex flex-col' }, [
                h('span', { key: 'u-name', className: 'text-white text-base md:text-lg font-normal tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] font-tahoma group-hover:underline' }, 'Ali'),
                h('span', { key: 'u-hint', className: 'text-xs text-gray-300 drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]' }, 'Click to log on')
              ])
            ])
          ])
        ])
      ])
    ]),
    h('footer', { key: 'footer', className: 'h-[74px] w-full bg-[#001768] flex-shrink-0 relative flex items-center justify-center' }, [
      h('div', { className: 'absolute top-0 left-0 right-0 xp-divider-horizontal' })
    ])
  ]);
}

// --- 3. Desktop Icons Component ---
function DesktopIcons({ selectedIcon, onSelectIcon, onOpenWindow }) {
  const icons = [
    {
      id: 'projects',
      label: 'My Projects',
      windowId: 'projects',
      iconSrc: './assets/icons/projects.png'
    },
    {
      id: 'about_me',
      label: 'about_me.txt',
      windowId: 'notepad',
      iconSrc: './assets/icons/notepad.png'
    },
    {
      id: 'terminal',
      label: 'Terminal',
      windowId: 'terminal',
      iconSrc: './assets/icons/terminal.png'
    },
    {
      id: 'skills',
      label: 'Tech Stack & Skills',
      windowId: 'skills',
      iconSrc: './assets/icons/computer.png'
    },
    {
      id: 'contact',
      label: 'Contact & Socials',
      windowId: 'contact',
      iconSrc: './assets/icons/contact.png'
    },
    {
      id: 'recycle',
      label: 'Recycle Bin',
      windowId: 'recycle',
      iconSrc: './assets/icons/recycle-bin.png'
    }
  ];

  return h('div', {
    id: 'desktop-icons-container',
    className: 'p-3 flex flex-col items-start gap-1 w-max h-[calc(100vh-36px)] z-10 select-none overflow-y-auto'
  }, icons.map(icon => {
    const isSelected = selectedIcon === icon.id;
    return h('div', {
      key: icon.id,
      id: `desktop-icon-${icon.id}`,
      className: `desktop-icon w-[84px] flex flex-col items-center text-center p-1.5 rounded cursor-pointer group ${isSelected ? 'selected' : ''}`,
      onClick: e => {
        e.stopPropagation();
        onSelectIcon(icon.id);
        onOpenWindow(icon.windowId);
      }
    }, [
      h('div', { key: 'img-wrap', className: 'w-11 h-11 flex items-center justify-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]' }, [
        h('img', {
          src: icon.iconSrc,
          alt: icon.label,
          className: 'w-10 h-10 object-contain group-hover:scale-105 transition-transform'
        })
      ]),
      h('span', { key: 'lbl', className: 'text-white text-xs font-normal mt-1 leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] px-1' }, icon.label)
    ]);
  }));
}

// --- 4. Projects Explorer Window Component ---
function ProjectsWindow({ windowState, isActive, onBringToFront, onClose, onMinimize, onToggleMaximize, onOpenWindow, onStartDrag, onActionNotification }) {
  const [address, setAddress] = useState('C:\\Users\\Developer\\Projects');
  const [tasksCollapsed, setTasksCollapsed] = useState(false);
  const [otherFoldersCollapsed, setOtherFoldersCollapsed] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  if (!windowState.isOpen || windowState.isMinimized) return null;

  const mobile = isMobile();
  const isFullscreen = windowState.isMaximized || mobile;

  return h('div', {
    id: 'window-projects',
    className: `xp-window absolute flex flex-col z-20 shadow-2xl transition-all ${isFullscreen ? 'maximized' : ''}`,
    style: {
      zIndex: windowState.zIndex,
      left: isFullscreen ? 0 : `${windowState.position.x}px`,
      top: isFullscreen ? 0 : `${windowState.position.y}px`,
      width: isFullscreen ? '100vw' : '700px',
      height: isFullscreen ? 'calc(100vh - 36px)' : '480px',
      backgroundColor: '#ece9d8'
    },
    onMouseDown: onBringToFront
  }, [
    // Titlebar
    h('div', {
      key: 'titlebar',
      id: 'projects-titlebar',
      className: `${isActive ? 'xp-titlebar' : 'xp-titlebar-inactive'} h-7 px-2 flex items-center justify-between cursor-move text-white select-none`,
      onMouseDown: onStartDrag
    }, [
      h('div', { key: 'left', className: 'flex items-center space-x-2' }, [
        h('img', { src: './assets/icons/projects.png', alt: 'Projects', className: 'w-4 h-4 object-contain' }),
        h('span', { className: 'text-xs font-bold tracking-wide shadow-sm' }, 'My Projects - Windows Explorer')
      ]),
      h('div', { key: 'right', className: 'flex items-center space-x-1', onMouseDown: e => e.stopPropagation() }, [
        h('button', {
          id: 'btn-projects-minimize',
          className: 'w-5 h-5 bg-[#0055eb] hover:brightness-110 text-white text-[10px] flex items-center justify-center rounded-sm border border-white/60 font-bold cursor-pointer',
          onClick: onMinimize,
          title: 'Minimize'
        }, '_'),
        h('button', {
          id: 'btn-projects-maximize',
          className: 'w-5 h-5 bg-[#0055eb] hover:brightness-110 text-white text-[10px] flex items-center justify-center rounded-sm border border-white/60 font-bold cursor-pointer',
          onClick: onToggleMaximize,
          title: windowState.isMaximized ? 'Restore' : 'Maximize'
        }, h('i', { className: 'fa-regular fa-square text-[9px]' })),
        h('button', {
          id: 'btn-projects-close',
          className: 'xp-btn-close w-5 h-5 text-white text-[11px] flex items-center justify-center rounded-sm font-bold cursor-pointer',
          onClick: onClose,
          title: 'Close'
        }, '✕')
      ])
    ]),

    // Menu Bar
    h('div', { key: 'menubar', className: 'bg-[#ece9d8] border-b border-[#d8d0c5] px-2 py-0.5 text-xs text-gray-800 flex space-x-3 select-none' }, [
      h('span', { key: 'm1', className: 'hover:bg-[#316ac5] hover:text-white px-1.5 rounded-xs cursor-pointer' }, 'File'),
      h('span', { key: 'm2', className: 'hover:bg-[#316ac5] hover:text-white px-1.5 rounded-xs cursor-pointer' }, 'Edit'),
      h('span', { key: 'm3', className: 'hover:bg-[#316ac5] hover:text-white px-1.5 rounded-xs cursor-pointer' }, 'View'),
      h('span', { key: 'm4', className: 'hover:bg-[#316ac5] hover:text-white px-1.5 rounded-xs cursor-pointer' }, 'Favorites'),
      h('span', { key: 'm5', className: 'hover:bg-[#316ac5] hover:text-white px-1.5 rounded-xs cursor-pointer' }, 'Tools'),
      h('span', { key: 'm6', className: 'hover:bg-[#316ac5] hover:text-white px-1.5 rounded-xs cursor-pointer' }, 'Help')
    ]),

    // Toolbar
    h('div', { key: 'toolbar', className: 'bg-[#ece9d8] border-b border-[#aca899] px-2 py-1 flex items-center space-x-2 text-xs select-none' }, [
      h('button', {
        key: 'back',
        className: 'flex items-center space-x-1 px-1.5 py-0.5 rounded hover:border hover:border-gray-400 cursor-pointer',
        onClick: () => onActionNotification('Navigated to parent directory')
      }, [
        h('div', { key: 'b-ico', className: 'w-4 h-4 rounded-full bg-green-600 text-white text-[10px] flex items-center justify-center' }, h('i', { className: 'fa-solid fa-arrow-left' })),
        h('span', { key: 'b-txt' }, 'Back')
      ]),
      h('button', {
        key: 'fwd',
        className: 'flex items-center space-x-1 px-1.5 py-0.5 rounded text-gray-400 cursor-not-allowed'
      }, [
        h('div', { key: 'f-ico', className: 'w-4 h-4 rounded-full bg-gray-400 text-white text-[10px] flex items-center justify-center' }, h('i', { className: 'fa-solid fa-arrow-right' }))
      ]),
      h('button', {
        key: 'up',
        className: 'flex items-center space-x-1 px-1.5 py-0.5 rounded hover:border hover:border-gray-400 text-amber-700 cursor-pointer',
        onClick: () => onActionNotification('Moved Up 1 level: C:\\Users\\Developer')
      }, h('i', { className: 'fa-solid fa-arrow-up' })),
      h('div', { key: 'sep', className: 'h-4 border-r border-gray-400 mx-1' }),
      h('button', {
        key: 'search',
        className: 'flex items-center space-x-1 px-1.5 py-0.5 rounded hover:border hover:border-gray-400 cursor-pointer',
        onClick: () => onActionNotification('Windows Search Companion: Search for files or projects...')
      }, [
        h('i', { key: 's-ico', className: 'fa-solid fa-magnifying-glass text-yellow-600' }),
        h('span', { key: 's-txt' }, 'Search')
      ]),
      h('button', {
        key: 'folders',
        className: 'flex items-center space-x-1 px-1.5 py-0.5 rounded hover:border hover:border-gray-400 cursor-pointer',
        onClick: () => setTasksCollapsed(prev => !prev)
      }, [
        h('i', { key: 'f-ico', className: 'fa-solid fa-folder-tree text-amber-500' }),
        h('span', { key: 'f-txt' }, 'Folders')
      ])
    ]),

    // Address Bar
    h('div', { key: 'addressbar', className: 'bg-[#ece9d8] border-b border-[#aca899] px-2 py-1 flex items-center space-x-2 text-xs select-none' }, [
      h('span', { key: 'lbl', className: 'text-gray-500' }, 'Address'),
      h('div', { key: 'input-box', className: 'flex-1 bg-white border border-[#7f9db9] px-2 py-0.5 flex items-center space-x-1.5 text-xs shadow-inner' }, [
        h('img', { key: 'ico', src: './assets/icons/projects.png', className: 'w-3.5 h-3.5 object-contain' }),
        h('input', {
          key: 'inp',
          id: 'projects-address-input',
          type: 'text',
          className: 'w-full text-gray-900 font-mono text-[11px] outline-none bg-transparent',
          value: address,
          onChange: e => setAddress(e.target.value)
        })
      ]),
      h('button', {
        key: 'btn-go',
        id: 'btn-address-go',
        className: 'px-2 py-0.5 bg-gray-100 border border-gray-400 text-xs rounded-sm hover:bg-gray-200 cursor-pointer active:bg-gray-300',
        onClick: () => onActionNotification(`Navigating to: ${address}`)
      }, 'Go')
    ]),

    // Explorer Content Pane
    h('div', { key: 'body', className: 'flex-1 flex overflow-hidden' }, [
      // Left Blue Sidebar (hidden on mobile)
      !isMobile() && h('div', { key: 'sidebar', className: 'w-44 bg-gradient-to-b from-[#7aa1e6] to-[#6375d6] p-2 text-white overflow-y-auto space-y-2.5 flex-shrink-0 select-none' }, [
        // Project Tasks
        h('div', { key: 't-box', className: 'rounded-t-md overflow-hidden bg-white/95 text-gray-800 shadow-sm' }, [
          h('div', {
            className: 'bg-gradient-to-r from-[#215dc6] to-[#3a7bf0] px-2 py-1 text-white text-xs font-bold flex justify-between items-center cursor-pointer',
            onClick: () => setTasksCollapsed(prev => !prev)
          }, [
            h('span', { key: 't-lbl' }, 'Project Tasks'),
            h('i', { key: 't-arr', className: `fa-solid fa-chevron-up text-[10px] transform transition-transform ${tasksCollapsed ? 'rotate-180' : ''}` })
          ]),
          !tasksCollapsed && h('div', { className: 'p-2 text-xs space-y-1.5 text-blue-900' }, [
            h('a', {
              key: 'gh',
              href: 'https://github.com/Alialkhozini?tab=repositories',
              target: '_blank',
              rel: 'noreferrer',
              className: 'flex items-center space-x-2 hover:underline cursor-pointer'
            }, [
              h('i', { className: 'fa-brands fa-github text-stone-800' }),
              h('span', { className: 'text-[11px]' }, 'View all repositories')
            ]),
            h('a', {
              key: 'cv',
              href: './cv-muhammad-mahrus-ali-backend.md',
              download: true,
              className: 'flex items-center space-x-2 hover:underline cursor-pointer',
              onClick: () => onActionNotification('CV download: cv-muhammad-mahrus-ali-backend.md')
            }, [
              h('i', { className: 'fa-solid fa-file-pdf text-red-600' }),
              h('span', { className: 'text-[11px]' }, 'Download CV')
            ])
          ])
        ]),

        // Other Folders
        h('div', { key: 'o-box', className: 'rounded-t-md overflow-hidden bg-white/95 text-gray-800 shadow-sm' }, [
          h('div', {
            className: 'bg-gradient-to-r from-[#215dc6] to-[#3a7bf0] px-2 py-1 text-white text-xs font-bold flex justify-between items-center cursor-pointer',
            onClick: () => setOtherFoldersCollapsed(prev => !prev)
          }, [
            h('span', { key: 'o-lbl' }, 'Other Folders'),
            h('i', { key: 'o-arr', className: `fa-solid fa-chevron-up text-[10px] transform transition-transform ${otherFoldersCollapsed ? 'rotate-180' : ''}` })
          ]),
          !otherFoldersCollapsed && h('div', { className: 'p-2 text-xs space-y-1.5 text-blue-900' }, [
            h('div', {
              key: 'o-np',
              className: 'flex items-center space-x-2 hover:underline cursor-pointer',
              onClick: () => onOpenWindow('notepad')
            }, [
              h('img', { src: './assets/icons/notepad.png', className: 'w-4 h-4 object-contain' }),
              h('span', { className: 'text-[11px]' }, 'about_me.txt')
            ]),
            h('div', {
              key: 'o-sk',
              className: 'flex items-center space-x-2 hover:underline cursor-pointer',
              onClick: () => onOpenWindow('skills')
            }, [
              h('img', { src: './assets/icons/computer.png', className: 'w-4 h-4 object-contain' }),
              h('span', { className: 'text-[11px]' }, 'Tech Stack Specs')
            ]),
            h('div', {
              key: 'o-ct',
              className: 'flex items-center space-x-2 hover:underline cursor-pointer',
              onClick: () => onOpenWindow('contact')
            }, [
              h('img', { src: './assets/icons/contact.png', className: 'w-4 h-4 object-contain' }),
              h('span', { className: 'text-[11px]' }, 'Contact Details')
            ])
          ])
        ])
      ]),

      // Main Projects List Area
      h('div', { key: 'list', className: 'flex-1 bg-white p-3 overflow-y-auto space-y-3' }, PROJECTS_DATA.map(project => {
        const isSelected = selectedProjectId === project.id;
        return h('div', {
          key: project.id,
          id: `project-card-${project.id}`,
          className: `border rounded p-2.5 transition ${isSelected ? 'border-blue-600 bg-blue-50/70 shadow-sm' : 'border-blue-200 bg-gradient-to-r from-blue-50/40 to-white hover:border-blue-500 hover:shadow-sm'}`,
          onClick: () => setSelectedProjectId(project.id)
        }, [
          h('div', { key: 'card-header', className: 'flex items-start justify-between' }, [
            h('div', { key: 'c-title-area', className: 'flex items-center space-x-2' }, [
              h('div', { key: 'c-ico', className: `w-8 h-8 rounded ${project.iconBg} flex items-center justify-center text-white text-sm shadow` }, [
                h('i', { className: project.icon })
              ]),
              h('div', { key: 'c-meta' }, [
                h('h3', { className: 'text-xs font-bold text-[#0c327d]' }, project.title),
                h('div', { className: 'text-[10px] text-gray-500' }, project.subtitle)
              ])
            ]),
            h('div', { key: 'c-actions', className: 'flex space-x-1.5', onClick: e => e.stopPropagation() }, [
              project.liveDemoUrl && h('a', {
                key: 'btn-demo',
                id: `btn-demo-${project.id}`,
                href: project.liveDemoUrl,
                target: '_blank',
                rel: 'noreferrer',
                className: 'xp-btn-win text-[11px] px-2 py-0.5 rounded-sm flex items-center space-x-1 cursor-pointer',
                onClick: () => onActionNotification(`Opening Live Demo: ${project.title}`)
              }, [
                h('i', { key: 'i', className: 'fa-solid fa-arrow-up-right-from-square text-[10px] text-blue-700' }),
                h('span', { key: 's' }, 'Live Demo')
              ])
            ])
          ]),
          h('p', { key: 'c-desc', className: 'text-[11px] text-gray-700 mt-2 leading-relaxed' }, project.description),
          h('div', { key: 'c-tags', className: 'flex flex-wrap gap-1 mt-2' }, project.tags.map(tag => (
            h('span', { key: tag, className: 'px-1.5 py-0.5 bg-sky-100 text-sky-800 border border-sky-300 rounded text-[10px] font-semibold' }, tag)
          )))
        ]);
      }))
    ]),

    // Status Bar
    h('div', { key: 'statusbar', className: 'bg-[#ece9d8] border-t border-[#aca899] px-3 py-0.5 text-[11px] text-gray-600 flex justify-between select-none' }, [
      h('span', { key: 's1' }, '6 Projects loaded (All systems operational)'),
      h('span', { key: 's2' }, 'My Computer')
    ])
  ]);
}

// --- 5. Notepad Window Component ---
function NotepadWindow({ windowState, isActive, onBringToFront, onClose, onMinimize, onToggleMaximize, onStartDrag, onActionNotification }) {
  const [content, setContent] = useState(BIO_TEXT);

  if (!windowState.isOpen || windowState.isMinimized) return null;

  const linesCount = content.split('\n').length;

  const mobile = isMobile();
  const isFullscreen = windowState.isMaximized || mobile;

  return h('div', {
    id: 'window-notepad',
    className: `xp-window absolute flex flex-col z-20 shadow-2xl transition-all ${isFullscreen ? 'maximized' : ''}`,
    style: {
      zIndex: windowState.zIndex,
      left: isFullscreen ? 0 : `${windowState.position.x}px`,
      top: isFullscreen ? 0 : `${windowState.position.y}px`,
      width: isFullscreen ? '100vw' : '520px',
      height: isFullscreen ? 'calc(100vh - 36px)' : '370px',
      backgroundColor: '#ffffff'
    },
    onMouseDown: onBringToFront
  }, [
    // Titlebar
    h('div', {
      key: 'titlebar',
      id: 'notepad-titlebar',
      className: `${isActive ? 'xp-titlebar' : 'xp-titlebar-inactive'} h-7 px-2 flex items-center justify-between cursor-move text-white select-none`,
      onMouseDown: onStartDrag
    }, [
      h('div', { key: 't-left', className: 'flex items-center space-x-2' }, [
        h('img', { src: './assets/icons/notepad.png', alt: 'Notepad', className: 'w-4 h-4 object-contain' }),
        h('span', { className: 'text-xs font-bold tracking-wide' }, 'about_me.txt - Notepad')
      ]),
      h('div', { key: 't-right', className: 'flex items-center space-x-1', onMouseDown: e => e.stopPropagation() }, [
        h('button', { id: 'btn-notepad-minimize', className: 'w-5 h-5 bg-[#0055eb] hover:brightness-110 text-white text-[10px] flex items-center justify-center rounded-sm border border-white/60 font-bold cursor-pointer', onClick: onMinimize }, '_'),
        h('button', { id: 'btn-notepad-maximize', className: 'w-5 h-5 bg-[#0055eb] hover:brightness-110 text-white text-[10px] flex items-center justify-center rounded-sm border border-white/60 font-bold cursor-pointer', onClick: onToggleMaximize }, h('i', { className: 'fa-regular fa-square text-[9px]' })),
        h('button', { id: 'btn-notepad-close', className: 'xp-btn-close w-5 h-5 text-white text-[11px] flex items-center justify-center rounded-sm font-bold cursor-pointer', onClick: onClose }, '✕')
      ])
    ]),

    // Menu Bar
    h('div', { key: 'menubar', className: 'bg-[#ece9d8] border-b border-[#aca899] px-2 py-0.5 text-xs text-gray-800 flex space-x-3 select-none' }, [
      h('span', { key: 'm1', className: 'cursor-pointer hover:bg-blue-600 hover:text-white px-1', onClick: () => onActionNotification('File: Save / Print ready') }, 'File'),
      h('span', { key: 'm2', className: 'cursor-pointer hover:bg-blue-600 hover:text-white px-1', onClick: () => onActionNotification('Edit: Select All / Copy') }, 'Edit'),
      h('span', { key: 'm3', className: 'cursor-pointer hover:bg-blue-600 hover:text-white px-1', onClick: () => onActionNotification('Format: Word Wrap enabled') }, 'Format'),
      h('span', { key: 'm4', className: 'cursor-pointer hover:bg-blue-600 hover:text-white px-1', onClick: () => onActionNotification('View: Status Bar on') }, 'View'),
      h('span', { key: 'm5', className: 'cursor-pointer hover:bg-blue-600 hover:text-white px-1', onClick: () => onActionNotification('Notepad v5.1 (Developer Edition)') }, 'Help')
    ]),

    // Text Area
    h('textarea', {
      key: 'textarea',
      id: 'notepad-textarea',
      className: 'flex-1 p-3 outline-none resize-none font-mono-terminal text-xs text-gray-900 leading-relaxed selection:bg-[#316ac5] selection:text-white overflow-y-auto',
      spellCheck: 'false',
      value: content,
      onChange: e => setContent(e.target.value)
    }),

    // Status Bar
    h('div', { key: 'statusbar', className: 'bg-[#ece9d8] border-t border-[#aca899] px-3 py-0.5 text-[11px] text-gray-600 flex justify-between select-none' }, [
      h('span', { key: 'ln' }, `Ln ${linesCount}, Col 1`),
      h('span', { key: 'fmt' }, 'Windows (CRLF) • UTF-8')
    ])
  ]);
}

// --- 6. Command Prompt / Terminal Window Component ---
function TerminalWindow({ windowState, isActive, onBringToFront, onClose, onMinimize, onToggleMaximize, onOpenWindow, onStartDrag }) {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState([]);
  const screenRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (screenRef.current) {
      screenRef.current.scrollTop = screenRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    if (windowState.isOpen && !windowState.isMinimized && isActive) {
      inputRef.current?.focus();
    }
  }, [windowState.isOpen, windowState.isMinimized, isActive]);

  if (!windowState.isOpen || windowState.isMinimized) return null;

  const handleCommand = cmdText => {
    const trimmed = cmdText.trim();
    if (!trimmed) return;
    const lower = trimmed.toLowerCase();

    if (lower === 'clear' || lower === 'cls') {
      setHistory([]);
      setInputVal('');
      return;
    }

    let output = null;
    if (lower === 'help') {
      output = h('div', { className: 'text-stone-300 space-y-1' }, [
        h('div', { key: 'h-title', className: 'text-gray-400' }, 'Available commands:'),
        h('div', { key: 'c1' }, [h('span', { className: 'text-amber-300 font-bold' }, 'whoami'), ' - Display developer identity and title']),
        h('div', { key: 'c2' }, [h('span', { className: 'text-amber-300 font-bold' }, 'cat skills.json'), ' - Dump technical competencies and toolchains']),
        h('div', { key: 'c3' }, [h('span', { className: 'text-amber-300 font-bold' }, 'curl contact'), ' - Output direct contact methods and links']),
        h('div', { key: 'c4' }, [h('span', { className: 'text-amber-300 font-bold' }, 'projects'), ' - Launch the My Projects Explorer window']),
        h('div', { key: 'c5' }, [h('span', { className: 'text-amber-300 font-bold' }, 'dir'), ' - List directory files']),
        h('div', { key: 'c6' }, [h('span', { className: 'text-amber-300 font-bold' }, 'date'), ' - Display current local timestamp']),
        h('div', { key: 'c7' }, [h('span', { className: 'text-amber-300 font-bold' }, 'clear'), ' - Clear screen buffer'])
      ]);
    } else if (lower === 'whoami') {
      output = h('div', { className: 'text-emerald-400' }, 'Muhammad Mahrus Ali - Backend / Fullstack JavaScript Developer (Node.js + Next.js) | Building automasiku SaaS');
    } else if (lower === 'cat skills.json') {
      output = h('pre', { className: 'text-emerald-300 font-mono-terminal text-[11px] leading-tight my-1' }, JSON.stringify({
        languages: ["TypeScript", "JavaScript", "SQL"],
        frontend: ["React", "Next.js", "Tailwind CSS"],
        backend: ["Node.js", "Express", "Restify", "Elysiajs", "Bun", "Supabase", "REST API"],
        database: ["PostgreSQL", "MongoDB", "MySQL", "Redis"],
        devops: ["Docker", "GitHub Actions"],
        integrations: ["Google OAuth", "Midtrans", "RajaOngkir", "Telkomsel", "SharePoint"]
      }, null, 2));
    } else if (lower === 'curl contact') {
      output = h('div', { className: 'text-stone-300 space-y-1' }, [
        h('div', { key: 'ok' }, 'HTTP/1.1 200 OK'),
        h('div', { key: 'email' }, ['Email: ', h('a', { href: 'mailto:muhammadmahrus2310@gmail.com', className: 'text-sky-300 underline' }, 'muhammadmahrus2310@gmail.com')]),
        h('div', { key: 'gh' }, ['GitHub: ', h('a', { href: 'https://github.com/Alialkhozini', target: '_blank', rel: 'noreferrer', className: 'text-blue-400 underline' }, 'https://github.com/Alialkhozini')]),
        h('div', { key: 'repos' }, ['Repositories: ', h('a', { href: 'https://github.com/Alialkhozini?tab=repositories', target: '_blank', rel: 'noreferrer', className: 'text-blue-400 underline' }, 'https://github.com/Alialkhozini?tab=repositories')]),
        h('div', { key: 'li' }, ['LinkedIn: ', h('a', { href: 'https://www.linkedin.com/in/muhammad-mahrus-ali-1029a9299?utm_source=share_via&utm_content=profile&utm_medium=member_android', target: '_blank', rel: 'noreferrer', className: 'text-blue-400 underline' }, 'Muhammad Mahrus Ali LinkedIn')]),
        h('div', { key: 'web' }, ['Website: ', h('a', { href: 'https://alialkhozini.my.id', target: '_blank', rel: 'noreferrer', className: 'text-blue-400 underline' }, 'https://alialkhozini.my.id')])
      ]);
    } else if (lower === 'projects') {
      onOpenWindow('projects');
      output = h('div', { className: 'text-sky-300' }, 'Launching My Projects Explorer...');
    } else if (lower === 'dir') {
      output = h('div', { className: 'text-stone-300 font-mono text-[11px] space-y-0.5' }, [
        h('div', { key: 'v' }, 'Volume in drive C is WINDOWS_XP'),
        h('div', { key: 'd' }, 'Directory of C:\\Users\\Developer'),
        h('br', { key: 'br' }),
        h('div', { key: 'd1' }, '09/20/2026  08:15 PM    <DIR>          .'),
        h('div', { key: 'd2' }, '09/20/2026  08:15 PM    <DIR>          ..'),
        h('div', { key: 'd3' }, '09/20/2026  08:30 PM    <DIR>          Projects'),
        h('div', { key: 'd4' }, '09/20/2026  08:32 PM             1,024 about_me.txt'),
        h('div', { key: 'd5' }, '09/20/2026  08:40 PM               512 skills.json'),
        h('div', { key: 'd6' }, '09/20/2026  08:45 PM    <DIR>          Favorites')
      ]);
    } else if (lower === 'date') {
      output = h('div', { className: 'text-stone-300' }, new Date().toString());
    } else {
      output = h('div', { className: 'text-red-400' }, `'${trimmed}' is not recognized as an internal or external command. Type 'help' for options.`);
    }

    setHistory(prev => [...prev, { cmd: trimmed, output }]);
    setInputVal('');
  };

  const mobile = isMobile();
  const isFullscreen = windowState.isMaximized || mobile;

  return h('div', {
    id: 'window-terminal',
    className: `xp-window absolute flex flex-col z-20 shadow-2xl transition-all ${isFullscreen ? 'maximized' : ''}`,
    style: {
      zIndex: windowState.zIndex,
      left: isFullscreen ? 0 : `${windowState.position.x}px`,
      top: isFullscreen ? 0 : `${windowState.position.y}px`,
      width: isFullscreen ? '100vw' : '560px',
      height: isFullscreen ? 'calc(100vh - 36px)' : '360px',
      backgroundColor: '#000000'
    },
    onMouseDown: onBringToFront
  }, [
    // Titlebar
    h('div', {
      key: 'titlebar',
      id: 'terminal-titlebar',
      className: `${isActive ? 'xp-titlebar' : 'xp-titlebar-inactive'} h-7 px-2 flex items-center justify-between cursor-move text-white select-none`,
      onMouseDown: onStartDrag
    }, [
      h('div', { key: 'left', className: 'flex items-center space-x-2' }, [
        h('img', { src: './assets/icons/terminal.png', alt: 'Terminal', className: 'w-4 h-4 object-contain' }),
        h('span', { className: 'text-xs font-bold tracking-wide' }, 'Command Prompt - C:\\WINDOWS\\system32\\')
      ]),
      h('div', { key: 'right', className: 'flex items-center space-x-1', onMouseDown: e => e.stopPropagation() }, [
        h('button', { id: 'btn-terminal-minimize', className: 'w-5 h-5 bg-[#0055eb] hover:brightness-110 text-white text-[10px] flex items-center justify-center rounded-sm border border-white/60 font-bold cursor-pointer', onClick: onMinimize }, '_'),
        h('button', { id: 'btn-terminal-maximize', className: 'w-5 h-5 bg-[#0055eb] hover:brightness-110 text-white text-[10px] flex items-center justify-center rounded-sm border border-white/60 font-bold cursor-pointer', onClick: onToggleMaximize }, h('i', { className: 'fa-regular fa-square text-[9px]' })),
        h('button', { id: 'btn-terminal-close', className: 'xp-btn-close w-5 h-5 text-white text-[11px] flex items-center justify-center rounded-sm font-bold cursor-pointer', onClick: onClose }, '✕')
      ])
    ]),

    // Screen
    h('div', {
      key: 'screen',
      ref: screenRef,
      id: 'terminal-screen',
      className: 'flex-1 bg-black p-3 font-mono-terminal text-xs text-stone-200 overflow-y-auto leading-relaxed select-text',
      onClick: () => inputRef.current?.focus()
    }, [
      h('div', { key: 'ver', className: 'text-stone-400' }, 'Microsoft(R) Windows DOS [Version 5.1.2600]'),
      h('div', { key: 'cp', className: 'text-stone-400 mb-2' }, '(C) Copyright 1985-2001 Microsoft Corp.'),
      h('div', { key: 'intro' }, [
        'Type ',
        h('span', { className: 'text-amber-400 font-bold' }, "'help'"),
        ' to see available commands or click quick actions below.'
      ]),

      // Action Shortcuts
      h('div', { key: 'quick', className: 'flex gap-2 my-2 select-none', onClick: e => e.stopPropagation() }, [
        h('button', { id: 'btn-cmd-whoami', className: 'px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-sky-400 border border-zinc-600 rounded text-[11px] cursor-pointer', onClick: () => handleCommand('whoami') }, 'whoami'),
        h('button', { id: 'btn-cmd-skills', className: 'px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border border-zinc-600 rounded text-[11px] cursor-pointer', onClick: () => handleCommand('cat skills.json') }, 'cat skills.json'),
        h('button', { id: 'btn-cmd-contact', className: 'px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-yellow-400 border border-zinc-600 rounded text-[11px] cursor-pointer', onClick: () => handleCommand('curl contact') }, 'curl contact'),
        h('button', { id: 'btn-cmd-clear', className: 'px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-red-400 border border-zinc-600 rounded text-[11px] cursor-pointer', onClick: () => handleCommand('clear') }, 'clear')
      ]),

      // History
      h('div', { key: 'hist', id: 'terminal-history', className: 'space-y-2' }, history.map((item, idx) => (
        h('div', { key: idx, className: 'space-y-0.5' }, [
          h('div', { key: 'c' }, [
            h('span', { className: 'text-stone-400' }, 'C:\\Users\\Developer>'),
            ' ',
            h('span', { className: 'text-white font-bold' }, item.cmd)
          ]),
          h('div', { key: 'o', className: 'mb-2' }, item.output)
        ])
      ))),

      // Input Prompt
      h('div', { key: 'input-row', className: 'flex items-center space-x-1.5 mt-1' }, [
        h('span', { key: 'p', className: 'text-stone-400' }, 'C:\\Users\\Developer>'),
        h('input', {
          key: 'inp',
          ref: inputRef,
          id: 'terminal-input',
          type: 'text',
          className: 'flex-1 bg-transparent text-white outline-none border-none font-mono-terminal text-xs caret-white',
          value: inputVal,
          onChange: e => setInputVal(e.target.value),
          onKeyDown: e => {
            if (e.key === 'Enter') handleCommand(inputVal);
          },
          autoFocus: true
        })
      ])
    ])
  ]);
}

// --- 7. System Properties / Tech Stack Window Component ---
function SkillsWindow({ windowState, isActive, onBringToFront, onClose, onStartDrag, onActionNotification }) {
  const [activeTab, setActiveTab] = useState('general');

  if (!windowState.isOpen || windowState.isMinimized) return null;

  const frontendSkills = [
    { icon: 'fa-brands fa-react', color: 'text-cyan-500', label: 'React & Next.js', sub: 'App Router, Server Components' },
    { icon: 'fa-brands fa-js-square', color: 'text-blue-600', label: 'TypeScript', sub: 'Strict Mode, Generics, Type-level' },
    { icon: 'fa-solid fa-palette', color: 'text-violet-600', label: 'Tailwind CSS', sub: 'Modern CSS Architecture' },
    { icon: 'fa-solid fa-database', color: 'text-emerald-600', label: 'Supabase Client', sub: 'Auth, Realtime, Edge' }
  ];

  const backendSkills = [
    { icon: 'fa-brands fa-node-js', color: 'text-green-600', label: 'Node.js & Express / Restify', sub: 'REST API + Microservices Architecture' },
    { icon: 'fa-solid fa-bolt', color: 'text-amber-500', label: 'Elysiajs & Bun', sub: 'High-performance runtime' },
    { icon: 'fa-brands fa-postgresql', color: 'text-blue-600', label: 'PostgreSQL, MongoDB, MySQL & Redis', sub: 'Indexing & Query Optimization' },
    { icon: 'fa-solid fa-database', color: 'text-emerald-600', label: 'Supabase', sub: 'Auth, Storage, Realtime, Edge' }
  ];

  const renderSkillCard = skill => h('div', {
    key: skill.label,
    className: 'flex items-center space-x-3 p-1.5 bg-slate-50 rounded border border-gray-200'
  }, [
    h('i', { key: 'ico', className: `${skill.icon} text-lg ${skill.color} flex-shrink-0` }),
    h('div', { key: 'meta', className: 'flex-1' }, [
      h('div', { className: 'font-semibold text-gray-800' }, skill.label),
      skill.sub ? h('div', { className: 'text-[10px] text-gray-500' }, skill.sub) : null
    ])
  ]);

  const mobile = isMobile();

  return h('div', {
    id: 'window-skills',
    className: `xp-window absolute flex flex-col z-20 shadow-2xl transition-all ${mobile ? 'maximized' : ''}`,
    style: {
      zIndex: windowState.zIndex,
      left: mobile ? 0 : `${windowState.position.x}px`,
      top: mobile ? 0 : `${windowState.position.y}px`,
      width: mobile ? '100vw' : '490px',
      height: mobile ? 'calc(100vh - 36px)' : '460px',
      backgroundColor: '#ece9d8'
    },
    onMouseDown: onBringToFront
  }, [
    // Titlebar
    h('div', {
      key: 'titlebar',
      id: 'skills-titlebar',
      className: `${isActive ? 'xp-titlebar' : 'xp-titlebar-inactive'} h-7 px-2 flex items-center justify-between cursor-move text-white select-none`,
      onMouseDown: onStartDrag
    }, [
      h('div', { key: 'left', className: 'flex items-center space-x-2' }, [
        h('img', { src: './assets/icons/computer.png', alt: 'Computer', className: 'w-4 h-4 object-contain' }),
        h('span', { className: 'text-xs font-bold tracking-wide' }, 'System Properties - Developer Tech Stack')
      ]),
      h('div', { key: 'right', className: 'flex items-center space-x-1', onMouseDown: e => e.stopPropagation() }, [
        h('button', { id: 'btn-skills-close', className: 'xp-btn-close w-5 h-5 text-white text-[11px] flex items-center justify-center rounded-sm font-bold cursor-pointer', onClick: onClose }, '✕')
      ])
    ]),

    // Tabs
    h('div', { key: 'tabs', className: 'px-3 pt-2 flex space-x-1 bg-[#ece9d8] border-b border-[#919b9c] text-xs select-none' }, [
      { key: 'general', label: 'General' },
      { key: 'frontend', label: 'Frontend' },
      { key: 'backend', label: 'Backend & DB' },
      { key: 'devops', label: 'DevOps / Cloud' }
    ].map(tab => (
      h('button', {
        key: tab.key,
        id: `tab-btn-${tab.key}`,
        className: `xp-tab px-3 py-1 text-gray-800 cursor-pointer ${activeTab === tab.key ? 'active font-bold' : ''}`,
        onClick: () => setActiveTab(tab.key)
      }, tab.label)
    ))),

    // Tab Body
    h('div', { key: 'body', className: 'flex-1 p-3 overflow-y-auto bg-white m-2 border border-[#7f9db9] rounded text-xs space-y-3' }, [
      activeTab === 'general' && h('div', { id: 'tab-content-general', className: 'space-y-3' }, [
        h('div', { key: 'top', className: 'flex items-center space-x-4 border-b border-gray-200 pb-3' }, [
          h('div', { className: 'w-14 h-14 flex items-center justify-center' }, [
            h('img', { src: './assets/icons/computer.png', alt: 'Computer', className: 'w-12 h-12 object-contain drop-shadow' })
          ]),
          h('div', { className: 'flex flex-col' }, [
            h('div', { className: 'font-bold text-sm text-blue-900' }, 'Developer Workstation 2026'),
            h('div', { className: 'text-[11px] text-gray-600' }, 'Muhammad Mahrus Ali • Backend / Fullstack JavaScript Developer'),
            h('div', { className: 'text-[11px] text-gray-500 mt-1' }, 'Status: Building & operating automasiku SaaS platform')
          ])
        ]),
        h('div', { key: 'specs', className: 'space-y-1.5' }, [
          h('div', { className: 'font-bold text-gray-800' }, 'Computer Specifications:'),
          h('div', { className: 'grid grid-cols-3 gap-2 text-[11px] bg-slate-50 p-2 rounded border border-gray-200' }, [
            h('span', { key: 'k1', className: 'text-gray-500' }, 'Primary Stack:'),
            h('span', { key: 'v1', className: 'col-span-2 font-semibold text-gray-800' }, 'Node.js / Next.js / Supabase / PostgreSQL'),
            h('span', { key: 'k2', className: 'text-gray-500' }, 'Prod Experience:'),
            h('span', { key: 'v2', className: 'col-span-2 font-semibold text-gray-800' }, '2023 – 2025 (SaaS & Backend Systems)'),
            h('span', { key: 'k3', className: 'text-gray-500' }, 'Architecture:'),
            h('span', { key: 'v3', className: 'col-span-2 font-semibold text-gray-800' }, 'Microservices, Multi-product SaaS, Event-driven'),
            h('span', { key: 'k4', className: 'text-gray-500' }, 'Availability:'),
            h('span', { key: 'v4', className: 'col-span-2 font-semibold text-emerald-700' }, 'Open to Full-Time & Contracts')
          ])
        ]),
        h('div', { key: 'cert', className: 'p-2 bg-blue-50 border border-blue-200 rounded text-[11px] text-blue-900 flex items-center space-x-2' }, [
          h('i', { className: 'fa-solid fa-circle-check text-green-600 text-sm' }),
          h('span', {}, 'All backend services and SaaS modules are production-verified and digitally signed.')
        ])
      ]),

      activeTab === 'frontend' && h('div', { id: 'tab-content-frontend', className: 'space-y-3' }, [
        h('div', { className: 'font-bold text-gray-800 text-xs mb-1' }, 'Frontend Engineering Proficiency:'),
        h('div', { className: 'grid gap-2.5 text-[11px]' }, frontendSkills.map(renderSkillCard))
      ]),

      activeTab === 'backend' && h('div', { id: 'tab-content-backend', className: 'space-y-3' }, [
        h('div', { className: 'font-bold text-gray-800 text-xs mb-1' }, 'Backend & Database Specifications:'),
        h('div', { className: 'grid gap-2.5 text-[11px]' }, backendSkills.map(renderSkillCard))
      ]),

      activeTab === 'devops' && h('div', { id: 'tab-content-devops', className: 'space-y-3' }, [
        h('div', { className: 'font-bold text-gray-800 text-xs mb-1' }, 'Infrastructure & Cloud Drivers:'),
        h('div', { className: 'grid grid-cols-2 gap-2 text-[11px]' }, [
          h('div', { key: 'd1', className: 'border border-gray-300 p-2 rounded bg-slate-50' }, [
            h('div', { className: 'font-bold text-blue-900 mb-0.5' }, [
              h('i', { className: 'fa-brands fa-docker text-blue-600 mr-1' }),
              ' Docker & Containers'
            ]),
            h('p', { className: 'text-gray-600 text-[10px]' }, 'Multi-stage builds, compose orchestration, production containerization.')
          ]),
          h('div', { key: 'd2', className: 'border border-gray-300 p-2 rounded bg-slate-50' }, [
            h('div', { className: 'font-bold text-blue-900 mb-0.5' }, [
              h('i', { className: 'fa-solid fa-code-branch text-purple-600 mr-1' }),
              ' CI/CD Pipelines'
            ]),
            h('p', { className: 'text-gray-600 text-[10px]' }, 'GitHub Actions, automated linting, build & deployment workflows.')
          ]),
          h('div', { key: 'd3', className: 'border border-gray-300 p-2 rounded bg-slate-50' }, [
            h('div', { className: 'font-bold text-blue-900 mb-0.5' }, [
              h('i', { className: 'fa-solid fa-server text-emerald-600 mr-1' }),
              ' SaaS Operations'
            ]),
            h('p', { className: 'text-gray-600 text-[10px]' }, 'Building & operating the automasiku multi-product SaaS platform (auth, billing, shared infra).')
          ]),
          h('div', { key: 'd4', className: 'border border-gray-300 p-2 rounded bg-slate-50' }, [
            h('div', { className: 'font-bold text-blue-900 mb-0.5' }, [
              h('i', { className: 'fa-solid fa-plug text-amber-600 mr-1' }),
              ' Third-party Integrations'
            ]),
            h('p', { className: 'text-gray-600 text-[10px]' }, 'Google OAuth, Midtrans, RajaOngkir, Telkomsel, Microsoft SharePoint.')
          ])
        ])
      ])
    ])
  ]);
}

// --- 8. Contact & Socials Dialog Component ---
function ContactWindow({ windowState, isActive, onBringToFront, onClose, onMinimize, onStartDrag, onActionNotification }) {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('Exciting Opportunity / Collaboration');
  const [message, setMessage] = useState('');

  if (!windowState.isOpen || windowState.isMinimized) return null;

  const phone = '6282350242821';

  const handleSend = () => {
    const senderName = name.trim() || 'Visitor';
    const bodyMsg = message.trim();
    const formatted = [
      'Halo Muhammad Mahrus Ali,',
      '',
      'Saya tertarik untuk berkolaborasi. Ini detail dari formulir kontak di portfolio:',
      '',
      `Perihal: ${subject || '(tidak ada)'}`,
      `Nama: ${senderName}`,
      `Pesan: ${bodyMsg || '(kosong)'}`
    ].join('\n');

    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(formatted)}`;
    window.open(waUrl, '_blank');
    onActionNotification(`Membuka WhatsApp untuk ${senderName}...`);
    setName('');
    setMessage('');
    onClose();
  };

  const mobile = isMobile();

  return h('div', {
    id: 'window-contact',
    className: `xp-window absolute flex flex-col z-20 shadow-2xl transition-all ${mobile ? 'maximized' : ''}`,
    style: {
      zIndex: windowState.zIndex,
      left: mobile ? 0 : `${windowState.position.x}px`,
      top: mobile ? 0 : `${windowState.position.y}px`,
      width: mobile ? '100vw' : '510px',
      height: mobile ? 'calc(100vh - 36px)' : '380px',
      backgroundColor: '#ece9d8'
    },
    onMouseDown: onBringToFront
  }, [
    // Titlebar
    h('div', {
      key: 'titlebar',
      id: 'contact-titlebar',
      className: `${isActive ? 'xp-titlebar' : 'xp-titlebar-inactive'} h-7 px-2 flex items-center justify-between cursor-move text-white select-none`,
      onMouseDown: onStartDrag
    }, [
      h('div', { key: 'left', className: 'flex items-center space-x-2' }, [
        h('img', { src: './assets/icons/contact.png', alt: 'Mail', className: 'w-4 h-4 object-contain' }),
        h('span', { className: 'text-xs font-bold tracking-wide' }, 'New Message')
      ]),
      h('div', { key: 'right', className: 'flex items-center space-x-1', onMouseDown: e => e.stopPropagation() }, [
        h('button', { id: 'btn-contact-minimize', className: 'w-5 h-5 bg-[#0055eb] hover:brightness-110 text-white text-[10px] flex items-center justify-center rounded-sm border border-white/60 font-bold cursor-pointer', onClick: onMinimize }, '_'),
        h('button', { id: 'btn-contact-close', className: 'xp-btn-close w-5 h-5 text-white text-[11px] flex items-center justify-center rounded-sm font-bold cursor-pointer', onClick: onClose }, '✕')
      ])
    ]),

    // Quick Social Links
    h('div', { key: 'socials', className: 'bg-[#ece9d8] border-b border-[#aca899] px-2 py-1 flex items-center space-x-2 text-xs select-none' }, [
      h('a', {
        key: 'gh',
        href: 'https://github.com/Alialkhozini',
        target: '_blank',
        rel: 'noreferrer',
        className: 'flex items-center space-x-1 px-2 py-0.5 rounded border border-gray-300 hover:bg-gray-100 cursor-pointer text-gray-800'
      }, [
        h('i', { className: 'fa-brands fa-github' }),
        h('span', {}, 'GitHub')
      ]),
      h('a', {
        key: 'gh-repos',
        href: 'https://github.com/Alialkhozini?tab=repositories',
        target: '_blank',
        rel: 'noreferrer',
        className: 'flex items-center space-x-1 px-2 py-0.5 rounded border border-gray-300 hover:bg-gray-100 cursor-pointer text-gray-800'
      }, [
        h('i', { className: 'fa-solid fa-folder-open text-amber-600' }),
        h('span', {}, 'All Repos')
      ]),
      h('a', {
        key: 'li',
        href: 'https://www.linkedin.com/in/muhammad-mahrus-ali-1029a9299?utm_source=share_via&utm_content=profile&utm_medium=member_android',
        target: '_blank',
        rel: 'noreferrer',
        className: 'flex items-center space-x-1 px-2 py-0.5 rounded border border-gray-300 hover:bg-gray-100 cursor-pointer text-blue-800'
      }, [
        h('i', { className: 'fa-brands fa-linkedin text-blue-600' }),
        h('span', {}, 'LinkedIn')
      ]),
      h('a', {
        key: 'email-btn',
        href: 'mailto:muhammadmahrus2310@gmail.com',
        className: 'flex items-center space-x-1 px-2 py-0.5 rounded border border-gray-300 hover:bg-gray-100 cursor-pointer text-red-800'
      }, [
        h('i', { className: 'fa-solid fa-envelope text-red-600' }),
        h('span', {}, 'Email')
      ])
    ]),

    // Form Header Fields
    h('div', { key: 'fields', className: 'bg-[#ece9d8] p-2 space-y-1.5 text-xs border-b border-gray-300 select-none' }, [
      h('div', { key: 'f1', className: 'flex items-center space-x-2' }, [
        h('span', { className: 'w-16 text-gray-600 text-right' }, 'Your Name:'),
        h('input', {
          id: 'contact-name-input',
          type: 'text',
          className: 'flex-1 bg-white border border-gray-400 px-2 py-0.5 rounded-xs outline-none select-text',
          placeholder: 'Recruiter or Collaborator',
          value: name,
          onChange: e => setName(e.target.value)
        })
      ]),
      h('div', { key: 'f2', className: 'flex items-center space-x-2' }, [
        h('span', { className: 'w-16 text-gray-600 text-right' }, 'Subject:'),
        h('input', {
          id: 'contact-subject-input',
          type: 'text',
          className: 'flex-1 bg-white border border-gray-400 px-2 py-0.5 rounded-xs outline-none select-text',
          value: subject,
          onChange: e => setSubject(e.target.value)
        })
      ])
    ]),

    // Body Textarea
    h('textarea', {
      key: 'body',
      id: 'contact-body-textarea',
      className: 'flex-1 p-2 outline-none resize-none font-sans text-xs text-gray-900 leading-relaxed select-text',
      placeholder: "Type your message here... I'm actively seeking senior engineering positions or innovative contract projects!",
      value: message,
      onChange: e => setMessage(e.target.value)
    }),

    // Footer
    h('div', { key: 'footer', className: 'bg-[#ece9d8] border-t border-[#aca899] px-3 py-1 text-[11px] flex justify-between items-center select-none' }, [
      h('span', { key: 'enc', className: 'text-emerald-700 font-semibold flex items-center gap-1' }, [
        h('i', { className: 'fa-solid fa-shield-halved text-green-600' }),
        ' Connection Encrypted'
      ]),
      h('button', {
        key: 'btn-send',
        id: 'btn-send-message',
        className: 'flex items-center space-x-1 px-2 py-0.5 rounded border border-gray-400 bg-white hover:bg-gray-100 cursor-pointer',
        onClick: handleSend
      }, [
        h('i', { className: 'fa-brands fa-whatsapp text-green-600' }),
        h('span', { className: 'font-bold' }, 'Send')
      ])
    ])
  ]);
}

// --- 9. Recycle Bin Window Component ---
function RecycleBinWindow({ windowState, isActive, onBringToFront, onClose, onStartDrag, onActionNotification }) {
  const [items, setItems] = useState([
    { id: 'ie6', name: 'Internet_Explorer_6_polyfills.js', desc: 'Deleted: 2014 • Size: 450 KB', badge: 'NEVER RESTORE', badgeColor: 'text-red-500', icon: 'fa-brands fa-internet-explorer text-gray-400' },
    { id: 'null_ptr', name: 'unhandled_null_pointer_bug.log', desc: 'Fixed with TypeScript strict: true', badge: 'Archived', badgeColor: 'text-gray-500', icon: 'fa-solid fa-bug text-red-400' },
    { id: 'coffee', name: 'cold_coffee_empty_mug.obj', desc: 'Fuel consumed while debugging production', badge: 'Refilled', badgeColor: 'text-emerald-600', icon: 'fa-solid fa-mug-hot text-amber-600' }
  ]);

  if (!windowState.isOpen || windowState.isMinimized) return null;

  const mobile = isMobile();

  return h('div', {
    id: 'window-recycle',
    className: `xp-window absolute flex flex-col z-20 shadow-2xl transition-all ${mobile ? 'maximized' : ''}`,
    style: {
      zIndex: windowState.zIndex,
      left: mobile ? 0 : `${windowState.position.x}px`,
      top: mobile ? 0 : `${windowState.position.y}px`,
      width: mobile ? '100vw' : '430px',
      height: mobile ? 'calc(100vh - 36px)' : '310px',
      backgroundColor: '#ece9d8'
    },
    onMouseDown: onBringToFront
  }, [
    // Titlebar
    h('div', {
      key: 'titlebar',
      id: 'recycle-titlebar',
      className: `${isActive ? 'xp-titlebar' : 'xp-titlebar-inactive'} h-7 px-2 flex items-center justify-between cursor-move text-white select-none`,
      onMouseDown: onStartDrag
    }, [
      h('div', { key: 'left', className: 'flex items-center space-x-2' }, [
        h('img', { src: './assets/icons/recycle-bin.png', alt: 'Recycle Bin', className: 'w-4 h-4 object-contain' }),
        h('span', { className: 'text-xs font-bold tracking-wide' }, 'Recycle Bin')
      ]),
      h('div', { key: 'right', className: 'flex items-center space-x-1', onMouseDown: e => e.stopPropagation() }, [
        h('button', { id: 'btn-recycle-close', className: 'xp-btn-close w-5 h-5 text-white text-[11px] flex items-center justify-center rounded-sm font-bold cursor-pointer', onClick: onClose }, '✕')
      ])
    ]),

    // Content List
    h('div', { key: 'list', className: 'flex-1 bg-white p-3 overflow-y-auto text-xs space-y-2 select-none' }, [
      h('div', { key: 'hdr', className: 'text-[11px] text-gray-500 mb-2' }, 'Deleted artifacts & legacy bugs:'),
      items.length === 0 ? h('div', { key: 'empty', className: 'h-32 flex flex-col items-center justify-center text-gray-400 space-y-2' }, [
        h('i', { className: 'fa-solid fa-circle-check text-2xl text-emerald-500' }),
        h('span', {}, 'The Recycle Bin is completely empty!')
      ]) : items.map(item => (
        h('div', {
          key: item.id,
          className: 'flex items-center justify-between p-1.5 hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded'
        }, [
          h('div', { className: 'flex items-center space-x-2' }, [
            h('i', { className: `${item.icon} text-lg` }),
            h('div', {}, [
              h('div', { className: 'font-bold text-gray-700' }, item.name),
              h('div', { className: 'text-[10px] text-gray-400' }, item.desc)
            ])
          ]),
          h('span', { className: `text-[10px] font-mono ${item.badgeColor}` }, item.badge)
        ])
      ))
    ]),

    // Footer
    h('div', { key: 'footer', className: 'bg-[#ece9d8] border-t border-[#aca899] p-2 flex justify-between items-center text-xs select-none' }, [
      h('span', { key: 'cnt', className: 'text-[11px] text-gray-600' }, `${items.length} discarded items`),
      h('button', {
        key: 'btn-empty',
        id: 'btn-empty-recycle',
        className: 'xp-btn-win px-2 py-0.5 rounded text-[11px] cursor-pointer',
        onClick: () => {
          setItems([]);
          onActionNotification('Recycle Bin emptied! All bugs and cold coffees permanently vaporized.');
        },
        disabled: items.length === 0
      }, 'Empty Recycle Bin')
    ])
  ]);
}

// --- 10. Start Menu Component ---
function StartMenu({ isOpen, onClose, onOpenWindow, onActionNotification, onReboot }) {
  if (!isOpen) return null;

  const mobile = isMobile();

  return h('div', {
    id: 'start-menu',
    className: `xp-start-menu absolute bottom-9 left-0 ${mobile ? 'w-full' : 'w-96'} bg-white z-40 flex flex-col overflow-hidden border-2 border-[#0055eb] select-none`,
    onClick: e => e.stopPropagation()
  }, [
    // Header
    h('div', { key: 'header', className: 'xp-start-header h-14 px-3 flex items-center space-x-3 text-white border-b border-blue-400' }, [
      h('div', { key: 'av', className: 'w-10 h-10 rounded-sm border-2 border-white/80 bg-orange-600 overflow-hidden flex items-center justify-center shadow' }, [
        h('i', { className: 'fa-solid fa-code text-xl text-amber-100' })
      ]),
      h('div', { key: 'user-title', className: 'flex flex-col' }, [
        h('span', { className: 'text-sm font-bold tracking-wide drop-shadow' }, 'Muhammad Mahrus Ali'),
        h('span', { className: 'text-[11px] text-blue-200 font-medium' }, 'Backend / Fullstack JavaScript Developer')
      ])
    ]),

    // Columns
    h('div', { key: 'body', className: `${mobile ? 'flex flex-col' : 'flex'} bg-white text-xs ${mobile ? 'min-h-0 overflow-y-auto' : 'min-h-[340px]'}` }, [
      // Left Column
      h('div', { key: 'col-l', className: `${mobile ? 'w-full border-b' : 'w-1/2 border-r'} p-2 flex flex-col justify-between border-[#95bdee]` }, [
        h('div', { key: 'items', className: 'space-y-1' }, [
          h('div', {
            key: 'p',
            id: 'start-item-projects',
            className: 'flex items-center space-x-2.5 p-1.5 hover:bg-[#2f71cd] hover:text-white rounded cursor-pointer group',
            onClick: () => { onOpenWindow('projects'); onClose(); }
          }, [
            h('img', { src: './assets/icons/projects.png', className: 'w-7 h-7 object-contain flex-shrink-0' }),
            h('div', {}, [
              h('div', { className: 'font-bold leading-tight' }, 'My Projects'),
              h('div', { className: 'text-[10px] text-gray-500 group-hover:text-blue-100' }, 'Showcase & Live Demos')
            ])
          ]),
          h('div', {
            key: 't',
            id: 'start-item-terminal',
            className: 'flex items-center space-x-2.5 p-1.5 hover:bg-[#2f71cd] hover:text-white rounded cursor-pointer group',
            onClick: () => { onOpenWindow('terminal'); onClose(); }
          }, [
            h('img', { src: './assets/icons/terminal.png', className: 'w-7 h-7 object-contain flex-shrink-0' }),
            h('div', {}, [
              h('div', { className: 'font-bold leading-tight' }, 'Command Prompt'),
              h('div', { className: 'text-[10px] text-gray-500 group-hover:text-blue-100' }, 'Interactive Terminal')
            ])
          ]),
          h('div', {
            key: 'n',
            id: 'start-item-notepad',
            className: 'flex items-center space-x-2.5 p-1.5 hover:bg-[#2f71cd] hover:text-white rounded cursor-pointer group',
            onClick: () => { onOpenWindow('notepad'); onClose(); }
          }, [
            h('img', { src: './assets/icons/notepad.png', className: 'w-7 h-7 object-contain flex-shrink-0' }),
            h('div', {}, [
              h('div', { className: 'font-bold leading-tight' }, 'about_me.txt'),
              h('div', { className: 'text-[10px] text-gray-500 group-hover:text-blue-100' }, 'Bio & Experience')
            ])
          ]),
          h('div', { key: 'sep', className: 'border-b border-gray-200 my-1' }),
          h('div', {
            key: 's',
            id: 'start-item-skills',
            className: 'flex items-center space-x-2.5 p-1.5 hover:bg-[#2f71cd] hover:text-white rounded cursor-pointer group',
            onClick: () => { onOpenWindow('skills'); onClose(); }
          }, [
            h('img', { src: './assets/icons/computer.png', className: 'w-6 h-6 object-contain flex-shrink-0 mr-0.5' }),
            h('span', { className: 'font-semibold text-[11px]' }, 'Tech Stack Specs')
          ]),
          h('div', {
            key: 'c',
            id: 'start-item-contact',
            className: 'flex items-center space-x-2.5 p-1.5 hover:bg-[#2f71cd] hover:text-white rounded cursor-pointer group',
            onClick: () => { onOpenWindow('contact'); onClose(); }
          }, [
            h('img', { src: './assets/icons/contact.png', className: 'w-6 h-6 object-contain flex-shrink-0 mr-0.5' }),
            h('span', { className: 'font-semibold text-[11px]' }, 'Send Email')
          ])
        ]),

        h('div', { key: 'all-prog', className: 'border-t border-[#95bdee] pt-2 mt-2' }, [
          h('div', {
            className: 'flex items-center justify-center space-x-2 py-1.5 bg-gray-50 hover:bg-[#2f71cd] hover:text-white rounded cursor-pointer font-bold text-center border border-gray-200',
            onClick: () => onActionNotification('Windows XP Professional Developer Edition Build 2600.xpsp_sp3')
          }, [
            h('span', {}, 'All Programs'),
            h('i', { className: 'fa-solid fa-caret-right text-green-600' })
          ])
        ])
      ]),

      // Right Column
      h('div', { key: 'col-r', className: `${mobile ? 'w-full' : 'w-1/2'} bg-[#d3e5fa] p-2 space-y-1 text-blue-950 font-semibold ${mobile ? 'border-t' : 'border-l'} border-white` }, [
        h('a', {
          key: 'cv',
          href: './cv-muhammad-mahrus-ali-backend.md',
          download: true,
          className: 'p-1.5 hover:bg-[#2f71cd] hover:text-white rounded cursor-pointer flex items-center space-x-2 block',
          onClick: () => { onActionNotification('Downloading CV: cv-muhammad-mahrus-ali-backend.md'); onClose(); }
        }, [
          h('i', { className: 'fa-solid fa-file-arrow-down text-red-600 text-sm' }),
          h('span', { className: 'text-[11px] font-bold' }, 'Download CV')
        ]),
        h('a', {
          key: 'gh',
          href: 'https://github.com/Alialkhozini',
          target: '_blank',
          rel: 'noreferrer',
          className: 'p-1.5 hover:bg-[#2f71cd] hover:text-white rounded cursor-pointer flex items-center space-x-2 block',
          onClick: onClose
        }, [
          h('i', { className: 'fa-brands fa-github text-gray-900 text-sm' }),
          h('span', { className: 'text-[11px] font-bold' }, 'GitHub Profile')
        ]),
        h('a', {
          key: 'li',
          href: 'https://www.linkedin.com/in/muhammad-mahrus-ali-1029a9299?utm_source=share_via&utm_content=profile&utm_medium=member_android',
          target: '_blank',
          rel: 'noreferrer',
          className: 'p-1.5 hover:bg-[#2f71cd] hover:text-white rounded cursor-pointer flex items-center space-x-2 block',
          onClick: onClose
        }, [
          h('i', { className: 'fa-brands fa-linkedin text-blue-700 text-sm' }),
          h('span', { className: 'text-[11px] font-bold' }, 'LinkedIn Network')
        ]),
        h('a', {
          key: 'email',
          href: 'mailto:muhammadmahrus2310@gmail.com',
          className: 'p-1.5 hover:bg-[#2f71cd] hover:text-white rounded cursor-pointer flex items-center space-x-2 block',
          onClick: onClose
        }, [
          h('i', { className: 'fa-solid fa-at text-emerald-600 text-sm' }),
          h('span', { className: 'text-[11px] font-bold' }, 'Email Me Directly')
        ]),
        h('div', { key: 'sep', className: 'border-b border-blue-200 my-1' }),
        h('div', {
          key: 'sys',
          className: 'p-1.5 hover:bg-[#2f71cd] hover:text-white rounded cursor-pointer flex items-center space-x-2',
          onClick: () => { onOpenWindow('skills'); onClose(); }
        }, [
          h('img', { src: './assets/icons/computer.png', className: 'w-4 h-4 object-contain' }),
          h('span', { className: 'text-[11px]' }, 'System Properties')
        ]),
        h('div', {
          key: 'rec',
          className: 'p-1.5 hover:bg-[#2f71cd] hover:text-white rounded cursor-pointer flex items-center space-x-2',
          onClick: () => { onOpenWindow('recycle'); onClose(); }
        }, [
          h('img', { src: './assets/icons/recycle-bin.png', className: 'w-4 h-4 object-contain' }),
          h('span', { className: 'text-[11px]' }, 'Recycle Bin')
        ])
      ])
    ]),

    // Footer
    h('div', { key: 'footer', className: 'xp-start-footer h-10 px-3 flex items-center justify-end space-x-4 text-white text-xs border-t border-blue-400' }, [
      h('button', {
        key: 'reboot',
        className: 'flex items-center space-x-1.5 hover:brightness-125 cursor-pointer',
        onClick: () => { onClose(); onReboot(); }
      }, [
        h('div', { className: 'w-5 h-5 bg-amber-500 rounded flex items-center justify-center text-white text-[11px] shadow' }, h('i', { className: 'fa-solid fa-rotate-left' })),
        h('span', { className: 'font-bold text-[11px]' }, 'Restart System')
      ]),
      h('button', {
        key: 'shutdown',
        className: 'flex items-center space-x-1.5 hover:brightness-125 cursor-pointer',
        onClick: () => { onClose(); onReboot(); }
      }, [
        h('div', { className: 'w-5 h-5 bg-red-600 rounded flex items-center justify-center text-white text-[11px] shadow' }, h('i', { className: 'fa-solid fa-power-off' })),
        h('span', { className: 'font-bold text-[11px]' }, 'Shut Down')
      ])
    ])
  ]);
}

// --- 11. Taskbar Component ---
function Taskbar({ windows, activeWindowId, isStartMenuOpen, onToggleStartMenu, onToggleTaskWindow, onOpenWindow, onActionNotification }) {
  const [timeStr, setTimeStr] = useState('');
  const [showVolumePopup, setShowVolumePopup] = useState(false);
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [volume, setVolume] = useState(soundManager.getVolume());
  const popupRef = useRef(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      setTimeStr(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleOutsideClick = e => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowVolumePopup(false);
      }
    };
    if (showVolumePopup) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showVolumePopup]);

  const taskItems = [
    { id: 'projects', label: 'My Projects', iconSrc: './assets/icons/projects.png' },
    { id: 'notepad', label: 'about_me.txt', iconSrc: './assets/icons/notepad.png' },
    { id: 'terminal', label: 'Command Prompt', iconSrc: './assets/icons/terminal.png' },
    { id: 'skills', label: 'Tech Stack Specs', iconSrc: './assets/icons/computer.png' },
    { id: 'contact', label: 'New Message', iconSrc: './assets/icons/contact.png' },
    { id: 'recycle', label: 'Recycle Bin', iconSrc: './assets/icons/recycle-bin.png' }
  ];

  return h(Fragment, {}, [
    // Volume Control Popup
    showVolumePopup && h('div', {
      ref: popupRef,
      id: 'xp-volume-slider-popup',
      className: 'fixed bottom-10 right-14 z-50 bg-[#ece9d8] border-2 border-[#0055eb] rounded-t-md p-2.5 shadow-2xl w-44 flex flex-col items-center select-none text-xs',
      onClick: e => e.stopPropagation()
    }, [
      h('div', { key: 'hdr', className: 'w-full text-center font-bold text-[11px] text-gray-800 border-b border-gray-400 pb-1 mb-2' }, 'Volume Control'),
      h('div', { key: 'slider', className: 'flex flex-col items-center my-1 w-full space-y-1' }, [
        h('span', { className: 'text-[10px] text-gray-600 font-semibold' }, `Master: ${isMuted ? 'Muted' : `${Math.round(volume * 100)}%`}`),
        h('input', {
          type: 'range',
          min: '0',
          max: '1',
          step: '0.05',
          value: isMuted ? 0 : volume,
          onChange: e => {
            const v = parseFloat(e.target.value);
            setVolume(v);
            soundManager.setVolume(v);
            if (isMuted) {
              setIsMuted(false);
              soundManager.setMuted(false);
            }
          },
          className: 'w-28 accent-blue-600 cursor-pointer'
        })
      ]),
      h('label', { key: 'mute-lbl', className: 'flex items-center space-x-1.5 mt-2 cursor-pointer text-[11px]' }, [
        h('input', {
          type: 'checkbox',
          checked: isMuted,
          onChange: () => {
            const nextMute = !isMuted;
            setIsMuted(nextMute);
            soundManager.setMuted(nextMute);
            if (!nextMute) soundManager.playDingSound();
          },
          className: 'cursor-pointer'
        }),
        h('span', { className: 'text-gray-800 font-semibold' }, 'Mute')
      ]),
      h('button', {
        key: 'play-btn',
        className: 'xp-btn-win text-[10px] px-2 py-1 mt-2.5 rounded-sm w-full flex items-center justify-center gap-1.5 cursor-pointer font-semibold',
        onClick: () => {
          soundManager.setMuted(false);
          setIsMuted(false);
          soundManager.playStartupSound();
        }
      }, [
        h('i', { className: 'fa-solid fa-play text-[9px] text-blue-700' }),
        h('span', {}, 'Play Startup Sound')
      ])
    ]),

    // Main Taskbar
    h('div', {
      id: 'xp-taskbar',
      className: 'xp-taskbar h-9 w-full flex justify-between items-stretch z-30 select-none shadow-md fixed bottom-0 left-0'
    }, [
      h('div', { key: 'left-bar', className: 'flex items-center h-full overflow-hidden' }, [
        // Start Button
        h('button', {
          id: 'start-btn',
          className: `xp-start-button h-full px-4 flex items-center space-x-2 text-white transition active:scale-[0.98] cursor-pointer ${isStartMenuOpen ? 'brightness-95' : ''}`,
          onClick: e => {
            e.stopPropagation();
            onToggleStartMenu();
          }
        }, [
          h('div', { key: 'logo', className: 'grid grid-cols-2 gap-0.5 w-4 h-4 transform -rotate-6' }, [
            h('div', { key: 'r', className: 'bg-[#e03d15] rounded-tl-sm' }),
            h('div', { key: 'g', className: 'bg-[#58a825] rounded-tr-sm' }),
            h('div', { key: 'b', className: 'bg-[#0074e8] rounded-bl-sm' }),
            h('div', { key: 'y', className: 'bg-[#ffba00] rounded-br-sm' })
          ]),
          h('span', { key: 'txt', className: 'font-bold italic text-base tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] pr-1' }, 'start')
        ]),
        h('div', { key: 'sep', className: 'h-6 border-r border-blue-400 mx-2' }),

        // Running Tasks List
        h('div', { key: 'tasks', className: 'flex items-center space-x-1 h-full py-1 overflow-x-auto flex-1 min-w-0' }, taskItems.map(item => {
          const win = windows[item.id];
          if (!win || !win.isOpen) return null;
          const isCurrentActive = activeWindowId === item.id && !win.isMinimized;
          const mobile = isMobile();
          return h('button', {
            key: item.id,
            id: `task-${item.id}`,
            className: `xp-task-item h-full ${mobile ? 'px-1.5' : 'px-2.5'} flex items-center space-x-1.5 text-white rounded-sm ${mobile ? 'max-w-[100px]' : 'max-w-[170px]'} transition text-left truncate cursor-pointer ${isCurrentActive ? 'active' : ''}`,
            onClick: () => onToggleTaskWindow(item.id)
          }, [
            h('img', { src: item.iconSrc, alt: item.label, className: `${mobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} object-contain flex-shrink-0` }),
            !mobile && h('span', { className: 'text-xs truncate font-medium drop-shadow' }, item.label)
          ]);
        }))
      ]),

      // System Tray
      h('div', { key: 'tray', className: 'xp-tray h-full px-3 flex items-center space-x-3 text-white flex-shrink-0' }, [
        // Availability Pill
        h('div', {
          key: 'avail',
          id: 'tray-availability-badge',
          className: 'flex items-center space-x-1.5 px-2 py-0.5 bg-emerald-700/80 hover:bg-emerald-600 rounded border border-emerald-400/60 text-[10px] font-bold text-white cursor-pointer shadow-sm',
          onClick: () => onOpenWindow('contact'),
          title: 'Status: Open to Work - Click to send a message'
        }, [
          h('span', { className: 'w-2 h-2 rounded-full bg-green-300 animate-pulse' }),
          h('span', {}, 'Available for hire')
        ]),

        // Tray Icons
        h('div', { key: 'icons', className: 'flex items-center space-x-2.5 text-xs text-sky-100' }, [
          h('i', {
            key: 'shield',
            className: 'fa-solid fa-shield-halved text-emerald-400 text-xs hover:text-white cursor-pointer',
            title: 'Portfolio Security: Protected & SSL Active',
            onClick: () => onActionNotification('Security Center: All defenses active and verified.')
          }),
          h('i', {
            key: 'net',
            className: 'fa-solid fa-network-wired text-blue-200 text-xs hover:text-white cursor-pointer',
            title: 'Connected: 1000 Mbps Fiber Optical',
            onClick: () => onActionNotification('Network Connection: Connected at 1.0 Gbps (Signal Strength: Excellent)')
          }),
          h('i', {
            key: 'vol',
            id: 'tray-volume-icon',
            className: `${isMuted ? 'fa-solid fa-volume-xmark text-red-300' : 'fa-solid fa-volume-high text-amber-100'} text-xs hover:text-white cursor-pointer transition`,
            title: isMuted ? 'Sound Muted - Click to configure' : `Volume: ${Math.round(volume * 100)}% - Click to configure`,
            onClick: e => {
              e.stopPropagation();
              setShowVolumePopup(prev => !prev);
            }
          })
        ]),

        // Clock
        h('div', { key: 'clk', id: 'live-clock', className: 'text-xs font-medium text-white tracking-wide pl-1 min-w-[55px] text-right' }, timeStr || '8:56 PM')
      ])
    ])
  ]);
}

// --- 12. Balloon Tooltip Notification Component ---
function BalloonTip({ message, onDismiss }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onDismiss]);

  if (!message) return null;

  return h('div', {
    id: 'xp-balloon-tip',
    className: 'fixed bottom-11 right-4 z-50 bg-[#ffffe1] border border-[#000000] rounded p-2.5 shadow-lg max-w-xs text-xs text-gray-900 select-none animate-in fade-in slide-in-from-bottom-2 duration-200',
    style: { boxShadow: '2px 2px 5px rgba(0,0,0,0.4)' }
  }, [
    h('div', { key: 'hdr', className: 'flex items-start justify-between gap-2 border-b border-gray-300 pb-1 mb-1.5' }, [
      h('div', { className: 'flex items-center space-x-1.5 text-blue-900 font-bold text-[11px]' }, [
        h('i', { className: 'fa-solid fa-circle-info text-blue-600 text-sm' }),
        h('span', {}, 'Windows XP Notification')
      ]),
      h('button', {
        className: 'text-gray-500 hover:text-black font-bold text-xs cursor-pointer px-1 leading-none',
        onClick: onDismiss
      }, '✕')
    ]),
    h('div', { key: 'msg', className: 'text-[11px] leading-relaxed text-gray-800' }, message)
  ]);
}

// --- 13. Main App Desktop Environment ---
function PortfolioApp() {
  const [showBootScreen, setShowBootScreen] = useState(true);
  const [showLogonScreen, setShowLogonScreen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [topZIndex, setTopZIndex] = useState(30);
  const [notificationMsg, setNotificationMsg] = useState(null);

  const [windows, setWindows] = useState({
    projects: { id: 'projects', title: 'My Projects - Windows Explorer', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 30, position: { x: 224, y: 32 } },
    notepad: { id: 'notepad', title: 'about_me.txt - Notepad', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 25, position: { x: 288, y: 80 } },
    terminal: { id: 'terminal', title: 'Command Prompt', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 25, position: { x: 320, y: 112 } },
    skills: { id: 'skills', title: 'System Properties', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 25, position: { x: 240, y: 56 } },
    contact: { id: 'contact', title: 'New Message', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 25, position: { x: 288, y: 80 } },
    recycle: { id: 'recycle', title: 'Recycle Bin', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 25, position: { x: 384, y: 112 } }
  });

  const dragRef = useRef({ isDragging: false, windowId: null, offsetX: 0, offsetY: 0 });

  // Auto transition from boot screen
  const dismissBoot = () => {
    setShowBootScreen(false);
    setShowLogonScreen(true);
  };

  const handleLogin = () => {
    soundManager.playStartupSound();
    setShowLogonScreen(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      dismissBoot();
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  // Global mouse drag handling
  useEffect(() => {
    const handleMouseMove = e => {
      if (!dragRef.current.isDragging || !dragRef.current.windowId) return;
      const id = dragRef.current.windowId;
      const x = e.clientX - dragRef.current.offsetX;
      let y = e.clientY - dragRef.current.offsetY;
      if (y < 0) y = 0;
      if (y > window.innerHeight - 70) y = window.innerHeight - 70;

      setWindows(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          position: { x, y }
        }
      }));
    };

    const handleMouseUp = () => {
      dragRef.current.isDragging = false;
      dragRef.current.windowId = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const triggerNotification = msg => {
    setNotificationMsg(msg);
    soundManager.playNotificationSound();
  };

  const bringToFront = id => {
    setTopZIndex(prev => {
      const nextZ = prev + 1;
      setWindows(curr => ({
        ...curr,
        [id]: {
          ...curr[id],
          zIndex: nextZ,
          isMinimized: false
        }
      }));
      return nextZ;
    });
    setActiveWindowId(id);
  };

  const openWindow = id => {
    soundManager.playOpenSound();
    setWindows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: true,
        isMinimized: false
      }
    }));
    bringToFront(id);
  };

  const closeWindow = id => {
    soundManager.playCloseSound();
    setWindows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: false
      }
    }));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const minimizeWindow = id => {
    soundManager.playMinimizeSound();
    setWindows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMinimized: true
      }
    }));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const toggleMaximizeWindow = id => {
    const isMax = windows[id].isMaximized;
    if (isMax) {
      soundManager.playMinimizeSound();
    } else {
      soundManager.playMaximizeSound();
    }
    setWindows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMaximized: !prev[id].isMaximized
      }
    }));
    bringToFront(id);
  };

  const toggleTaskWindow = id => {
    if (windows[id].isMinimized) {
      soundManager.playOpenSound();
      bringToFront(id);
    } else if (activeWindowId === id) {
      minimizeWindow(id);
    } else {
      soundManager.playOpenSound();
      bringToFront(id);
    }
  };

  const startDragging = (id, e) => {
    const win = windows[id];
    if (win.isMaximized) return;
    bringToFront(id);
    dragRef.current = {
      isDragging: true,
      windowId: id,
      offsetX: e.clientX - win.position.x,
      offsetY: e.clientY - win.position.y
    };
    e.preventDefault();
  };

  return h('div', {
    id: 'xp-desktop-environment',
    className: 'w-screen h-screen overflow-hidden m-0 p-0 select-none bg-black text-[#0c0c0c] relative'
  }, [
    // Boot Screen
    h(BootScreen, { key: 'boot', isVisible: showBootScreen, onDismiss: dismissBoot }),

    // Logon Screen
    h(LogonScreen, { key: 'logon', isVisible: showLogonScreen, onLogin: handleLogin }),

    // Desktop Workspace
    h('div', {
      key: 'workspace',
      id: 'desktop-workspace',
      className: 'relative w-full h-full bg-cover bg-center overflow-hidden flex flex-col justify-between',
      style: { backgroundImage: `url('${WALLPAPER_URL}')` },
      onClick: () => {
        setSelectedIcon(null);
        setIsStartMenuOpen(false);
      }
    }, [
      // Desktop Icons
      h(DesktopIcons, {
        key: 'icons',
        selectedIcon,
        onSelectIcon: id => setSelectedIcon(id),
        onOpenWindow: openWindow
      }),

      // Windows
      h(ProjectsWindow, {
        key: 'win-projects',
        windowState: windows.projects,
        isActive: activeWindowId === 'projects',
        onBringToFront: () => bringToFront('projects'),
        onClose: () => closeWindow('projects'),
        onMinimize: () => minimizeWindow('projects'),
        onToggleMaximize: () => toggleMaximizeWindow('projects'),
        onOpenWindow: openWindow,
        onStartDrag: e => startDragging('projects', e),
        onActionNotification: triggerNotification
      }),

      h(NotepadWindow, {
        key: 'win-notepad',
        windowState: windows.notepad,
        isActive: activeWindowId === 'notepad',
        onBringToFront: () => bringToFront('notepad'),
        onClose: () => closeWindow('notepad'),
        onMinimize: () => minimizeWindow('notepad'),
        onToggleMaximize: () => toggleMaximizeWindow('notepad'),
        onStartDrag: e => startDragging('notepad', e),
        onActionNotification: triggerNotification
      }),

      h(TerminalWindow, {
        key: 'win-terminal',
        windowState: windows.terminal,
        isActive: activeWindowId === 'terminal',
        onBringToFront: () => bringToFront('terminal'),
        onClose: () => closeWindow('terminal'),
        onMinimize: () => minimizeWindow('terminal'),
        onToggleMaximize: () => toggleMaximizeWindow('terminal'),
        onOpenWindow: openWindow,
        onStartDrag: e => startDragging('terminal', e)
      }),

      h(SkillsWindow, {
        key: 'win-skills',
        windowState: windows.skills,
        isActive: activeWindowId === 'skills',
        onBringToFront: () => bringToFront('skills'),
        onClose: () => closeWindow('skills'),
        onStartDrag: e => startDragging('skills', e),
        onActionNotification: triggerNotification
      }),

      h(ContactWindow, {
        key: 'win-contact',
        windowState: windows.contact,
        isActive: activeWindowId === 'contact',
        onBringToFront: () => bringToFront('contact'),
        onClose: () => closeWindow('contact'),
        onMinimize: () => minimizeWindow('contact'),
        onStartDrag: e => startDragging('contact', e),
        onActionNotification: triggerNotification
      }),

      h(RecycleBinWindow, {
        key: 'win-recycle',
        windowState: windows.recycle,
        isActive: activeWindowId === 'recycle',
        onBringToFront: () => bringToFront('recycle'),
        onClose: () => closeWindow('recycle'),
        onStartDrag: e => startDragging('recycle', e),
        onActionNotification: triggerNotification
      }),

      // Start Menu
      h(StartMenu, {
        key: 'startmenu',
        isOpen: isStartMenuOpen,
        onClose: () => setIsStartMenuOpen(false),
        onOpenWindow: openWindow,
        onActionNotification: triggerNotification,
        onReboot: () => {
          setShowBootScreen(true);
          setIsStartMenuOpen(false);
          setTimeout(() => {
            setShowBootScreen(false);
            setShowLogonScreen(true);
          }, 2400);
        }
      }),

      // Taskbar
      h(Taskbar, {
        key: 'taskbar',
        windows,
        activeWindowId,
        isStartMenuOpen,
        onToggleStartMenu: () => setIsStartMenuOpen(prev => !prev),
        onToggleTaskWindow: toggleTaskWindow,
        onOpenWindow: openWindow,
        onActionNotification: triggerNotification
      }),

      // Balloon Notification
      h(BalloonTip, {
        key: 'balloon',
        message: notificationMsg,
        onDismiss: () => setNotificationMsg(null)
      })
    ])
  ]);
}

// Render root
ReactDOM.createRoot(document.getElementById('root')).render(h(React.StrictMode, {}, h(PortfolioApp)));
