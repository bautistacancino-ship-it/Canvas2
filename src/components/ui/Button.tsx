import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'gradient' | 'dark' | 'blue' | 'soft' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  gradient:
    'bg-linear-to-r from-[#ffac3a] via-[#ff7a59] to-[#ff5fa2] text-white shadow-[0_12px_24px_-10px_rgba(255,95,130,0.75)] hover:brightness-105',
  dark: 'bg-ink text-white shadow-[0_12px_24px_-12px_rgba(27,22,54,0.7)] hover:bg-ink/90',
  blue: 'bg-sky-strong text-white shadow-[0_10px_20px_-10px_rgba(47,107,255,0.9)] hover:brightness-110',
  soft: 'bg-white text-ink ring-1 ring-line shadow-soft hover:ring-lavender-strong/40',
  ghost: 'text-muted hover:text-ink',
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-12 px-6 text-base',
  lg: 'h-14 px-8 text-lg',
};

export function buttonClass(variant: Variant = 'gradient', size: Size = 'md', extra = '') {
  return `inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold tracking-tight transition active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 ${VARIANTS[variant]} ${SIZES[size]} ${extra}`;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant, size, className = '', type = 'button', ...props }: ButtonProps) {
  return <button type={type} {...props} className={buttonClass(variant, size, className)} />;
}

interface ButtonLinkProps {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function ButtonLink({ href, variant, size, className = '', children }: ButtonLinkProps) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)}>
      {children}
    </Link>
  );
}
