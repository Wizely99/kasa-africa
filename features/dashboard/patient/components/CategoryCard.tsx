import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: "primary" | "success" | "info";
}

const CategoryCard = ({
  icon: Icon,
  title,
  description,
  variant = "primary",
}: CategoryCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "bg-success/10 border-success/20 hover:bg-success/20";
      case "info":
        return "bg-info/10 border-info/20 hover:bg-info/20";
      default:
        return "bg-primary/10 border-primary/20 hover:bg-primary/20";
    }
  };

  const getIconStyles = () => {
    switch (variant) {
      case "success":
        return "text-success";
      case "info":
        return "text-info";
      default:
        return "text-primary";
    }
  };

  return (
    <Card
      className={`p-1 cursor-pointer transition-all duration-200 ${getVariantStyles()}`}
    >
      <div className="flex flex-col gap-2">
        {/* Icon + Title in one line */}
        <div className="flex items-center gap-3 border-1">
          <div className={`p-3 rounded-lg bg-card ${getIconStyles()}`}>
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-foreground">{title}</h3>
        </div>

        {/* Description below */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </Card>
  );
};

export default CategoryCard;
