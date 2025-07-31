import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

export default function Settings() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Facility Name</CardTitle>
          <CardDescription>Used to identify your facility on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Input placeholder="Kasa Africa Health" />
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Save</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Manage how you receive notifications.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-start gap-2">
            <Checkbox id="new-appointment" defaultChecked />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="new-appointment"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                New Appointments
              </label>
              <p className="text-sm text-muted-foreground">Receive an email when a new appointment is booked.</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Checkbox id="cancellations" />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="cancellations"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Cancellations
              </label>
              <p className="text-sm text-muted-foreground">Receive an email when an appointment is cancelled.</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Save</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
