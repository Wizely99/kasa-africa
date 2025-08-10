import { LoadingPage } from "@/components/loading-page"
import { Stethoscope, Users, ClipboardList, Activity } from "lucide-react"

export default function DoctorLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900">
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="flex items-center space-x-4 mb-8">
          <div className="relative">
            <div className="flex items-center space-x-2">
              <Stethoscope className="h-8 w-8 text-blue-600 animate-pulse" />
              <Users className="h-8 w-8 text-green-600" />
              <ClipboardList className="h-8 w-8 text-purple-600" />
              <Activity className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>

        <LoadingPage
          title="Loading Doctor Dashboard"
          description="Preparing your patient management tools, appointments, and medical practice dashboard. Ready to provide excellent care."
          variant="default"
          spinnerSize="lg"
          spinnerVariant="primary"
        />
      </div>
    </div>
  )
}
