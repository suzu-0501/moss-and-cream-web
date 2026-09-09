import type { CSSProperties, ImgHTMLAttributes } from 'react';
import { withBasePath } from '../app/basePath';

type StaticImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string | { src: string };
  fill?: boolean;
  priority?: boolean;
  unoptimized?: boolean;
};

export default function StaticImage({
  src,
  fill = false,
  priority = false,
  unoptimized: _unoptimized,
  width,
  height,
  loading,
  style,
  ...props
}: StaticImageProps) {
  const source = typeof src === 'string' ? src : src.src;
  const fillStyle: CSSProperties | undefined = fill
    ? { position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }
    : style;

  return (
    <img
      {...props}
      src={withBasePath(source)}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      loading={priority ? 'eager' : loading}
      style={fillStyle}
    />
  );
}
