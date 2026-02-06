interface PoolsTableEmptyProps {
  message?: string;
}

export const PoolsTableEmpty = ({
  message = "No pools available.",
}: PoolsTableEmptyProps) => {
  return (
    <div className="border border-border-primary bg-surface-primary p-6 text-sm text-text-secondary">
      {message}
    </div>
  );
};
