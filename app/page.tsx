/* oxlint-disable next/no-html-link-for-pages -- Native document navigation is required by the Sites runtime. */
import Image from 'next/image';
import { ArrowDown, ArrowUpRight, Clock3, MapPin } from 'lucide-react';
import TransitionLink from './TransitionLink';
import CafeCta from './CafeCta';
import SpaceSection from './SpaceSection';
import RouteArrival from './RouteArrival';
import BrandLockup from './BrandLockup';
import { withBasePath } from './basePath';

const COFFEE_MENU = [
  { name: 'PISTACHIO TIRAMISU ICED LATTE', jp: 'ピスタチオ・ティラミス・アイスラテ', price: '¥780', featured: true },
  { name: 'BROWN SUGAR OAT LATTE', jp: 'ブラウンシュガー・オーツラテ', price: '¥690' },
  { name: 'COCOA CREAM MOCHA', jp: 'ココアクリーム・モカ', price: '¥720' },
  { name: 'ESPRESSO TONIC', jp: 'エスプレッソ・トニック', price: '¥650' },
];

const TEA_MENU = [
  { name: 'MATCHA CLOUD', jp: '抹茶クラウド', price: '¥740' },
  { name: 'HOJICHA CARAMEL LATTE', jp: 'ほうじ茶キャラメルラテ', price: '¥700' },
  { name: 'CITRUS COLD BREW', jp: 'シトラス・コールドブリュー', price: '¥680' },
];

export default function CafeHome() {
  return (
    <main className="cafe-home" id="top">
      <RouteArrival destination="MOSS" accent="AND CREAM" detail="CAFE HOME · A QUIET PLACE FOR GOOD COFFEE" />
      <div className="home-promo">MOSS AND CREAM · SPECIALTY COFFEE &amp; SLOW MOMENTS</div>

      <header className="home-header">
        <a className="brand" href={withBasePath('/')} aria-label="Moss and Cream ホーム">
          <BrandLockup />
        </a>
        <nav aria-label="店舗ナビゲーション">
          <a href="#featured">FEATURED</a>
          <a href="#space">SPACE</a>
          <a href="#menu">MENU</a>
          <a href="#visit">VISIT</a>
        </nav>
        <a className="home-menu-link" href="#menu">VIEW MENU <ArrowDown /></a>
      </header>

      <section className="home-hero" aria-labelledby="home-title">
        <Image src="/assets/storefront-hero.jpg" alt="静かな街角にあるMoss and Creamの店舗外観" fill priority sizes="100vw" />
        <div className="home-hero-shade" />
        <div className="home-hero-copy">
          <p>Specialty coffee · Aomori</p>
          <h1 id="home-title">A QUIET PLACE<br />FOR <em>GOOD COFFEE.</em></h1>
          <span>素材が重なる瞬間まで楽しむ、小さなスペシャルティコーヒースタンド。</span>
        </div>
        <a className="home-scroll" href="#featured"><span>DISCOVER THE MENU</span><ArrowDown /></a>
      </section>

      <section className="home-manifesto">
        <p>01 / OUR PLACE</p>
        <h2>一杯ができるまでを、<br /><em>体験に変える。</em></h2>
        <div>
          <p>その日の空気、豆の香り、クリームが重なる瞬間。Moss and Creamでは、メニューを選ぶ時間からコーヒー体験が始まります。</p>
          <a href="#menu">すべてのメニューを見る <ArrowDown /></a>
        </div>
      </section>

      <SpaceSection />

      <section className="featured-drink" id="featured">
        <div className="featured-image">
          <Image src="/assets/drink-final.webp" alt="おすすめのピスタチオティラミスアイスラテ" fill sizes="(max-width: 800px) 100vw, 58vw" />
          <span>BARISTA RECOMMENDATION</span>
        </div>
        <div className="featured-copy">
          <p>03 / FEATURED DRINK</p>
          <h2>PISTACHIO<br />TIRAMISU<br /><em>ICED LATTE</em></h2>
          <p className="featured-jp">香ばしいピスタチオ、深いエスプレッソ、軽やかなティラミスフォーム。層が生まれる工程をスクロールで体験できます。</p>
          <div className="featured-price"><strong>¥780</strong><span>tax included</span></div>
          <TransitionLink className="experience-link" href="/menu/pistachio-tiramisu-latte" destination="DRINK" accent="EXPERIENCE" detail="PISTACHIO TIRAMISU ICED LATTE" visual="drink">
            制作過程を見る <ArrowUpRight />
          </TransitionLink>
        </div>
      </section>

      <section className="cafe-menu" id="menu">
        <div className="menu-heading">
          <p>04 / FULL MENU</p>
          <h2>CHOOSE YOUR<br /><em>QUIET FAVORITE.</em></h2>
          <span>SCROLL EXPERIENCE 表示の商品から、その一杯ができるまでのストーリーへ進めます。</span>
        </div>

        <MenuGroup title="ESPRESSO & COFFEE" items={COFFEE_MENU} />
        <MenuGroup title="MATCHA, TEA & SEASONAL" items={TEA_MENU} />
      </section>

      <section className="visit-section" id="visit">
        <div>
          <p>05 / VISIT</p>
          <h2>SEE YOU<br /><em>AT THE COUNTER.</em></h2>
        </div>
        <div className="visit-details">
          <article><MapPin /><div><b>LOCATION</b><span>青森県弘前市の静かな街角<br />※営業用サンプル店舗です</span></div></article>
          <article><Clock3 /><div><b>OPENING HOURS</b><span>MON–FRI 8:00–18:00<br />SAT–SUN 9:00–17:00</span></div></article>
          <CafeCta />
        </div>
      </section>

      <footer className="home-footer">
        <a className="brand footer-brand" href={withBasePath('/')} aria-label="Moss and Cream ホーム"><BrandLockup /></a>
        <p>COFFEE, LAYERS &amp; QUIET MOMENTS · 2026</p>
        <a href="#top">BACK TO TOP ↑</a>
      </footer>
    </main>
  );
}

type MenuItem = { name: string; jp: string; price: string; featured?: boolean };

function MenuGroup({ title, items }: { title: string; items: MenuItem[] }) {
  return (
    <div className="menu-group">
      <h3>{title}</h3>
      <div>
        {items.map((item, index) => {
          const content = (
            <>
              <span className="menu-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="menu-name"><b>{item.name}</b><small>{item.jp}</small></span>
              {item.featured && <span className="menu-badge">SCROLL EXPERIENCE</span>}
              <strong>{item.price}</strong>
              <ArrowUpRight />
            </>
          );

          return item.featured ? (
            <TransitionLink className="menu-row is-active" href="/menu/pistachio-tiramisu-latte" destination="DRINK" accent="EXPERIENCE" detail={item.name} visual="drink" key={item.name}>{content}</TransitionLink>
          ) : (
            <div className="menu-row" key={item.name}>{content}</div>
          );
        })}
      </div>
    </div>
  );
}
