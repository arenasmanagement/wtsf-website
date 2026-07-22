import Link from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size    = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  external?: boolean;
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: {
    backgroundColor: "#2C4A2E",
    color: "#F5EDD4",
  },
  secondary: {
    backgroundColor: "#D4A827",
    color: "#1A1A1A",
  },
  outline: {
    backgroundColor: "transparent",
    color: "#2C4A2E",
    border: "2px solid #2C4A2E",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "#F5EDD4",
    border: "2px solid rgba(245,237,212,0.5)",
  },
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

const baseClass =
  "inline-flex items-center justify-center font-bold tracking-widest uppercase transition-all duration-150 hover:opacity-85 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2";

export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  type = "button",
  disabled = false,
  external = false,
}: ButtonProps) {
  const cls = `${baseClass} ${sizeClasses[size]} ${className} ${disabled ? "opacity-50 pointer-events-none" : ""}`;

  if (href) {
    return (
      <Link
        href={href}
        className={cls}
        style={variantStyles[variant]}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cls}
      style={variantStyles[variant]}
    >
      {children}
    </button>
  );
}
