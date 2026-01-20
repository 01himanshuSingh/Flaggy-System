import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type SignupInput = {
  email: string;
  password: string;
};

export function useSignup() {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ email, password }: SignupInput) => {
      const { data, error } = await authClient.signUp.email({
        name: email.split("@")[0],
        email,
        password,
        callbackURL: "/",
      });

      if (error) {
        throw new Error(error.message || "Signup failed");
      }

      return data;
    },

    onSuccess: () => {
      toast.success("Account created successfully 🎉");
      router.push("/");
    },

    onError: (error: any) => {
      toast.error(error.message || "Signup failed");
    },
  });
}
