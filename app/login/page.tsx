// import Link from "next/link"
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"

// export default function LoginPage() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
//       <Card className="w-full max-w-md">
//         <CardHeader className="space-y-1 text-center">
//           <CardTitle className="text-2xl font-bold">Patient Login</CardTitle>
//           <CardDescription>Enter your credentials to access your patient portal.</CardDescription>
//         </CardHeader>
//         <CardContent className="grid gap-4">
//           <div className="grid gap-2">
//             <Label htmlFor="email">Email</Label>
//             <Input id="email" type="email" placeholder="m@example.com" required />
//           </div>
//           <div className="grid gap-2">
//             <Label htmlFor="password">Password</Label>
//             <Input id="password" type="password" required />
//           </div>
//         </CardContent>
//         <CardFooter className="flex flex-col gap-4">
//           <Button className="w-full">Login</Button>
//           <p className="text-center text-sm text-gray-500 dark:text-gray-400">
//             Don&apos;t have an account?{" "}
//             <Link href="/register" className="font-medium underline" prefetch={false}>
//               Sign Up
//             </Link>
//           </p>
//         </CardFooter>
//       </Card>
//     </div>
//   )
// }
