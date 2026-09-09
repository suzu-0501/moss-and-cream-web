'use client';

import type { MouseEvent, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

type ExperienceLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

export default function ExperienceLink({ href, className, children }: ExperienceLinkProps) {
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    document.documentElement.classList.remove('is-route-transitioning');
  }, []);

  const navigate = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented
      || event.button !== 0
      || event.metaKey
      || event.ctrlKey
      || event.shiftKey
      || event.altKey
      || transitioning
    ) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    event.preventDefault();
    setTransitioning(true);
    document.documentElement.classList.add('is-route-transitioning');

    timerRef.current = window.setTimeout(() => {
      window.location.assign(href);
    }, 980);
  };

  return (
    <>
      <a className={className} href={href} onClick={navigate} aria-busy={transitioning || undefined}>
        {children}
      </a>
      <div className={`route-transition ${transitioning ? 'is-active' : ''}`} aria-hidden="true">
        <div className="route-transition-panel route-transition-panel-left" />
        <div className="route-transition-panel route-transition-panel-right" />
        <div className="route-transition-copy">
          <span>YOUR SELECTION</span>
          <strong>PISTACHIO<br />TIRAMISU<br /><i>ICED LATTE</i></strong>
          <div><b>01</b><em>SCROLL EXPERIENCE</em><b>05</b></div>
        </div>
      </div>
    </>
  );
}

