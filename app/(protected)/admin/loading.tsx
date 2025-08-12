import { LoadingPage } from "@/components/loading-page"
import { Settings, BarChart3, Users, Shield } from "lucide-react"

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="flex items-center space-x-4 mb-8">
          <div className="relative">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-purple-600 animate-pulse" />
              <Settings className="h-8 w-8 text-gray-600" />
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <LoadingPage
          title="Loading Admin Dashboard"
          description="Preparing system management tools, analytics, user management, and platform administration features."
          variant="default"
          spinnerSize="lg"
          spinnerVariant="primary"
        />
      </div>
    </div>
  )
}
