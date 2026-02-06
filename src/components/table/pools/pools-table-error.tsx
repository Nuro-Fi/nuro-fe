import { ErrorPanel } from "@/components/error/error-panel";

export const PoolsTableError = () => {
  return (
    <ErrorPanel
      variant="neutral"
      title="Unable to load pools"
      message="We couldn't load the pools list right now. Please refresh the page or try again in a moment."
    />
  );
};
