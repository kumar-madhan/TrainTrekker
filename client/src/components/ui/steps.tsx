import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StepsProps {
  currentStep: number;
  className?: string;
  children: ReactNode;
}

interface StepProps {
  title: string;
  className?: string;
}

export function Steps({ currentStep = 1, className, children }: StepsProps) {
  // Count steps from children
  const steps = React.Children.toArray(children);
  const totalSteps = steps.length;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return null;

          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isLast = stepNumber === totalSteps;

          return (
            <div
              className={cn(
                "flex-1 flex flex-col items-center relative",
                isLast && "flex-none"
              )}
            >
              {/* Step circle */}
              <div
                className={cn(
                  "flex items-center justify-center h-8 w-8 rounded-full border-2 font-semibold z-10",
                  isActive
                    ? "border-primary bg-primary text-white"
                    : isCompleted
                    ? "border-primary bg-primary text-white"
                    : "border-neutral-300 bg-white text-neutral-500"
                )}
              >
                {isCompleted ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>

              {/* Step title */}
              <span
                className={cn(
                  "text-xs mt-1 text-center",
                  (isActive || isCompleted) ? "text-primary font-medium" : "text-neutral-500"
                )}
              >
                {child.props.title}
              </span>

              {/* Connecting line */}
              {!isLast && (
                <div
                  className={cn(
                    "absolute top-4 w-full h-0.5 -right-1/2",
                    (isCompleted) ? "bg-primary" : "bg-neutral-200"
                  )}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Step({ title, className }: StepProps) {
  return <div className={className}>{title}</div>;
}
