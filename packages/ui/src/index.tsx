import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

const btnV = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  { variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-gray-300 bg-white hover:bg-gray-50",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        ghost: "hover:bg-gray-100",
        success: "bg-green-600 text-white hover:bg-green-700",
        warning: "bg-yellow-500 text-white hover:bg-yellow-600",
      },
      size: { default: "h-10 px-4 py-2", sm: "h-8 px-3 text-xs", lg: "h-12 px-6 text-base", icon: "h-10 w-10" },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof btnV> { loading?: boolean; }

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => (
    <button className={cn(btnV({ variant, size, className }))} ref={ref} disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{children}
    </button>
  )
);
Button.displayName = "Button";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string; icon?: React.ReactNode; }

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
        <input className={cn("w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50", icon && "pl-10", error && "border-red-500", className)} ref={ref} {...props} />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
);
Input.displayName = "Input";

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("rounded-xl border border-gray-200 bg-white shadow-sm", className)} {...props} />
);
Card.displayName = "Card";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-4", className)} {...props} />
);
CardContent.displayName = "CardContent";

const badgeV = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", {
  variants: { variant: { default: "bg-blue-100 text-blue-800", secondary: "bg-gray-100 text-gray-800", success: "bg-green-100 text-green-800", destructive: "bg-red-100 text-red-800", warning: "bg-yellow-100 text-yellow-800", outline: "border border-gray-300 text-gray-700" } },
  defaultVariants: { variant: "default" },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeV> {}
export function Badge({ className, variant, ...props }: BadgeProps) { return <div className={cn(badgeV({ variant }), className)} {...props} />; }

export function Modal({ isOpen, onClose, title, children, size = "md" }: { isOpen: boolean; onClose: () => void; title?: string; children: React.ReactNode; size?: "sm"|"md"|"lg"|"xl"; }) {
  React.useEffect(() => { document.body.style.overflow = isOpen ? "hidden" : "unset"; return () => { document.body.style.overflow = "unset"; }; }, [isOpen]);
  if (!isOpen) return null;
  const sizes = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg", xl: "max-w-xl" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className={cn("relative bg-white rounded-xl shadow-xl w-full max-h-[90vh] overflow-auto", sizes[size])}>
        {title && <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10"><h2 className="text-lg font-semibold">{title}</h2><button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button></div>}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
