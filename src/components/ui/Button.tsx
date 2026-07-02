import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary: "bg-brand text-white active:bg-brand-dark disabled:opacity-50",
  secondary:
    "bg-white text-brand border border-brand/30 active:bg-brand-light",
  danger: "bg-red-600 text-white active:bg-red-700 disabled:opacity-50",
  ghost: "bg-transparent text-zinc-600 active:bg-zinc-100",
};

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
