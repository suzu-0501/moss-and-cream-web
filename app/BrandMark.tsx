import Image from 'next/image';

type BrandMarkProps = {
  className?: string;
};

export default function BrandMark({ className = '' }: BrandMarkProps) {
  return (
    <span className={`brand-mark-shell ${className}`.trim()} aria-hidden="true">
      <Image
        className="brand-mark-image"
        src="/assets/moss-and-cream-mark.png"
        alt=""
        width={512}
        height={512}
        sizes="72px"
        unoptimized
      />
    </span>
  );
}
