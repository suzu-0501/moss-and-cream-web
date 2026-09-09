'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CalendarDays, Check, Clock3, MapPin, Phone, Users, X } from 'lucide-react';

const DEMO_PHONE = '0172-00-0000';

export default function CafeCta() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const tickingRef = useRef(false);
  const [dockVisible, setDockVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [minDate] = useState(() => new Date().toLocaleDateString('sv-SE'));
  const [date, setDate] = useState('');
  const [time, setTime] = useState('11:00');
  const [guests, setGuests] = useState('2');
  const [seat, setSeat] = useState('COUNTER');

  useEffect(() => {
    const updateDock = () => {
      tickingRef.current = false;
      setDockVisible(window.scrollY > Math.min(320, window.innerHeight * 0.36));
    };
    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(updateDock);
    };

    updateDock();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => () => document.documentElement.classList.remove('reservation-open'), []);

  const openReservation = () => {
    setSubmitted(false);
    document.documentElement.classList.add('reservation-open');
    if (!dialogRef.current?.open) dialogRef.current?.showModal();
  };

  const closeReservation = () => {
    dialogRef.current?.close();
    document.documentElement.classList.remove('reservation-open');
  };

  return (
    <>
      <div className="visit-booking-card">
        <div>
          <span>TABLE RESERVATION</span>
          <h3>静かな一席を、<br /><i>先にお取りします。</i></h3>
          <p>お席のみの予約を想定したデモです。選択内容は送信されません。</p>
        </div>
        <button type="button" onClick={openReservation}>
          <CalendarDays /> 席を予約する <ArrowRight />
        </button>
      </div>

      <aside className={`cafe-cta-dock ${dockVisible ? 'is-visible' : ''}`} aria-label="店舗へのお問い合わせ">
        <div className="cta-open-status"><i /><span>OPEN TODAY<small>UNTIL 18:00</small></span></div>
        <a className="cta-dock-link cta-access" href="#visit"><MapPin /><span>ACCESS</span></a>
        <a className="cta-dock-link cta-phone" href="tel:0172000000" aria-label={`店舗へ電話する、デモ番号 ${DEMO_PHONE}`}>
          <Phone /><span>CALL<small>{DEMO_PHONE}</small></span>
        </a>
        <button className="cta-reserve" type="button" onClick={openReservation}>
          <CalendarDays /><span>RESERVE<small>席を予約する</small></span><ArrowRight />
        </button>
      </aside>

      <dialog
        className="reservation-dialog"
        ref={dialogRef}
        onClose={() => document.documentElement.classList.remove('reservation-open')}
        aria-labelledby="reservation-title"
      >
        <div className="reservation-shell">
          <button className="reservation-close" type="button" onClick={closeReservation} aria-label="予約画面を閉じる"><X /></button>

          {submitted ? (
            <div className="reservation-success" aria-live="polite">
              <div className="reservation-check"><Check /></div>
              <span>DEMO REQUEST RECEIVED</span>
              <h2 id="reservation-title">お席を仮押さえしました。</h2>
              <p>これは表示確認用のデモです。店舗への送信や実際の予約は行われていません。</p>
              <dl>
                <div><dt>DATE</dt><dd>{date}</dd></div>
                <div><dt>TIME</dt><dd>{time}</dd></div>
                <div><dt>GUESTS</dt><dd>{guests}名</dd></div>
                <div><dt>SEAT</dt><dd>{seat}</dd></div>
              </dl>
              <button type="button" onClick={closeReservation}>サイトへ戻る <ArrowRight /></button>
            </div>
          ) : (
            <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
              <div className="reservation-heading">
                <span>BOOK A QUIET TABLE</span>
                <h2 id="reservation-title">CAFE<br /><i>RESERVATION</i></h2>
                <p>ご希望の来店内容を選択してください。</p>
              </div>

              <div className="reservation-fields">
                <label>
                  <span><CalendarDays /> DATE</span>
                  <input type="date" required min={minDate} value={date} onChange={(event) => setDate(event.target.value)} />
                </label>
                <label>
                  <span><Clock3 /> TIME</span>
                  <select value={time} onChange={(event) => setTime(event.target.value)}>
                    <option>09:00</option><option>10:00</option><option>11:00</option><option>12:00</option>
                    <option>13:00</option><option>14:00</option><option>15:00</option><option>16:00</option>
                  </select>
                </label>
                <label>
                  <span><Users /> GUESTS</span>
                  <select value={guests} onChange={(event) => setGuests(event.target.value)}>
                    <option value="1">1名</option><option value="2">2名</option><option value="3">3名</option><option value="4">4名</option>
                  </select>
                </label>
                <label>
                  <span><MapPin /> SEAT</span>
                  <select value={seat} onChange={(event) => setSeat(event.target.value)}>
                    <option value="COUNTER">COUNTER</option><option value="TABLE">TABLE</option><option value="ANY">ANY SEAT</option>
                  </select>
                </label>
              </div>

              <div className="reservation-contact">
                <Phone />
                <div><span>PHONE RESERVATION · DEMO</span><strong>{DEMO_PHONE}</strong></div>
              </div>

              <button className="reservation-submit" type="submit">
                予約内容を確認する <ArrowRight />
              </button>
              <p className="reservation-note">営業用サンプルです。入力内容は保存・送信されず、実際の予約は成立しません。</p>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
