import { LoadingPage } from "@/components/ui/loading-page"
import { Stethoscope, Heart, Calendar } from "lucide-react"

export default function PatientLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="flex items-center space-x-4 mb-8">
          <div className="relative">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-red-500 fill-current animate-pulse" />
              <Stethoscope className="h-8 w-8 text-blue-600" />
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <LoadingPage
          title="Loading Patient Portal"
          description="Preparing your health dashboard, appointments, and medical records. Your health journey continues here."
          variant="default"
          spinnerSize="lg"
          spinnerVariant="primary"
        />
      </div>
    </div>
  )
}
