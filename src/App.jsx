import React, { useState, useEffect } from 'react';
import './index.css';

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
    const weddingDate = new Date('2026-07-30T10:00:00');
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
          {/* Subtle corner ornaments */}
          <div className="env-corner env-corner--tl">❧</div>
          <div className="env-corner env-corner--tr">❧</div>
          <div className="env-corner env-corner--bl">❧</div>
          <div className="env-corner env-corner--br">❧</div>

          {/* Top calligraphy */}
          <div className="env-header">
            <div className="env-header-line" />
            <p className="env-eyebrow">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
            <div className="env-header-line" />
          </div>

          {/* Envelope Scene */}
          <div className={`env-scene ${isEnvelopeOpen ? 'env-scene--open' : ''}`}>

            {/* Envelope body */}
            <div className="env-body">
              {/* Inner shadow / depth lines */}
              <div className="env-fold-left" />
              <div className="env-fold-right" />
              <div className="env-fold-bottom" />
              {/* Pearl border decoration */}
              <div className="env-pearl-border" />
            </div>

            {/* Flap */}
            <div className="env-flap-wrap">
              <div className="env-flap">
                <div className="env-flap-inner" />
              </div>
            </div>

            {/* Wax seal */}
            <div className="env-seal">
              <svg width="96" height="96" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
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
                {/* Inner ring */}
                <circle cx="90" cy="90" r="64" fill="none" stroke="#c09a58" strokeWidth="1.5" opacity="0.7" />
                <circle cx="90" cy="90" r="58" fill="none" stroke="#c09a58" strokeWidth="0.6" strokeDasharray="2 3.5" opacity="0.5" />
                {/* H */}
                <text x="90" y="82" fontFamily="'Great Vibes', cursive" fontSize="44" fill="#8c6c35" textAnchor="middle" opacity="0.9">H</text>
                {/* & */}
                <text x="90" y="101" fontFamily="'Cinzel', serif" fontSize="12" fill="#af8f56" textAnchor="middle" letterSpacing="3" opacity="0.85">&amp;</text>
                {/* A — Cormorant Garamond italic for clear cursive capital */}
                <text x="90" y="133" fontFamily="'Cormorant Garamond', serif" fontSize="50" fontStyle="italic" fontWeight="600" fill="#8c6c35" textAnchor="middle" opacity="0.9">A</text>
              </svg>
            </div>
          </div>

          {/* Bottom info */}
          <div className="env-footer">
            <div className="env-names-display">
              <span className="env-disp-name">Hafeesha K H</span>
              <span className="env-disp-sep">✦</span>
              <span className="env-disp-name">Afzal Abdul Azeez</span>
            </div>
            <p className="env-disp-date">Nikah · Thursday, 30 July 2026</p>
            {!isEnvelopeOpen && <p className="env-tap-hint">— TAP TO OPEN —</p>}
          </div>
        </div>
      )}

      {/* ── Hero ── */}
      <section id="hero">
        <figure className="hero-poster">
          <img
            src="/assets/images/hero_poster.png"
            alt="Nikkah invitation for Hafeesha K H and Afzal Abdul Azeez"
            className="hero-poster__img"
            width="1023"
            height="1537"
            decoding="async"
            fetchPriority="high"
          />
          <button
            type="button"
            className="hero-poster__discover"
            aria-label="Scroll to event details"
            onClick={() => document.getElementById('countdown').scrollIntoView({ behavior: 'smooth' })}
          />
        </figure>
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
            <div className="detail-icon"><img src="https://fidhaashmil.vercel.app/assets/svg/icon-date.svg" width="22" height="22" alt="" /></div>
            <div className="detail-body">
              <span className="detail-label">Date</span>
              <p className="detail-value">Thursday, 30th July 2026</p>
            </div>
          </article>
          <article className="detail-item reveal rd2">
            <div className="detail-icon"><img src="https://fidhaashmil.vercel.app/assets/svg/icon-time.svg" width="22" height="22" alt="" /></div>
            <div className="detail-body">
              <span className="detail-label">Nikah</span>
              <p className="detail-value">10:00 AM onwards</p>
            </div>
          </article>
          <article className="detail-item reveal rd3">
            <div className="detail-icon"><img src="https://fidhaashmil.vercel.app/assets/svg/icon-time.svg" width="22" height="22" alt="" /></div>
            <div className="detail-body">
              <span className="detail-label">Lunch</span>
              <p className="detail-value">12:00 PM – 2:00 PM</p>
            </div>
          </article>
          <article className="detail-item detail-item--last reveal rd4">
            <div className="detail-icon"><img src="https://fidhaashmil.vercel.app/assets/svg/icon-venue.svg" width="22" height="22" alt="" /></div>
            <div className="detail-body">
              <span className="detail-label">Venue</span>
              <p className="detail-value">ASCO Convention Center,<br />Mayannur, Thrissur, Kerala<br /><span style={{ fontSize: '0.85em', color: 'var(--textmid)' }}>(Near Ottappalam-Mayannur Bridge)</span></p>
            </div>
          </article>
        </div>
      </section>

      {/* ── Venue ── */}
      <section id="venue">
        <div className="sec-hd">
          <p className="sec-eye reveal">FIND YOUR WAY</p>
          <h2 className="sec-ttl reveal rd1">Venue</h2>
          <div className="sec-orn reveal rd2"><span className="ol" /><span className="od" /><span className="ol" /></div>
        </div>
        <p className="vname reveal">ASCO Convention Center<br /><span style={{ fontSize: '0.75em', color: 'var(--textmid)', fontStyle: 'normal' }}>Mayannur, Thrissur, Kerala<br />(Near Ottappalam-Mayannur Bridge)</span></p>
        <div className="map-box reveal">
          <iframe src="https://maps.google.com/maps?q=ASCO+Convention+Center+Mayannur+Thrissur+Kerala&output=embed" allowFullScreen loading="lazy" title="Venue map" />
        </div>
        <a className="map-btn reveal" href="https://maps.google.com/maps?q=ASCO+Convention+Center+Mayannur+Thrissur+Kerala" target="_blank" rel="noopener noreferrer">
          📍 &nbsp;GET DIRECTIONS ON GOOGLE MAPS
        </a>
      </section>

      {/* ── Closing ── */}
      <section id="closing">
        <p className="cl-bism reveal">﷽</p>
        <p className="cl-ayah reveal">"And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy."</p>
        <p className="cl-cite reveal">— Quran 30:21</p>

        <img className="cl-arch reveal" src="https://fidhaashmil.vercel.app/assets/svg/arch-ornament.svg" width="100" height="38" alt="" />

        <div className="cl-script reveal">Hafeesha K H <span className="cl-amp">&amp;</span> Afzal Abdul Azeez</div>
        <div className="cl-parentage reveal">
          <span>Hafeesha K H <span className="parent-note">(D/o Mr. Haneefa K. &amp; Mrs. Shemitha P. S.)</span></span>
          <span className="parent-amp">&amp;</span>
          <span>Afzal Abdul Azeez <span className="parent-note">(S/o Mr. Abdul Azeez &amp; Mrs. Nazeema)</span></span>
        </div>
        <p className="cl-sub reveal">TOGETHER WITH THEIR FAMILIES</p>
        <p className="cl-body reveal">
          Joyfully invite you to witness<br />
          the blessed union of our Nikah.<br /><br />
          Your presence, heartfelt prayers &amp;<br />
          warm blessings are the greatest gift<br />
          you could bring to this beautiful day.<br /><br />
          <strong>Thursday, 30th July 2026</strong><br />
          <strong>10:00 AM · ASCO Convention Center</strong><br />
          <span style={{ fontSize: '0.9em' }}>Mayannur, Thrissur, Kerala<br />(Near Ottappalam-Mayannur Bridge)</span>
        </p>

        <div className="dua-box reveal">
          <p>
            May Allah bless this sacred union<br />
            with boundless love, mercy,<br />
            and eternal happiness.
            <span className="dua-aameen">Aameen.</span>
          </p>
        </div>
      </section>

      <footer>
        <p>🤍 &nbsp; HAFEESHA K H &amp; AFZAL ABDUL AZEEZ &nbsp; 🤍<br />NIKAH · THURSDAY 30 JULY 2026<br />ASCO CONVENTION CENTER, MAYANNUR, THRISSUR, KERALA</p>
      </footer>
    </>
  );
}

export default App;
