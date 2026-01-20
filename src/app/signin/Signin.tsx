"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema, SigninInput } from "@/lib/schemas/signin.schema";
import { authClient } from "@/lib/auth-client"; // adjust path if needed
import { useState } from "react";
import { toast } from "sonner";

export default function SigninForm() {
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
      const { data: result, error } =
        await authClient.signIn.email(
          {
            email: data.email,
            password: data.password,
            callbackURL: "/",
            rememberMe: false,
          },
          {
            // optional callbacks
            onError(ctx) {
              setServerError(ctx.error.message);
            },
          }
        );

      if (error) {
        setServerError(error.message||"An error occurred during sign-in.");
        toast.error(error.message||"An error occurred during sign-in.");
        return;
      }

      // success is handled by callbackURL redirect
    } catch (err: any) {
      setServerError("Something went wrong. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-sm w-full"
    >
      <div>
        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.email && (
          <p className="text-sm text-red-500">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          {...register("password")}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.password && (
          <p className="text-sm text-red-500">
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>

      
    </form>
  );
}
