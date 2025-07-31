"use client"

import { useActionState, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createUserAction } from "../actions/user-actions"
import { type CreateUserSchema, createUserSchema } from "../schemas/user-schemas"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

interface AddUserFormProps {
  onSuccess?: () => void
}

export function AddUserForm({ onSuccess }: AddUserFormProps) {
  const [state, formAction, isPending] = useActionState(createUserAction, undefined)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
  })

  useState(() => {
    if (state?.success) {
      reset()
      onSuccess?.()
    }
  }, [state, reset, onSuccess])

  const onSubmit = (data: CreateUserSchema) => {
    const formData = new FormData()
    formData.append("username", data.username)
    formData.append("email", data.email)
    formData.append("password", data.password)
    formData.append("role", data.role)
    formAction(formData)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      {state && (
        <Alert variant={state.success ? "default" : "destructive"}>
          <Terminal className="h-4 w-4" />
          <AlertTitle>{state.success ? "Success!" : "Error!"}</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" placeholder="John Doe" {...register("username")} />
        {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="m@example.com" {...register("email")} />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...register("password")} />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="role">Role</Label>
        <Select onValueChange={(value) => setValue("role", value)} {...register("role")}>
          <SelectTrigger id="role">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="patient">Patient</SelectItem>
            <SelectItem value="doctor">Doctor</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Creating User..." : "Create User"}
      </Button>
    </form>
  )
}
