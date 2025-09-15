import React from 'react';
import { clsx } from 'clsx';

const Input = React.forwardRef(({ 
  className, 
  type = 'text',
  error,
  label,
  ...props 
}, ref) => {
  const id = React.useId();
  
  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={clsx(
          "flex h-11 w-full rounded-xl border border-input bg-background/50 backdrop-blur-sm px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-border/80 hover:bg-background/80 shadow-sm focus-visible:shadow-md",
          error && "border-destructive focus-visible:ring-destructive/30 focus-visible:border-destructive",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export { Input };
