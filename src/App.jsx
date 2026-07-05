import React, { useState, useEffect, useRef } from 'react';
import './index.css';

const IconCalendar = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3.5" y="5" width="17" height="16" rx="2" />
    <path d="M8 3v4M16 3v4M3.5 10h17" />
  </svg>
);
const IconClock = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);
const IconPin = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21s7-6.4 7-11.5A7 7 0 0 0 5 9.5C5 14.6 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.4" />
  </svg>
);
const IconRing = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <circle cx="9" cy="13" r="6" />
    <circle cx="15" cy="13" r="6" />
  </svg>
);
const ArchOrnament = () => (
  <svg width="100" height="38" viewBox="0 0 100 38" fill="none" aria-hidden="true">
    <path d="M2 30c14 0 20-24 48-24s34 24 48 24" stroke="var(--gold)" strokeWidth="1.2" />
    <circle cx="50" cy="6" r="3" fill="var(--gold)" />
  </svg>
);

function App() {
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', mins: '00', secs: '00' });
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isIntroEnded, setIsIntroEnded] = useState(false);

  // Intersection Observer for scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.12 });
    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [isIntroEnded]);

  // Countdown timer
  useEffect(() => {
    const weddingDate = new Date('2026-07-30T11:30:00');
    const tick = () => {
      const diff = weddingDate - new Date();
      if (diff <= 0) return;
      const pad = (n) => String(Math.floor(n)).padStart(2, '0');
      setTimeLeft({
        days: pad(diff / 86400000),
        hours: pad((diff % 86400000) / 3600000),
        mins: pad((diff % 3600000) / 60000),
        secs: pad((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Lock scroll while intro is showing
  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, []);

  // 3D pointer tilt on the invitation card
  const cardRef = useRef(null);
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleCardMove = (e) => {
    if (reduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    const px = (point.clientX - rect.left) / rect.width;
    const py = (point.clientY - rect.top) / rect.height;
    const ry = (px - 0.5) * 16;
    const rx = (0.5 - py) * 12;
    cardRef.current.style.setProperty('--rx', `${rx}deg`);
    cardRef.current.style.setProperty('--ry', `${ry}deg`);
    cardRef.current.style.setProperty('--glow-x', `${px * 100}%`);
    cardRef.current.style.setProperty('--glow-y', `${py * 100}%`);
  };
  const handleCardLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--rx', '0deg');
    cardRef.current.style.setProperty('--ry', '0deg');
  };

  // Ambient gold sparkle field behind the card
  const sparkleRef = useRef(null);
  useEffect(() => {
    const canvas = sparkleRef.current;
    if (!canvas || reduceMotion) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    const dots = Array.from({ length: 36 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.3 + 0.4,
      s: Math.random() * 0.5 + 0.15,
      p: Math.random() * Math.PI * 2,
    }));
    const draw = (t) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const d of dots) {
        const a = ((Math.sin(t * 0.001 * d.s + d.p) + 1) / 2) * 0.55 + 0.1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(236,205,142,${a.toFixed(3)})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [reduceMotion]);

  const handleTap = () => {
    if (isEnvelopeOpen) return;
    setIsEnvelopeOpen(true);
    // Short delay for flap open animation, then go straight to main page
    setTimeout(() => {
      setIsRevealed(true);
      document.body.classList.remove('no-scroll');
      setTimeout(() => setIsIntroEnded(true), 700);
    }, 600);
  };

  return (
    <>
      {/* ── Envelope Intro ── */}
      {!isIntroEnded && (
        <div
          className={`env-intro ${isRevealed ? 'env-intro--out' : ''}`}
          onClick={handleTap}
          onTouchStart={handleTap}
        >
          {/* Envelope flap — flips open on tap */}
          <div className={`env-flap ${isEnvelopeOpen ? 'env-flap--open' : ''}`}>
            <div className="env-flap-front">
              <svg className="env-flap-crease" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0 0 L50 100 L100 0" fill="none" stroke="#8c6c35" strokeWidth="0.5" opacity="0.4" />
                <path d="M0.6 0.6 L50 98.7 L99.4 0.6" fill="none" stroke="#fff8e8" strokeWidth="0.4" opacity="0.5" />
              </svg>
            </div>
            <div className="env-flap-back" />
          </div>

          {/* Top calligraphy */}
          <div className="env-header">
            <div className="env-header-line" />
            <p className="env-eyebrow">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
            <div className="env-header-line" />
          </div>

          {/* Wax-seal tap button */}
          <button
            type="button"
            className={`env-seal-btn ${isEnvelopeOpen ? 'env-seal-btn--pressed' : ''}`}
            aria-label="Tap to open the invitation"
          >
            <svg width="132" height="132" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="wg" cx="35%" cy="28%" r="72%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="40%" stopColor="#f8f0dc" />
                  <stop offset="75%" stopColor="#ecdbb8" />
                  <stop offset="100%" stopColor="#d4b87a" />
                </radialGradient>
                <radialGradient id="wg2" cx="40%" cy="35%" r="60%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </radialGradient>
                <filter id="wf" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="7" floodColor="#6b4f1e" floodOpacity="0.35" />
                </filter>
              </defs>
              {/* Wavy wax blob */}
              <path
                d="M90 10 C106 6 122 14 134 24 C148 36 158 52 158 68 C160 82 162 96 156 110 C150 126 140 140 126 150 C112 160 96 168 80 166 C64 164 48 156 36 144 C22 130 12 112 10 94 C8 76 14 58 26 44 C38 30 56 16 74 11 Z"
                fill="url(#wg)"
                filter="url(#wf)"
              />
              {/* Specular highlight */}
              <path
                d="M90 10 C106 6 122 14 134 24 C148 36 158 52 158 68 C160 82 162 96 156 110 C150 126 140 140 126 150 C112 160 96 168 80 166 C64 164 48 156 36 144 C22 130 12 112 10 94 C8 76 14 58 26 44 C38 30 56 16 74 11 Z"
                fill="url(#wg2)"
              />
              {/* Inner rings */}
              <circle cx="90" cy="90" r="64" fill="none" stroke="#c09a58" strokeWidth="1.5" opacity="0.7" />
              <circle cx="90" cy="90" r="58" fill="none" stroke="#c09a58" strokeWidth="0.6" strokeDasharray="2 3.5" opacity="0.5" />
              {/* Engraved label */}
              <text x="90" y="86" fontFamily="'Cinzel', serif" fontSize="21" fontWeight="600" letterSpacing="2" fill="#8c6c35" textAnchor="middle" opacity="0.92">TAP</text>
              <text x="90" y="108" fontFamily="'Cinzel', serif" fontSize="15" letterSpacing="1.5" fill="#8c6c35" textAnchor="middle" opacity="0.85">TO OPEN</text>
              <path d="M74 96 q16 8 32 0" stroke="#8c6c35" strokeWidth="1" fill="none" opacity="0.6" />
            </svg>
          </button>

          <svg className="env-flourish" viewBox="0 0 140 24" aria-hidden="true">
            <path d="M2 12h44M94 12h44" stroke="var(--gold)" strokeWidth="1" />
            <path d="M46 12c6-10 14-10 20 0 6 10 14 10 20 0" stroke="var(--gold)" strokeWidth="1" fill="none" />
          </svg>

          {/* Bottom info */}
          <div className="env-footer">
            <p className="env-invited">You Are Invited <span className="env-invited-heart">♥</span></p>
            <p className="env-names-line">
              <em className="env-disp-title">Dr.</em> Afzal Abdul Azeez <span className="env-disp-sep">&amp;</span> Hafeesha K H
            </p>
            <p className="env-disp-date">Nikah · Thursday, 30 July 2026</p>
          </div>
        </div>
      )}

      {/* ── Hero: coded invitation card ── */}
      <section id="hero">
        <canvas className="hero-sparkles" ref={sparkleRef} aria-hidden="true" />
        <div className={`hero-card-wrap ${isRevealed ? 'hero-card-wrap--in' : ''}`}>
        <div
          className="invite-card"
          ref={cardRef}
          onMouseMove={handleCardMove}
          onMouseLeave={handleCardLeave}
          onTouchMove={handleCardMove}
          onTouchEnd={handleCardLeave}
        >
          <div className="ic-glow" aria-hidden="true" />
          <svg className="ic-frame" viewBox="0 0 100 150" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="ic-goldline" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#8c6c35" />
                <stop offset=".5" stopColor="#eccd8e" />
                <stop offset="1" stopColor="#8c6c35" />
              </linearGradient>
            </defs>
            <path d="M50 2 C22 2 8 15 8 38 L8 148 M50 2 C78 2 92 15 92 38 L92 148" />
          </svg>

          <svg className="ic-lantern ic-lantern--left" viewBox="0 0 24 40" fill="none" aria-hidden="true">
            <line x1="12" y1="0" x2="12" y2="6" stroke="#8c6c35" strokeWidth="1.4" />
            <path d="M6 6h12l-2 4H8z" fill="#af8f56" />
            <rect x="7" y="10" width="10" height="16" rx="2" fill="#eccd8e" stroke="#8c6c35" strokeWidth="1" />
            <circle cx="12" cy="18" r="3" fill="#fff4d6" />
            <path d="M8 26h8l-2 4h-4z" fill="#af8f56" />
          </svg>
          <svg className="ic-lantern ic-lantern--right" viewBox="0 0 24 40" fill="none" aria-hidden="true">
            <line x1="12" y1="0" x2="12" y2="6" stroke="#8c6c35" strokeWidth="1.4" />
            <path d="M6 6h12l-2 4H8z" fill="#af8f56" />
            <rect x="7" y="10" width="10" height="16" rx="2" fill="#eccd8e" stroke="#8c6c35" strokeWidth="1" />
            <circle cx="12" cy="18" r="3" fill="#fff4d6" />
            <path d="M8 26h8l-2 4h-4z" fill="#af8f56" />
          </svg>

          <svg className="ic-floral ic-floral--tl" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <path d="M4 4 C18 6 28 14 32 28" stroke="#af8f56" strokeWidth="1.2" opacity="0.7" />
            <circle cx="10" cy="10" r="5" fill="#c08768" opacity="0.55" />
            <circle cx="18" cy="16" r="3.2" fill="#d9c5a3" opacity="0.8" />
            <circle cx="26" cy="24" r="2.4" fill="#af8f56" opacity="0.6" />
          </svg>
          <svg className="ic-floral ic-floral--tr" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <path d="M4 4 C18 6 28 14 32 28" stroke="#af8f56" strokeWidth="1.2" opacity="0.7" />
            <circle cx="10" cy="10" r="5" fill="#c08768" opacity="0.55" />
            <circle cx="18" cy="16" r="3.2" fill="#d9c5a3" opacity="0.8" />
            <circle cx="26" cy="24" r="2.4" fill="#af8f56" opacity="0.6" />
          </svg>

          <div className="ic-content">
            <svg className="ic-rings" style={{ '--d': '.05s' }} viewBox="0 0 40 40" aria-hidden="true">
              <g className="ic-rings-spin">
                <circle cx="16" cy="20" r="9" />
                <circle cx="24" cy="20" r="9" />
              </g>
            </svg>

            <p className="ic-eyebrow" style={{ '--d': '.15s' }}>
              &ldquo;In the name of Allah,<br />the Most Gracious and the Most Merciful&rdquo;
            </p>

            <p className="ic-hosts" style={{ '--d': '.22s' }}>Mr. Abdul Azeez &amp; Mrs. Nazeema</p>
            <p className="ic-subtext" style={{ '--d': '.28s' }}>
              Anjilimoottil, K.S.Puram P.O., Karunagappally<br />
              Ph: 7034741483, 8089944183
            </p>

            <div className="ic-divider" style={{ '--d': '.34s' }}>
              <svg viewBox="0 0 24 24"><path d="M12 2c3 4 3 8 0 12-3-4-3-8 0-12z" fill="#af8f56" /></svg>
            </div>

            <p className="ic-lede" style={{ '--d': '.4s' }}>
              We cordially invite your esteemed presence with family<br />
              for the marriage ceremony of our son
            </p>

            <div className="ic-couple" style={{ '--d': '.48s' }}>
              <span className="name">Dr. Afzal Abdul Azeez</span>
              <span className="ic-amp">&amp;</span>
              <span className="name">Hafeesha K&nbsp;H</span>
            </div>

            <p className="ic-bride-meta" style={{ '--d': '.54s' }}>
              D/O. Mr. K. Haneefa &amp; Mrs. Shemitha P.S<br />
              Kallathanikkal (H), Thiruvilwamala, Thrissur
            </p>

            <div className="ic-divider" style={{ '--d': '.6s' }}>
              <svg viewBox="0 0 24 24"><path d="M12 2c3 4 3 8 0 12-3-4-3-8 0-12z" fill="#af8f56" /></svg>
            </div>

            <p className="ic-insha" style={{ '--d': '.66s' }}>Insha&rsquo;Allah on</p>

            <div className="ic-date" style={{ '--d': '.72s' }}>
              <div className="ic-month">JULY</div>
              <div className="ic-dayline">
                <span className="ic-day">THURSDAY</span>
                <span className="ic-num">30</span>
                <span className="ic-time">11:30 Noon</span>
              </div>
              <div className="ic-year">2026</div>
              <div className="ic-hijri">(Safar 16, 1448)</div>
            </div>

            <div style={{ '--d': '.78s' }}>
              <p className="ic-venue-tag">Venue</p>
              <p className="ic-venue-name">ASCO Convention Centre<br />Ottappalam</p>
            </div>
          </div>

          <div className="ic-reception">
            <p className="ic-r-tag">Reception</p>
            <p className="ic-r-date">3 August 2026</p>
            <p className="ic-r-venue">Oryx Convention Centre<br />Manjadi Junction, Oachira</p>
            <p className="ic-r-time">Between 5:30 PM &amp; 9:00 PM</p>
            <p className="ic-share">
              Sharing the happiness<br />
              <span className="names">Afnan &amp; Althaf</span>
            </p>
          </div>
        </div>
        </div>

        <button
          type="button"
          className="hero-discover"
          onClick={() => document.getElementById('countdown').scrollIntoView({ behavior: 'smooth' })}
        >
          Celebration Details
        </button>
      </section>

      {/* ── Countdown ── */}
      <section id="countdown">
        <p className="cd-eyebrow">COUNTING DOWN TO OUR BIG DAY</p>
        <div className="cd-script">Together Forever</div>
        <div className="countdown-grid">
          <div className="cd-item"><span className="cd-num">{timeLeft.days}</span><span className="cd-unit">DAYS</span></div>
          <div className="cd-item"><span className="cd-num">{timeLeft.hours}</span><span className="cd-unit">HOURS</span></div>
          <div className="cd-item"><span className="cd-num">{timeLeft.mins}</span><span className="cd-unit">MINUTES</span></div>
          <div className="cd-item"><span className="cd-num">{timeLeft.secs}</span><span className="cd-unit">SECONDS</span></div>
        </div>
        <div className="cd-stars">✦ ✦ ✦</div>
      </section>

      {/* ── Details ── */}
      <section id="details">
        <div className="sec-hd">
          <p className="sec-eye reveal">THE OCCASION</p>
          <h2 className="sec-ttl reveal rd1">Event Details</h2>
          <div className="sec-orn reveal rd2"><span className="ol" /><span className="od" /><span className="ol" /></div>
        </div>
        <div className="details-card reveal">
          <article className="detail-item reveal rd1">
            <div className="detail-icon"><IconCalendar /></div>
            <div className="detail-body">
              <span className="detail-label">Date</span>
              <p className="detail-value">Thursday, 30th July 2026<br /><span style={{ fontSize: '0.8em', color: 'var(--textmid)' }}>Safar 16, 1448</span></p>
            </div>
          </article>
          <article className="detail-item reveal rd2">
            <div className="detail-icon"><IconClock /></div>
            <div className="detail-body">
              <span className="detail-label">Nikah</span>
              <p className="detail-value">11:30 AM Noon</p>
            </div>
          </article>
          <article className="detail-item detail-item--last reveal rd3">
            <div className="detail-icon"><IconPin /></div>
            <div className="detail-body">
              <span className="detail-label">Venue</span>
              <p className="detail-value">ASCO Convention Centre<br />Ottappalam</p>
            </div>
          </article>
        </div>

        <div className="details-card reveal" style={{ marginTop: '1rem' }}>
          <article className="detail-item reveal rd1">
            <div className="detail-icon"><IconRing /></div>
            <div className="detail-body">
              <span className="detail-label">Reception</span>
              <p className="detail-value">Monday, 3rd August 2026<br />Between 5:30 PM &amp; 9:00 PM</p>
            </div>
          </article>
          <article className="detail-item detail-item--last reveal rd2">
            <div className="detail-icon"><IconPin /></div>
            <div className="detail-body">
              <span className="detail-label">Venue</span>
              <p className="detail-value">Oryx Convention Centre<br />Manjadi Junction, Oachira</p>
            </div>
          </article>
        </div>
      </section>

      {/* ── Venue ── */}
      <section id="venue">
        <div className="sec-hd">
          <p className="sec-eye reveal">FIND YOUR WAY</p>
          <h2 className="sec-ttl reveal rd1">Venues</h2>
          <div className="sec-orn reveal rd2"><span className="ol" /><span className="od" /><span className="ol" /></div>
        </div>

        <p className="vname reveal">ASCO Convention Centre<br /><span style={{ fontSize: '0.75em', color: 'var(--textmid)', fontStyle: 'normal' }}>Nikah &amp; Wedding · Ottappalam</span></p>
        <div className="map-box reveal">
          <iframe src="https://maps.google.com/maps?q=ASCO+Convention+Centre+Ottappalam&output=embed" allowFullScreen loading="lazy" title="ASCO Convention Centre map" />
        </div>
        <a className="map-btn reveal" href="https://maps.google.com/maps?q=ASCO+Convention+Centre+Ottappalam" target="_blank" rel="noopener noreferrer">
          📍 &nbsp;GET DIRECTIONS ON GOOGLE MAPS
        </a>

        <p className="vname reveal" style={{ marginTop: '2.4rem' }}>Oryx Convention Centre<br /><span style={{ fontSize: '0.75em', color: 'var(--textmid)', fontStyle: 'normal' }}>Reception · Manjadi Junction, Oachira</span></p>
        <div className="map-box reveal">
          <iframe src="https://maps.google.com/maps?q=Oryx+Convention+Centre+Manjadi+Junction+Oachira&output=embed" allowFullScreen loading="lazy" title="Oryx Convention Centre map" />
        </div>
        <a className="map-btn reveal" href="https://maps.google.com/maps?q=Oryx+Convention+Centre+Manjadi+Junction+Oachira" target="_blank" rel="noopener noreferrer">
          📍 &nbsp;GET DIRECTIONS ON GOOGLE MAPS
        </a>
      </section>

      {/* ── Closing ── */}
      <section id="closing">
        <p className="cl-bism reveal">﷽</p>
        <p className="cl-ayah reveal">"And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy."</p>
        <p className="cl-cite reveal">— Quran 30:21</p>

        <div className="cl-arch reveal"><ArchOrnament /></div>

        <div className="cl-script reveal">Dr. Afzal Abdul Azeez <span className="cl-amp">&amp;</span> Hafeesha K H</div>
        <div className="cl-parentage reveal">
          <span>Afzal Abdul Azeez <span className="parent-note">(S/o Mr. Abdul Azeez &amp; Mrs. Nazeema)</span></span>
          <span className="parent-amp">&amp;</span>
          <span>Hafeesha K H <span className="parent-note">(D/o Mr. K. Haneefa &amp; Mrs. Shemitha P.S)</span></span>
        </div>
        <p className="cl-sub reveal">TOGETHER WITH THEIR FAMILIES</p>
        <p className="cl-body reveal">
          Joyfully invite you to witness<br />
          the blessed union of our Nikah.<br /><br />
          Your presence, heartfelt prayers &amp;<br />
          warm blessings are the greatest gift<br />
          you could bring to this beautiful day.<br /><br />
          <strong>Thursday, 30th July 2026</strong><br />
          <strong>11:30 AM · ASCO Convention Centre</strong><br />
          <span style={{ fontSize: '0.9em' }}>Ottappalam</span><br /><br />
          <strong>Reception · Monday, 3rd August 2026</strong><br />
          <strong>5:30 PM – 9:00 PM · Oryx Convention Centre</strong><br />
          <span style={{ fontSize: '0.9em' }}>Manjadi Junction, Oachira</span>
        </p>

        <div className="dua-box reveal">
          <p>
            May Allah bless this sacred union<br />
            with boundless love, mercy,<br />
            and eternal happiness.
            <span className="dua-aameen">Aameen.</span>
          </p>
        </div>

        <p className="cl-hosts reveal">
          Mr. Abdul Azeez &amp; Mrs. Nazeema<br />
          Anjilimoottil, K.S.Puram P.O., Karunagappally<br />
          Ph: 7034741483, 8089944183
        </p>

        <p className="cl-share reveal">
          Sharing the happiness<br />
          <span className="cl-share-names">Afnan &amp; Althaf</span>
        </p>
      </section>

      <footer>
        <p>
          🤍 &nbsp; DR. AFZAL ABDUL AZEEZ &amp; HAFEESHA K H &nbsp; 🤍<br />
          NIKAH · THURSDAY 30 JULY 2026 · 11:30 AM · ASCO CONVENTION CENTRE, OTTAPPALAM<br />
          RECEPTION · MONDAY 3 AUGUST 2026 · 5:30–9:00 PM · ORYX CONVENTION CENTRE, OACHIRA
        </p>
      </footer>
    </>
  );
}

export default App;
