"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema, SigninInput } from "@/lib/schemas/signin.schema";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninInput>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = async (data: SigninInput) => {
    setServerError(null);

    try {
      const { error } = await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
          callbackURL: "/",
          rememberMe: false,
        },
        
        {onSuccess(ctx){
          toast.success("Signed in successfully!");
        },
          onError(ctx) {
            setServerError(ctx.error.message);
          },
        }
      );

      if (error) {
        setServerError(error.message || "Sign-in failed");
        toast.error(error.message || "Sign-in failed");
      }
    } catch {
      setServerError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Welcome to Flaggy
          </h1>
          <p className="text-sm text-muted-foreground">
            Rollback your features by our system
          </p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-xl p-6">
          {/* Google Sign In */}
          <button
            type="button"
            onClick={() => authClient.signIn.social({ provider: "google" })}
            className="w-full bg-white border border-border rounded-sm   py-2.5 px-3 text-sm font-medium hover:cursor-pointer flex items-center justify-center gap-2 mb-4"
          >
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  {...register("email")}
                  placeholder="your@email.com"
                  className="w-full pl-9 pr-3 py-2 border rounded-sm text-sm focus:ring-2 focus:ring-primary/20"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 border rounded-sm text-sm focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Server Error */}
            {serverError && (
              <p className="text-xs text-destructive">{serverError}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground py-2 rounded-sm text-sm font-medium disabled:opacity-50"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
       <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>
            Don't have an account?{' '}
            <a href="/signup" className="text-primary hover:text-primary/80 font-medium">
              Sign up
            </a>
          </p>
        </div>
      </div>
      
    </div>
  );
}
