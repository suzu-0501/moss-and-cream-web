type RouteArrivalProps = {
  destination: string;
  accent: string;
  detail: string;
};

export default function RouteArrival({ destination, accent, detail }: RouteArrivalProps) {
  return (
    <div className="route-arrival" aria-hidden="true">
      <div className="route-arrival-panel route-arrival-panel-left" />
      <div className="route-arrival-panel route-arrival-panel-right" />
      <div className="route-arrival-copy">
        <span>MOSS AND CREAM · AOMORI</span>
        <strong>{destination}<br /><i>{accent}</i></strong>
        <small>{detail}</small>
      </div>
    </div>
  );
}
