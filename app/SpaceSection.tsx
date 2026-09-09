'use client';

import Image from 'next/image';
import { ArrowDownRight, Armchair, Coffee, SunMedium } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function SpaceSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        section.classList.add('is-visible');
        observer.disconnect();
      },
      { threshold: 0.14 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="space-section" id="space" ref={sectionRef} aria-labelledby="space-title">
      <div className="space-heading space-reveal">
        <p>02 / OUR SPACE</p>
        <h2 id="space-title">SLOW DOWN.<br /><em>STAY A WHILE.</em></h2>
        <div>
          <span>街の光がやわらかく差し込む、12席だけの小さな店内。</span>
          <a href="#visit">お席と営業時間を見る <ArrowDownRight /></a>
        </div>
      </div>

      <figure className="space-wide space-reveal">
        <Image
          src="/assets/cafe-interior-wide.jpg"
          alt="自然光が差し込むMoss and Creamの店内と客席"
          fill
          sizes="100vw"
        />
        <figcaption><span>01</span> DINING ROOM · 12 SEATS</figcaption>
        <div className="space-facts" aria-label="店内の特徴">
          <span><SunMedium /> NATURAL LIGHT</span>
          <span><Armchair /> 12 QUIET SEATS</span>
        </div>
      </figure>

      <div className="space-detail">
        <div className="space-detail-copy space-reveal">
          <p>AT THE BAR</p>
          <blockquote>急がない時間も、<br />一杯の味になる。</blockquote>
          <span>石と木、リネン、手仕事の器。素材の温度を感じられるカウンターで、一杯ずつ丁寧に仕上げます。</span>
          <div><Coffee /><small>ESPRESSO BAR<br />HANDCRAFTED TO ORDER</small></div>
        </div>
        <figure className="space-counter space-reveal">
          <Image
            src="/assets/cafe-counter-detail.jpg"
            alt="木と石を基調にしたMoss and Creamのコーヒーカウンター"
            fill
            sizes="(max-width: 800px) 100vw, 58vw"
          />
          <figcaption><span>02</span> BAR COUNTER · CRAFT &amp; MATERIAL</figcaption>
        </figure>
      </div>
    </section>
  );
}
