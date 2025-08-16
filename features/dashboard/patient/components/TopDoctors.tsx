import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const topDoctorsData = [
  {
    id: 1,
    name: "Dr. Adaora Green",
    specialty: "Cardiology",
    rating: 4.9,
    avatar: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Dr. Robert Brown",
    specialty: "Neurology",
    rating: 4.8,
    avatar: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Dr. Amina Green",
    specialty: "Pediatrics",
    rating: 4.9,
    avatar: "/placeholder.svg",
  },
];

const TopDoctors = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">
        Top Doctors
      </h3>
      <div className="space-y-4">
        {topDoctorsData.map((doctor) => (
          <div key={doctor.id} className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={doctor.avatar} />
              <AvatarFallback>{doctor.name.charAt(3)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h4 className="font-medium text-foreground">{doctor.name}</h4>
              <p className="text-sm text-muted-foreground">
                {doctor.specialty}
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
