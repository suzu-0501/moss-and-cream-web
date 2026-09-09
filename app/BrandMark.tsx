import Image from 'next/image';

type BrandMarkProps = {
  className?: string;
  color?: 'green' | 'white';
};

export default function BrandMark({ className = '', color = 'green' }: BrandMarkProps) {
  return (
    <span className={`brand-mark-shell ${className}`.trim()} aria-hidden="true">
      <Image
        className="brand-mark-image"
        src={color === 'white' ? '/assets/moss-and-cream-mark-white.png' : '/assets/moss-and-cream-mark.png'}
        alt=""
        width={512}
        height={512}
        sizes="72px"
        unoptimized
      />
    </span>
  );
}
