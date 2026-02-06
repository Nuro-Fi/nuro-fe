import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormErrorProps {
  message?: string | null;
  className?: string;
}

export const FormError = ({ message, className }: FormErrorProps) => {
  if (!message) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md bg-red-500/10 p-3 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400",
        className,
      )}
    >
      <AlertCircle className="h-4 w-4 shrink-0" />
      <p>{message}</p>
    </div>
  );
};
