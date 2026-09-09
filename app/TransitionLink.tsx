'use client';

import type { MouseEvent, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import DrinkTransitionVisual from './DrinkTransitionVisual';
import BrandMark from './BrandMark';

type TransitionLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  destination: string;
  accent: string;
  detail: string;
  ariaLabel?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  visual?: 'drink';
};

export default function TransitionLink({
  href,
  className,
  children,
  destination,
  accent,
  detail,
  ariaLabel,
  onClick,
  visual,
}: TransitionLinkProps) {
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    document.documentElement.classList.remove('is-route-transitioning');
  }, []);

  const navigate = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
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
      <a className={className} href={href} onClick={navigate} aria-label={ariaLabel} aria-busy={transitioning || undefined}>
        {children}
      </a>
      <div className={`route-transition ${visual === 'drink' ? 'route-transition--drink' : ''} ${transitioning ? 'is-active' : ''}`} aria-hidden="true">
        <div className="route-transition-panel route-transition-panel-left" />
        <div className="route-transition-panel route-transition-panel-right" />
        <div className="route-brand-seal"><BrandMark /></div>
        {visual === 'drink' && <DrinkTransitionVisual />}
        <div className="route-transition-copy">
          <span>MOSS AND CREAM · AOMORI</span>
          <strong>{destination}<br /><i>{accent}</i></strong>
          <div><b>MC</b><em>{detail}</em><b>→</b></div>
        </div>
      </div>
    </>
  );
}
