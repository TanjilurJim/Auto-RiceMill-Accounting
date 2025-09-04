import { SVGAttributes } from 'react';
import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon({ className, alt = 'AutoRiceMill', ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  // Files under /public are served at the site root
  return <img src="/assets/logo/ricemillerp.svg" className={className} alt={alt} {...props} />;
}