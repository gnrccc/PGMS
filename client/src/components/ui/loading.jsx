import { motion } from "framer-motion";

export function LoadingDots() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex space-x-2">
        {[1, 2, 3].map((index) => (
          <motion.div
            key={index}
            className="h-3 w-3 rounded-full bg-primary"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function LoadingSpinner({ className, size = "md" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <motion.div
        className={`text-primary ${sizeClasses[size]} ${className}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="animate-spin"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </motion.div>
    </div>
  );
}

export function LoadingPulse() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <motion.div
        className="h-16 w-16 rounded-full border-4 border-primary"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

export function LoadingBar() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-1 w-48 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full bg-primary"
          animate={{
            x: [-184, 184],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            width: "50%",
          }}
        />
      </div>
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="w-full space-y-4 p-4">
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 animate-pulse rounded-full bg-muted" />
        <div className="space-y-2">
          <div className="h-4 w-[250px] animate-pulse rounded bg-muted" />
          <div className="h-4 w-[200px] animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export default function Loading({ variant = "spinner", size = "md" }) {
  const variants = {
    dots: LoadingDots,
    spinner: LoadingSpinner,
    pulse: LoadingPulse,
    bar: LoadingBar,
    skeleton: LoadingSkeleton,
  };

  const Component = variants[variant] || LoadingSpinner;

  return <Component size={size} />;
}
