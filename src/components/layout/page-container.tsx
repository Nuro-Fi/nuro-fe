import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className }: PageContainerProps) => {
  return (
    <div className={cn("mx-auto max-w-400 px-4 py-6 lg:px-8", className)}>
      {children}
    </div>
  );
};
