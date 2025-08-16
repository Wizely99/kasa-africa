import { Card } from "@/components/ui/card";
import { Heart, Shield } from "lucide-react";

const healthTipsData = [
  {
    id: 1,
    title: "10 Tips for a Healthy Heart: Love Your Heart Live Longer",
    icon: Heart,
    color: "text-red-500",
  },
  {
    id: 2,
    title: "Immunity's Shield Against Infectious Diseases",
    icon: Shield,
    color: "text-info",
  },
];

const HealthTips = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">
        Health Tips & Blogs
      </h3>
      <div className="space-y-4">
        {healthTipsData.map((tip) => (
          <div
            key={tip.id}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
          >
            <div className={`p-2 rounded-lg bg-card ${tip.color}`}>
              <tip.icon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground leading-relaxed">
                {tip.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default HealthTips;
