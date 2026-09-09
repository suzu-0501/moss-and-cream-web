import Image from 'next/image';
import type { CSSProperties } from 'react';

const LAYERS = ['ICE + MILK', 'ESPRESSO', 'PISTACHIO', 'CREAM', 'FINISH'];

export default function DrinkTransitionVisual() {
  return (
    <div className="route-drink-visual" aria-hidden="true">
      <div className="route-drink-orbit" />
      <div className="route-drink-frame">
        <Image src="/assets/drink-final.webp" alt="" fill sizes="(max-width: 560px) 72vw, 340px" />
      </div>
      <div className="route-drink-layers">
        {LAYERS.map((layer, index) => <span style={{ '--layer-index': index } as CSSProperties} key={layer}><i />{layer}</span>)}
      </div>
    </div>
  );
}
