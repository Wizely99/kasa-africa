"use server"
import { createUserSchema } from "../schemas/user-schemas"

export async function createUserAction(
  prevState: { message: string; success: boolean } | undefined,
  formData: FormData,
) {
  try {
    const validatedFields = createUserSchema.safeParse({
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
    })

    if (!validatedFields.success) {
      return {
        message:
          validatedFields.error.flatten().fieldErrors.username?.[0] ||
          validatedFields.error.flatten().fieldErrors.email?.[0] ||
          validatedFields.error.flatten().fieldErrors.password?.[0] ||
          validatedFields.error.flatten().fieldErrors.role?.[0] ||
          "Invalid input.",
        success: false,
      }
    }

    // Simulate database storage
    console.log("New user data:", validatedFields.data)
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay

    return { message: "User created successfully!", success: true }
  } catch (error) {
    console.error("Error creating user:", error)
    return { message: "Failed to create user.", success: false }
  }
}
