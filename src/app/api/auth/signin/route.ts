import { NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // Better Auth server instance

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // 🔐 Better Auth sign-in
    const response = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      asResponse: true, // returns Response object
    });

    // ❌ Invalid credentials
    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { message: error.message || "Invalid credentials" },
        { status: response.status }
      );
    }

    // ✅ Success → forward auth cookies/session
    return response;
  } catch (error) {
    console.error("Signin error:", error);

    return NextResponse.json(
      { message: "Something went wrong during sign-in" },
      { status: 500 }
    );
  }
}
