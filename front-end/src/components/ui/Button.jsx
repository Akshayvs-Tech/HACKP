import React from 'react';
import { clsx } from 'clsx';

const Button = React.forwardRef(({ 
  className, 
  variant = 'default', 
  size = 'default', 
  loading = false,
  disabled = false,
  children, 
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer transform active:scale-[0.98] relative overflow-hidden";
  
  const variants = {
    default: "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary/80 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
    destructive: "bg-gradient-to-r from-destructive to-destructive/90 text-destructive-foreground hover:from-destructive/90 hover:to-destructive/80 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
    outline: "border-2 border-border bg-card hover:bg-accent hover:text-accent-foreground hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
    secondary: "bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground hover:from-secondary/80 hover:to-secondary/70 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
    ghost: "hover:bg-accent hover:text-accent-foreground hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0",
    link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
    glass: "glass backdrop-blur-md hover:bg-white/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
    modern: "bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 active:translate-y-0 hover:bg-accent/5",
    gradient: "bg-gradient-to-r from-primary via-primary/80 to-primary text-primary-foreground hover:from-primary/90 hover:via-primary/70 hover:to-primary/90 shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0",
  };

  const sizes = {
    default: "h-10 px-6 py-2",
    sm: "h-9 rounded-lg px-4 text-xs",
    lg: "h-12 rounded-xl px-8 text-base",
    icon: "h-10 w-10",
    "icon-sm": "h-8 w-8 rounded-lg",
    "icon-lg": "h-12 w-12 rounded-xl",
  };

  return (
    <button
      className={clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        loading && "cursor-not-allowed opacity-80",
        disabled && "cursor-not-allowed",
        className
      )}
      ref={ref}
      disabled={disabled || loading}
      {...props}
    >
      <span className={clsx("relative z-10 flex items-center", loading && "opacity-0")}>
        {children}
      </span>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg 
            className="h-4 w-4 animate-spin text-current" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}
      
      {/* Ripple effect overlay */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
      </div>
    </button>
  );
});

Button.displayName = "Button";

export { Button };
