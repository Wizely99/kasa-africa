import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const AppointmentCard = ({
  doctor,
  type,
  date,
  time,
  status,
}: { doctor: string; type: string; date: string; time: string; status: "Upcoming" | "Completed" | "Cancelled" }) => (
  <Card>
    <CardContent className="p-4 flex items-center justify-between">
      <div>
        <p className="font-bold text-lg">{doctor}</p>
        <p className="text-sm text-muted-foreground">{type}</p>
        <p className="text-sm mt-1">
          {date} at {time}
        </p>
      </div>
      {status === "Upcoming" && (
        <div className="flex gap-2">
          <Button variant="outline">Reschedule</Button>
          <Button variant="destructive">Cancel</Button>
        </div>
      )}
    </CardContent>
  </Card>
)

export {AppointmentCard}