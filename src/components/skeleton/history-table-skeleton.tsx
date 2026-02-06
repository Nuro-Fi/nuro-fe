"use client";

export const HistoryTableSkeleton = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border-primary bg-surface-primary/60">
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
              Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
              Pool
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
              Amount
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
              User
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
              Chain
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
              Time
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
              Transaction
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-primary/50">
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="bg-surface-primary/40">
              <td className="px-4 py-4">
                <div className="h-6 w-28 animate-pulse rounded-none bg-surface-tertiary" />
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-12 animate-pulse rounded-full bg-surface-tertiary" />
                  <div className="space-y-1">
                    <div className="h-4 w-24 animate-pulse rounded-none bg-surface-tertiary" />
                    <div className="h-3 w-20 animate-pulse rounded-none bg-surface-tertiary" />
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="space-y-1">
                  <div className="h-4 w-20 animate-pulse rounded-none bg-surface-tertiary" />
                  <div className="h-3 w-12 animate-pulse rounded-none bg-surface-tertiary" />
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="h-4 w-24 animate-pulse rounded-none bg-surface-tertiary" />
              </td>
              <td className="px-4 py-4">
                <div className="h-4 w-24 animate-pulse rounded-none bg-surface-tertiary" />
              </td>
              <td className="px-4 py-4">
                <div className="h-4 w-32 animate-pulse rounded-none bg-surface-tertiary" />
              </td>
              <td className="px-4 py-4">
                <div className="h-4 w-28 animate-pulse rounded-none bg-surface-tertiary" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
