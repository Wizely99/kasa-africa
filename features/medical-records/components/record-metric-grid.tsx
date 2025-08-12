import { useIsMobile } from "@/hooks/use-mobile";
import { MetricCard } from "./record-metric-card";

interface Metric {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

interface MetricsGridProps {
  metrics: Metric[];
}
export function MetricsGrid({ metrics }: MetricsGridProps) {
  const isMobile = useIsMobile();

  return (
    <div
      className={`${
        isMobile ? "grid grid-cols-2" : "flex justify-between"
      } gap-4 w-full`}
    >
      {metrics.map((metric, index) => (
        <div key={index} className={isMobile ? "" : "flex-1 min-w-0"}>
          <MetricCard {...metric} />
        </div>
      ))}
    </div>
  );
}
