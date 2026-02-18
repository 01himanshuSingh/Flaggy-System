"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupInput } from "@/lib/schemas/signup.schema";
import { useSignup } from "@/lib/mutations/useSignup";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function SignupPage() {
  const signupMutation = useSignup();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data: SignupInput) => {
    signupMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Create your Flaggy account
          </h1>
          <p className="text-sm text-muted-foreground">
            Start managing feature flags professionally
          </p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-sm p-6">
          {/* Google Signup */}
          <button
            type="button"
            className="w-full bg-white border border-border rounded-sm py-2.5 px-3 text-sm font-medium hover:cursor-pointer flex items-center justify-center gap-2 mb-4"
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
              <label className="block text-xs font-medium mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  {...register("email")}
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
              <label className="block text-xs font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
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
            {signupMutation.isError && (
              <p className="text-xs text-destructive">
                {(signupMutation.error as Error).message}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={signupMutation.isPending}
              className="w-full bg-primary text-primary-foreground py-2 rounded-sm text-sm font-medium disabled:opacity-50"
            >
              {signupMutation.isPending
                ? "Creating account..."
                : "Create account"}
            </button>
          </form>
        </div>
         <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>
            You already have an account?{' '}
            <a href="/signin" className="text-primary hover:text-primary/80 font-medium">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
