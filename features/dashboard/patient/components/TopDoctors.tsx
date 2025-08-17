import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { mockDoctors } from "@/features/appointments/types/data";
import { Separator } from "@/components/ui/separator";

const TopDoctors = () => {
  const topDoctors = [...mockDoctors]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold text-foreground">Top Doctors</h3>
      <Separator className="my-2" />

      <div className="space-y-4">
        {topDoctors.map((doctor) => (
          <div key={doctor.id} className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={doctor.avatar} />
              <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h4 className="font-medium text-foreground">{doctor.name}</h4>
              <p className="text-sm text-muted-foreground">
                {doctor.specialization}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-warning text-warning" />
              <span className="text-sm font-medium">{doctor.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TopDoctors;
