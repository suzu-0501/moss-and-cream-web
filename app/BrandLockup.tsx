import BrandMark from './BrandMark';

export default function BrandLockup() {
  return (
    <>
      <BrandMark />
      <span className="brand-wordmark" aria-hidden="true">
        <span>MOSS</span>
        <i>AND</i>
        <span>CREAM</span>
      </span>
    </>
  );
}
