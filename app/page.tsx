'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Menu,
  ShoppingBag,
  X,
} from 'lucide-react';

const PHASES = [
  { label: 'ICE + MILK', short: 'ICE', start: 0 },
  { label: 'ESPRESSO', short: 'ESPRESSO', start: 1.2 },
  { label: 'PISTACHIO', short: 'PISTACHIO', start: 2.75 },
  { label: 'CREAM', short: 'CREAM', start: 4.5 },
  { label: 'FINISH', short: 'FINISH', start: 8.85 },
] as const;

const SIZES = [
  { id: 'regular', label: 'REGULAR', detail: '12 OZ', add: 0 },
  { id: 'large', label: 'LARGE', detail: '16 OZ', add: 80 },
] as const;

const MILKS = [
  { id: 'whole', label: 'WHOLE MILK', add: 0 },
  { id: 'oat', label: 'OAT MILK', add: 50 },
] as const;

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);
  const scrollStartedRef = useRef(false);
  const [phase, setPhase] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const [scrollStarted, setScrollStarted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [promoVisible, setPromoVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [size, setSize] = useState<(typeof SIZES)[number]['id']>('regular');
  const [milk, setMilk] = useState<(typeof MILKS)[number]['id']>('whole');
  const [added, setAdded] = useState(false);

  const total = useMemo(() => {
    const sizePrice = SIZES.find((item) => item.id === size)?.add ?? 0;
    const milkPrice = MILKS.find((item) => item.id === milk)?.add ?? 0;
    return 780 + sizePrice + milkPrice;
  }, [milk, size]);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setReducedMotion(query.matches);
      if (query.matches) {
        videoRef.current?.pause();
        scrollStartedRef.current = false;
        setScrollStarted(false);
        setPhase(PHASES.length - 1);
        setFinished(true);
      }
    };
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.14 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      const video = videoRef.current;
      if (!video || reducedMotion || finished || !scrollStartedRef.current) return;
      if (document.hidden) video.pause();
      else void video.play().catch(() => undefined);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [finished, reducedMotion]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !playing) return;

    const sync = () => {
      const current = video.currentTime;
      let next = 0;
      PHASES.forEach((item, index) => {
        if (current >= item.start) next = index;
      });
      setPhase((previous) => (previous === next ? previous : next));
      if (!video.paused && !video.ended) rafRef.current = requestAnimationFrame(sync);
    };

    rafRef.current = requestAnimationFrame(sync);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [playing]);

  const prepareVideo = useCallback(() => {
    const video = videoRef.current;
    setVideoReady(true);
    if (!video || reducedMotion) return;
    if (!scrollStartedRef.current) {
      video.pause();
      if (video.currentTime === 0) video.currentTime = 0.01;
    }
  }, [reducedMotion]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) return;

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) prepareVideo();
    video.addEventListener('loadeddata', prepareVideo);
    return () => video.removeEventListener('loadeddata', prepareVideo);
  }, [prepareVideo, reducedMotion]);

  useEffect(() => {
    const video = videoRef.current;
    const hero = document.getElementById('top');
    if (!video || !hero || reducedMotion) return;

    const resetAtTop = () => {
      video.pause();
      video.currentTime = 0.01;
      scrollStartedRef.current = false;
      setScrollStarted(false);
      setFinished(false);
      setPhase(0);
    };

    const handleScroll = () => {
      if (window.scrollY <= 4) {
        if (scrollStartedRef.current || finished) resetAtTop();
        return;
      }

      const bounds = hero.getBoundingClientRect();
      const heroVisible = bounds.bottom > 80 && bounds.top < window.innerHeight;

      if (!scrollStartedRef.current && window.scrollY > 12 && heroVisible) {
        scrollStartedRef.current = true;
        setScrollStarted(true);
        setFinished(false);
        setPhase(0);
        void video.play().catch(() => {
          scrollStartedRef.current = false;
          setScrollStarted(false);
        });
        return;
      }

      if (!scrollStartedRef.current || finished) return;
      if (!heroVisible && !video.paused) video.pause();
      if (heroVisible && document.visibilityState === 'visible' && video.paused) {
        void video.play().catch(() => undefined);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [finished, reducedMotion]);

  const goToOrder = () => document.getElementById('order')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });

  return (
    <main className={`site-shell ${promoVisible ? '' : 'promo-dismissed'}`}>
      {promoVisible && (
        <div className="promo">
          <span>ONLINE EXCLUSIVE · LAYERED TO ORDER</span>
          <button onClick={() => setPromoVisible(false)} aria-label="お知らせを閉じる"><X /></button>
        </div>
      )}

      <header className="header">
        <a className="brand" href="#top" aria-label="Moss and Cream ホーム">
          <span>MOSS</span><i>AND</i><span>CREAM</span>
        </a>
        <nav aria-label="メインナビゲーション">
          <a href="#story">STORY</a><a href="#layers">LAYERS</a><a href="#order">CUSTOMIZE</a>
        </nav>
        <div className="header-actions">
          <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="メニューを開く"><Menu /></button>
          <button onClick={goToOrder} aria-label="バッグを開く"><span className="bag-label">BAG</span><ShoppingBag /><sup>{added ? 1 : 0}</sup></button>
        </div>
      </header>

      <div className={`menu-panel ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <button className="menu-close" onClick={() => setMenuOpen(false)} aria-label="メニューを閉じる"><X /></button>
        <a href="#story" onClick={() => setMenuOpen(false)}>STORY</a>
        <a href="#layers" onClick={() => setMenuOpen(false)}>LAYERS</a>
        <a href="#order" onClick={() => setMenuOpen(false)}>CUSTOMIZE</a>
      </div>

      <section className="hero" id="top">
        <div className="intro hero-enter">
          <p className="eyebrow">Signature drink</p>
          <h1>PISTACHIO<br />TIRAMISU<br /><em>ICED LATTE</em></h1>
          <p className="description">ピスタチオクリーム、エスプレッソ、ティラミスフォームを一層ずつ。静かな甘さと香ばしさを、ひとつのグラスに。</p>
          <p className="price">¥780 <small>tax included</small></p>
          <button className="primary" onClick={goToOrder}>ADD TO ORDER <ArrowUpRight /></button>
        </div>

        <div className="product-wrap hero-enter delay-1">
          <div className={`product-stage ${videoReady ? 'ready' : ''}`}>
            <Image className="poster" src="/assets/drink-final.webp" alt="完成したピスタチオティラミスアイスラテ" width={1200} height={1200} priority unoptimized />
            {!reducedMotion && (
              <video
                ref={videoRef}
                muted
                playsInline
                preload="metadata"
                poster={videoReady ? undefined : '/assets/drink-final.webp'}
                aria-hidden="true"
                onLoadedData={prepareVideo}
                onPlay={() => { setVideoReady(true); setPlaying(true); }}
                onPause={() => setPlaying(false)}
                onEnded={() => { setPlaying(false); setPhase(PHASES.length - 1); setFinished(true); }}
              >
                <source media="(max-width: 767px)" src="/assets/drink-build-mobile.webm" type="video/webm" />
                <source media="(min-width: 768px)" src="/assets/drink-build-master.webm" type="video/webm" />
                <source media="(max-width: 767px)" src="/assets/drink-build-mobile.mp4" type="video/mp4" />
                <source src="/assets/drink-build-master.mp4" type="video/mp4" />
              </video>
            )}

            <svg className={`orbit ${finished ? 'show' : ''}`} viewBox="0 0 600 600" aria-hidden="true">
              <ellipse cx="300" cy="300" rx="274" ry="162" />
            </svg>
            <div className={`ingredient-tag tag-left ${finished ? 'show' : ''}`}><span>01</span>ROASTED<br />PISTACHIO</div>
            <div className={`ingredient-tag tag-right ${finished ? 'show' : ''}`}><span>02</span>DUTCH<br />COCOA</div>

            {!reducedMotion && (
              <div className={`scroll-start-cue ${scrollStarted ? 'started' : ''}`} aria-hidden="true">
                <span>SCROLL TO BUILD</span><ArrowDown />
              </div>
            )}
          </div>
          <div className="phase-caption" aria-live="polite">
            <span>{String(phase + 1).padStart(2, '0')}</span>
            <b>{PHASES[phase].label}</b>
            <i>{finished ? 'READY' : playing ? 'BUILDING' : scrollStarted ? 'PAUSED' : 'SCROLL'}</i>
          </div>
        </div>

        <aside className="side-rail hero-enter delay-2" aria-label="ドリンクの組み立て工程">
          <div className={`progress-panel ${finished ? 'is-complete' : ''}`}>
            <p className="rail-kicker">BUILDING YOUR DRINK</p>
            <div className="progress-list">
              {PHASES.map((item, index) => (
                <div className={`${phase === index ? 'active' : ''} ${phase > index ? 'complete' : ''}`} key={item.label} aria-current={phase === index ? 'step' : undefined}>
                  <span>{phase > index ? <Check /> : `0${index + 1}`}</span><b>{item.label}</b>
                </div>
              ))}
            </div>
          </div>

          <Customizer
            compact
            visible={finished || reducedMotion}
            size={size}
            milk={milk}
            total={total}
            added={added}
            onSize={setSize}
            onMilk={setMilk}
            onAdd={() => setAdded(true)}
          />
        </aside>

        <div className={`scroll-hint ${scrollStarted ? 'started' : ''}`} aria-hidden="true">
          <span>{scrollStarted ? 'KEEP SCROLLING' : 'SCROLL TO BUILD'}</span><ArrowDown />
        </div>
      </section>

      <section className="story-section" id="story">
        <div className="section-number" data-reveal>01 / THE STORY</div>
        <div className="story-copy" data-reveal>
          <p className="serif-kicker">Built in layers, tasted as one.</p>
          <h2>重なるたび、<br />香りがほどける。</h2>
        </div>
        <p className="story-body" data-reveal>冷たいミルクと透明な氷。深く落ちるエスプレッソに、穏やかなピスタチオのコク。最後はティラミスフォーム、ココア、砕いたピスタチオで仕上げます。</p>
      </section>

      <section className="layers-section" id="layers">
        <div className="layers-heading" data-reveal>
          <span>02 / INGREDIENTS</span>
          <h2>THE QUIET<br /><em>INGREDIENTS</em></h2>
        </div>
        <article className="ingredient-card pistachio-card" data-reveal>
          <div className="image-frame"><Image src="/assets/ingredient-pistachio.webp" alt="ローストピスタチオ" width={720} height={720} loading="lazy" unoptimized /></div>
          <div><span>01</span><h3>ROASTED<br />PISTACHIO</h3><p>香ばしく、まろやか。層のあいだに長い余韻を残すグリーン。</p></div>
        </article>
        <article className="ingredient-card cocoa-card" data-reveal>
          <div className="image-frame"><Image src="/assets/ingredient-cocoa.webp" alt="きめ細かなココアパウダー" width={720} height={720} loading="lazy" unoptimized /></div>
          <div><span>02</span><h3>DUTCH<br />COCOA</h3><p>クリームの甘さを整える、ほろ苦い最後のひと振り。</p></div>
        </article>
      </section>

      <section className="order-section" id="order">
        <div className="order-visual" data-reveal>
          <p>MAKE IT YOURS</p>
          <h2>YOUR LATTE,<br /><em>YOUR LAYERS.</em></h2>
          <Image src="/assets/drink-final.webp" alt="ピスタチオティラミスアイスラテ" width={1200} height={1200} loading="lazy" unoptimized />
        </div>
        <Customizer
          visible
          size={size}
          milk={milk}
          total={total}
          added={added}
          onSize={setSize}
          onMilk={setMilk}
          onAdd={() => setAdded(true)}
        />
      </section>

      <footer>
        <a className="brand footer-brand" href="#top"><span>MOSS</span><i>AND</i><span>CREAM</span></a>
        <p>AN INTERACTIVE PRODUCT STUDY · 2026</p>
        <a href="#top">BACK TO TOP ↑</a>
      </footer>
    </main>
  );
}

type CustomizerProps = {
  compact?: boolean;
  visible: boolean;
  size: (typeof SIZES)[number]['id'];
  milk: (typeof MILKS)[number]['id'];
  total: number;
  added: boolean;
  onSize: (value: (typeof SIZES)[number]['id']) => void;
  onMilk: (value: (typeof MILKS)[number]['id']) => void;
  onAdd: () => void;
};

function Customizer({ compact = false, visible, size, milk, total, added, onSize, onMilk, onAdd }: CustomizerProps) {
  return (
    <div className={`customizer ${compact ? 'compact' : ''} ${visible ? 'visible' : ''}`}>
      <div className="customizer-head"><div><span>03 / PRODUCT</span><h2>CUSTOMIZE</h2></div><p>PISTACHIO TIRAMISU ICED LATTE</p></div>
      <fieldset>
        <legend>SIZE</legend>
        <div className="choice-row">
          {SIZES.map((item) => <button key={item.id} className={size === item.id ? 'selected' : ''} onClick={() => onSize(item.id)} aria-pressed={size === item.id}><b>{item.label}</b><small>{item.detail}{item.add ? ` · +¥${item.add}` : ''}</small></button>)}
        </div>
      </fieldset>
      <fieldset>
        <legend>MILK</legend>
        <div className="choice-row">
          {MILKS.map((item) => <button key={item.id} className={milk === item.id ? 'selected' : ''} onClick={() => onMilk(item.id)} aria-pressed={milk === item.id}><b>{item.label}</b><small>{item.add ? `+¥${item.add}` : 'INCLUDED'}</small></button>)}
        </div>
      </fieldset>
      <div className="order-total"><span>TOTAL</span><strong>¥{total.toLocaleString('ja-JP')}</strong></div>
      <button className={`add-button ${added ? 'added' : ''}`} onClick={onAdd}>{added ? <><Check /> ADDED TO DEMO BAG</> : <>ADD TO ORDER <ArrowUpRight /></>}</button>
      <p className="demo-note" aria-live="polite">{added ? 'デモバッグに追加しました。実際の注文処理は行われません。' : '営業用デモのため、決済は発生しません。'}</p>
    </div>
  );
}
