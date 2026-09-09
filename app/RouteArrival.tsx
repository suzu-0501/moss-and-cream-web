import DrinkTransitionVisual from './DrinkTransitionVisual';
import BrandMark from './BrandMark';

type RouteArrivalProps = {
  destination: string;
  accent: string;
  detail: string;
  visual?: 'drink';
};

export default function RouteArrival({ destination, accent, detail, visual }: RouteArrivalProps) {
  return (
    <div className={`route-arrival ${visual === 'drink' ? 'route-arrival--drink' : ''}`} aria-hidden="true">
      <div className="route-arrival-panel route-arrival-panel-left" />
      <div className="route-arrival-panel route-arrival-panel-right" />
      <div className="route-brand-seal"><BrandMark color="white" /></div>
      {visual === 'drink' && <DrinkTransitionVisual />}
      <div className="route-arrival-copy">
        <span>MOSS AND CREAM · AOMORI</span>
        <strong>{destination}<br /><i>{accent}</i></strong>
        <small>{detail}</small>
      </div>
    </div>
  );
}
