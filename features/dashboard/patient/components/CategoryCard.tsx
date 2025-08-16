import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string; // base color like "yellow", "green", "blue"
}

const CategoryCard = ({
  icon: Icon,
  title,
  description,
  color = "primary",
}: CategoryCardProps) => {
  // Automatically generate Tailwind classes for light & dark mode
  const cardColor = `bg-${color}-50 border-${color}-300 hover:bg-${color}-100 dark:bg-gray-900/20 dark:border-${color}-700`;
  const iconBgColor = `bg-${color}-200 dark:bg-${color}-800/40`;
  const iconColor = `text-${color}-600 dark:text-${color}-400`;
  const titleColor = `text-${color}-700 dark:text-${color}-300`;

  return (
    <Card
      className={`p-2 cursor-pointer transition-all duration-200 rounded-2xl ${cardColor}`}
    >
      <div className="flex flex-col gap-2">
        {/* Icon + Title in one line */}
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${iconBgColor} ${iconColor}`}>
            <Icon className="h-6 w-6" />
          </div>
          <h3 className={`font-semibold text-sm ${titleColor}`}>{title}</h3>
        </div>

        <Separator />

        {/* Description below */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>
    </Card>
  );
};

export default CategoryCard;
