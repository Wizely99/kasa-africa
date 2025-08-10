import { FieldCategory } from "@/features/dashboard/types/dashboard";

export class CategoryLimits {
    static readonly EXCELLENT_MIN = 90;
    static readonly GOOD_MIN = 80;
    static readonly AVERAGE_MIN = 70;
    static readonly FAIR_MIN = 50;
    static getLabel(score: number): string {
        if (score >= this.EXCELLENT_MIN) return "Excellent";
        if (score >= this.GOOD_MIN) return "Good";
        if (score >= this.AVERAGE_MIN) return "Average";
        if (score >= this.FAIR_MIN) return "Fair";
        return "Poor";
    }
}

export const getCategoryRange = (label: keyof FieldCategory): string => {
    switch (label.toLowerCase()) {
        case "excellent":
            return `${CategoryLimits.EXCELLENT_MIN} - 100%`;
        case "good":
            return `${CategoryLimits.GOOD_MIN} - ${CategoryLimits.EXCELLENT_MIN - 1}%`;
        case "average":
            return `${CategoryLimits.AVERAGE_MIN} - ${CategoryLimits.GOOD_MIN - 1}%`;
        case "fair":
            return `${CategoryLimits.FAIR_MIN} - ${CategoryLimits.AVERAGE_MIN - 1}%`;
        case "poor":
            return `0 - ${CategoryLimits.FAIR_MIN - 1}%`;
        default:
            return "Unknown Category";
    }
};
export const getCategoryLabelColor = (label: keyof FieldCategory):string=> {
    switch (label.toLowerCase()) {
      case "excellent":
        return "#22c55e";
      case "good":
        return "#3b82f6";
      case "average":
        return "#f59e0b";
      case "fair":
        return "#fb923c";
      case "poor":
        return "#f87171";
    default:
    return ""
    }
  };
