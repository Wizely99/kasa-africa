import { redirect } from "next/navigation"

export default function RegisterPage() {
  // As per SRS, /register redirects to the landing page for patient signup.
  redirect("/")
  return null // This component will not render anything as it redirects
}
