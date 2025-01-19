import React, { forwardRef } from "react";
import { cn } from "../../lib/utils.ts";

const Card = forwardRef((props, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      props.className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = forwardRef((props, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", props.className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef((props, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", props.className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef((props, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", props.className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef((props, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", props.className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = forwardRef((props, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", props.className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
