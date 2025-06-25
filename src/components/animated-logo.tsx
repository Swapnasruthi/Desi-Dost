import { cn } from "@/lib/utils";

export function AnimatedLogo() {
  return (
    <div className="relative h-32 w-32 flex items-center justify-center">
      {/* Outer pulsing circles */}
      <div
        className={cn(
          "absolute inset-0 rounded-full bg-primary/30",
          "animate-pulse-outer"
        )}
        style={{ animationDelay: '0s' }}
      ></div>
      <div
        className={cn(
          "absolute inset-0 rounded-full bg-primary/30",
          "animate-pulse-outer"
        )}
        style={{ animationDelay: '2s' }}
      ></div>
      
      {/* Inner solid circle with icon */}
      <div
        className={cn(
          "relative h-24 w-24 rounded-full bg-primary",
          "flex items-center justify-center animate-pulse-inner shadow-lg"
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary-foreground"
        >
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
      </div>
    </div>
  );
}
