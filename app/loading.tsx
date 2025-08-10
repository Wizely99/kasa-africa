import { LoadingPage } from "@/components/ui/loading-page"
import { Heart } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="flex items-center space-x-3 mb-8">
          <div className="relative">
            <Heart className="h-12 w-12 text-red-500 fill-current" />
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full animate-pulse" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">KasaAfrica</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">Healthcare Platform</p>
          </div>
        </div>

        <LoadingPage
          title="Welcome to KasaAfrica"
          description="Connecting you to quality healthcare across Africa. Please wait while we prepare your experience."
          variant="default"
          spinnerSize="xl"
          spinnerVariant="primary"
        />
      </div>
    </div>
  )
}
