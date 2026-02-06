interface ErrorMessageProps {
  message: string | null | undefined;
  variant?: "default" | "card";
}

export const ErrorMessage = ({
  message,
  variant = "default",
}: ErrorMessageProps) => {
  if (!message) return null;

  if (variant === "card") {
    return (
      <div className="p-3 rounded-lg bg-red-900/20 border border-red-700/30">
        <p className="text-red-300 text-sm">{message}</p>
      </div>
    );
  }

  return <div className="text-red-500 text-sm mt-2">{message}</div>;
};
