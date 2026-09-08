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

const BUILD_END_AT = 0.78;

const SIZES = [
  { id: 'regular', label: 'REGULAR', detail: '12 OZ', add: 0 },
  { id: 'large', label: 'LARGE', detail: '16 OZ', add: 80 },
] as const;

const MILKS = [
  { id: 'whole', label: 'WHOLE MILK', add: 0 },
  { id: 'oat', label: 'OAT MILK', add: 50 },
] as const;

export default function Home() {
  const sceneRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);
  const [phase, setPhase] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const [scrubProgress, setScrubProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [promoVisible, setPromoVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [size, setSize] = useState<(typeof SIZES)[number]['id']>('regular');
  const [milk, setMilk] = useState<(typeof MILKS)[number]['id']>('whole');
  const [added, setAdded] = useState(false);
  const finished = reducedMotion || scrubProgress >= 0.995;

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
        setPhase(PHASES.length - 1);
        setScrubProgress(1);
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

  const prepareVideo = useCallback(() => {
    const video = videoRef.current;
    setVideoReady(true);
    if (!video || reducedMotion) return;
    video.pause();
    if (video.currentTime === 0) video.currentTime = 0.01;
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
    const scene = sceneRef.current;
    if (!video || !scene || !videoReady || reducedMotion) return;

    const syncToScroll = () => {
      const header = document.querySelector<HTMLElement>('.header');
      const promo = document.querySelector<HTMLElement>('.promo');
      const stickyOffset = header?.offsetHeight ?? 0;
      const promoOffset = promo?.offsetHeight ?? 0;
      const start = Math.max(0, scene.offsetTop - stickyOffset - promoOffset);
      const end = scene.offsetTop + scene.offsetHeight - window.innerHeight;
      const distance = Math.max(1, end - start);
      const sceneProgress = Math.min(1, Math.max(0, (window.scrollY - start) / distance));
      const progress = Math.min(1, sceneProgress / BUILD_END_AT);
      const duration = Number.isFinite(video.duration) ? video.duration : 12.75;
      const targetTime = progress * Math.max(0.01, duration - 0.04);

      video.pause();
      if (Math.abs(video.currentTime - targetTime) > 0.012) video.currentTime = targetTime;
      setScrubProgress((previous) => Math.abs(previous - progress) < 0.001 ? previous : progress);

      let nextPhase = 0;
      PHASES.forEach((item, index) => {
        if (targetTime >= item.start) nextPhase = index;
      });
      setPhase((previous) => previous === nextPhase ? previous : nextPhase);
    };

    const queueSync = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        syncToScroll();
      });
    };

    syncToScroll();
    window.addEventListener('scroll', queueSync, { passive: true });
    window.addEventListener('resize', queueSync);
    return () => {
      window.removeEventListener('scroll', queueSync);
      window.removeEventListener('resize', queueSync);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [videoReady, reducedMotion]);

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

      <section className="hero-scroll-scene" id="top" ref={sceneRef}>
      <div className={`hero ${finished ? 'is-finished' : ''}`}>
        <div className="intro">
          <p className="eyebrow">Signature drink</p>
          <h1>PISTACHIO<br />TIRAMISU<br /><em>ICED LATTE</em></h1>
          <p className="description">ピスタチオクリーム、エスプレッソ、ティラミスフォームを一層ずつ。静かな甘さと香ばしさを、ひとつのグラスに。</p>
        </div>

        <div className="product-wrap">
          <div className={`product-stage ${videoReady ? 'ready' : ''}`}>
            <Image className="poster" src="/assets/drink-final.webp" alt="完成したピスタチオティラミスアイスラテ" width={1200} height={1200} priority unoptimized />
            {!reducedMotion && (
              <video
                ref={videoRef}
                muted
                playsInline
                preload="auto"
                poster={videoReady ? undefined : '/assets/drink-final.webp'}
                aria-hidden="true"
                onLoadedData={prepareVideo}
              >
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
              <div className={`scroll-start-cue ${scrubProgress > 0.025 ? 'started' : ''}`} aria-hidden="true">
                <span>SCROLL TO BUILD</span><ArrowDown />
              </div>
            )}
          </div>
          <div className="phase-caption">
            <span>{String(phase + 1).padStart(2, '0')}</span>
            <b>{PHASES[phase].label}</b>
            <i>{finished ? 'READY' : scrubProgress > 0 ? `${Math.round(scrubProgress * 100)}%` : 'SCROLL'}</i>
            <span className="scrub-meter" aria-hidden="true"><i style={{ width: `${scrubProgress * 100}%` }} /></span>
          </div>
        </div>

        <aside className="side-rail" aria-label="ドリンクの組み立て工程">
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

        <div className={`scroll-hint ${finished ? 'finished' : scrubProgress > 0.025 ? 'started' : ''}`} aria-hidden="true">
          <span>{finished ? 'SCROLL UP TO REWIND' : scrubProgress > 0 ? `${Math.round(scrubProgress * 100)}% · KEEP SCROLLING` : 'SCROLL TO BUILD'}</span><ArrowDown />
        </div>
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
