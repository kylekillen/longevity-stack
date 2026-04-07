// Competitor price comparison table.
// Shows our price highlighted vs competitor prices.

interface CompetitorRow {
  vendor: string;
  price: number | null;
  note?: string;
}

interface ComparisonTableProps {
  ourPrice: number | null;
  competitors: CompetitorRow[];
  title?: string;
  ourLabel?: string; // defaults to "The Longevity Agent"
  compact?: boolean; // smaller variant for stack builder
}

export default function ComparisonTable({
  ourPrice,
  competitors,
  title,
  ourLabel = "The Longevity Agent",
  compact = false,
}: ComparisonTableProps) {
  const allRows = [
    { vendor: ourLabel, price: ourPrice, note: undefined, isOurs: true },
    ...competitors.map((c) => ({ ...c, isOurs: false })),
  ];

  return (
    <div className={compact ? "" : "bg-[var(--card)] border border-[var(--card-border)] rounded-xl overflow-hidden"}>
      {title && (
        <div className="px-4 py-3 border-b border-[var(--card-border)]">
          <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wide">{title}</p>
        </div>
      )}
      <table className="w-full">
        <tbody className="divide-y divide-[var(--card-border)]">
          {allRows.map((row) => (
            <tr
              key={row.vendor}
              className={row.isOurs ? "bg-[var(--accent)]/8" : ""}
            >
              <td className={`px-4 py-2.5 ${compact ? "py-2" : ""}`}>
                <span
                  className={`text-sm font-medium ${
                    row.isOurs
                      ? "text-[var(--accent)] font-semibold"
                      : "text-[var(--foreground)]"
                  }`}
                >
                  {row.isOurs && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent)] mr-2 mb-0.5" />
                  )}
                  {row.vendor}
                </span>
                {row.note && (
                  <span className="text-xs text-[var(--muted-light)] ml-2">{row.note}</span>
                )}
              </td>
              <td className={`px-4 py-2.5 text-right ${compact ? "py-2" : ""}`}>
                {row.price !== null ? (
                  <span
                    className={`text-sm font-bold ${
                      row.isOurs ? "text-[var(--green)]" : "text-[var(--muted-light)]"
                    }`}
                  >
                    ${row.price}
                    <span className="text-xs font-normal text-[var(--muted-light)] ml-0.5">/mo</span>
                  </span>
                ) : (
                  <span className="text-sm text-[var(--muted-light)] font-mono">{"{{PRICE}}"}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!compact && (
        <div className="px-4 py-2 border-t border-[var(--card-border)] bg-[var(--surface)]">
          <p className="text-xs text-[var(--muted-light)]">Prices verified April 2026.</p>
        </div>
      )}
    </div>
  );
}
