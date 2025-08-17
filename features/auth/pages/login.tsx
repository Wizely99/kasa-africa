"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { Heart, LogIn, Shield, Sparkles } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { HashLoader } from "react-spinners";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const isRefreshTokenError = session?.error === "RefreshTokenError";

    if (status === "authenticated" && !isRefreshTokenError) {
      router.push("/");
    }
  }, [router, session, session?.error, status]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-primary/20 backdrop-blur-xs rounded-full animate-pulse" />
          <HashLoader
            color="hsl(var(--primary))"
            size={100}
            speedMultiplier={0.9}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-30">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={crypto.randomUUID()}
              className="absolute bg-primary/10 rounded-full"
              style={{
                width: Math.random() * 200 + 30,
                height: Math.random() * 200 + 30,
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
              }}
              animate={{
                x: [0, Math.random() * 50 - 25],
                y: [0, Math.random() * 50 - 25],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: Math.random() * 8 + 8,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-scen px-4 py-4">
        <motion.div
          // initial={{ opacity: 0, y: 30, scale: 0.95 }}
          // animate={{ opacity: 1, y: 0, scale: 1 }}
          // transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-2xl"
        >
          {/* Clean card design */}
          <Card className="bg-white/80 backdrop-blur-xs shadow-2xl relative overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 " />

            <CardHeader className="relative space-y-4 pt-8 pb-8 text-center border-none border-0">
              {/* Logo section */}
              <motion.div
                // initial={{ scale: 0.8, opacity: 0 }}
                // animate={{ scale: 1, opacity: 1 }}
                // transition={{ delay: 0.2, duration: 0.6 }}
                className="flex justify-center mb-8"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-2xl opacity-50 scale-110" />
                  {/* <div className="relative w-72 h-48 bg-white/50 backdrop-blur-xs rounded-2xl p-6 border border-primary/30 shadow-lg"> */}
                  {/* <Image
                      src="/logo.jpg"
                      alt="Kasa Africa Logo"
                      fill
                      className="object-contain p-4"
                      priority
                    /> */}
                  <div className="flex aspect-square size-24 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Heart className="size-20" />
                  </div>
                  {/* </div> */}
                </div>
              </motion.div>

              {/* Animated title */}
              <motion.div
                // initial={{ opacity: 0, y: 20 }}
                // animate={{ opacity: 1, y: 0 }}
                // transition={{ delay: 0.4, duration: 0.6 }}
                className="space-y-4"
              >
                <CardTitle className="text-5xl font-bold bg-linear-to-r from-primary via-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  Welcome to Kasa Africa
                </CardTitle>
                <div className="flex items-center justify-center gap-2 text-slate-600">
                  <Sparkles className="size-5  text-primary" />
                  <CardDescription className="text-xl text-slate-700">
                    Connect with healthcare specialists
                  </CardDescription>
                  <Sparkles className="size-5  text-primary" />
                </div>
              </motion.div>
            </CardHeader>

            <CardContent className="relative px-12 py-4 space-y-4">
              {/* Sign in button */}
              <motion.div
                // initial={{ opacity: 0, y: 20 }}
                // animate={{ opacity: 1, y: 0 }}
                // transition={{ delay: 0.6, duration: 0.6 }}
                // whileHover={{ scale: 1.02 }}
                // whileTap={{ scale: 0.98 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-linear-to-r from-primary to-blue-600 rounded-xl blur-sm opacity-25 group-hover:opacity-40 transition-opacity" />
                <Button
                  className="relative w-full py-8 text-xl font-semibold bg-linear-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 border-0 rounded-xl shadow-lg text-white transition-all duration-300"
                  onClick={() =>
                    signIn("keycloak", { callbackUrl: "/patient" })
                  }
                >
                  <motion.div
                    className="flex items-center gap-3"
                    // whileHover={{ x: 5 }}
                    // transition={{ type: "spring", stiffness: 400 }}
                  >
                    <LogIn className="size-6 " />
                    Sign in to your health portal
                  </motion.div>
                </Button>
              </motion.div>

              {/* Security badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="flex items-center justify-center gap-2 text-slate-600"
              >
                <Shield className="size-4  text-primary" />
                <span className="text-sm">
                  HIPAA-compliant healthcare platform
                </span>
              </motion.div>
            </CardContent>

            <CardFooter className="relative px-12 pb-12">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="w-full space-y-6"
              >
                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-primary/20" />
                  </div>
                </div>

                {/* Terms */}
                <p className="text-sm text-slate-600 text-center leading-relaxed">
                  By continuing, you agree to our{" "}
                  <span className="text-primary hover:text-primary/80 cursor-pointer transition-colors font-medium">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-primary hover:text-primary/80 cursor-pointer transition-colors font-medium">
                    Privacy Policy
                  </span>
                </p>

                {/* Features list */}
                <div className="grid grid-cols-3 gap-6 pt-4">
                  {[
                    { icon: "👩‍⚕️", text: "Expert Specialists" },
                    { icon: "📱", text: "Virtual Consultations" },
                    { icon: "🩺", text: "Quality Healthcare" },
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                      className="text-center p-4 rounded-lg bg-primary/5 border border-primary/10"
                    >
                      <div className="text-2xl mb-2">{feature.icon}</div>
                      <div className="text-xs text-slate-600 font-medium">
                        {feature.text}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
