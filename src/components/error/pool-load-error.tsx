import { PageContainer } from "@/components/layout/page-container";
import { ActionButton } from "@/components/ui/action-button";

interface PoolLoadErrorProps {
  onRetry?: () => void;
  actionLabel?: string;
}

export const PoolLoadError = ({
  onRetry,
  actionLabel = "Reload",
}: PoolLoadErrorProps) => {
  return (
    <PageContainer className="py-10">
      <div className="mx-auto max-w-6xl space-y-2">
        <div className="text-sm font-medium text-text-primary">
          Unable to load pool
        </div>
        <div className="text-sm text-text-muted">
          We couldn{"'"}t load this pool right now. Please try again.
        </div>

        {onRetry ? (
          <div className="pt-4">
            <ActionButton variant="create" onClick={onRetry}>
              {actionLabel}
            </ActionButton>
          </div>
        ) : null}
      </div>
    </PageContainer>
  );
};
