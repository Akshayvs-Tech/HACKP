import React from 'react';
import { clsx } from 'clsx';

const Card = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "rounded-xl border bg-card text-card-foreground shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-border",
    modern: "rounded-2xl border bg-gradient-to-br from-card to-card/80 text-card-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-border/30 hover:border-primary/20 backdrop-blur-sm",
    glass: "rounded-2xl bg-card/80 backdrop-blur-xl text-card-foreground shadow-xl border border-white/10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1",
    elevated: "rounded-xl border bg-card text-card-foreground shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-border/30",
    minimal: "rounded-lg bg-card text-card-foreground hover:bg-accent/5 transition-all duration-200",
  };

  return (
    <div
      ref={ref}
      className={clsx(variants[variant], className)}
      {...props}
    />
  );
});
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx("flex flex-col space-y-2 p-6 pb-4", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={clsx(
      "text-xl font-semibold leading-tight tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={clsx("text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={clsx("p-6 pt-4", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx("flex items-center p-6 pt-4 border-t border-border/50", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
