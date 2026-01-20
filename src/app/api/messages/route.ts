import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content } = body;

    // Basic validation

    const message = await prisma.message.create({
      data: {
        id: randomUUID(),
        content:"knsddsdjsdnjsd",
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Create message error:", error);

    return NextResponse.json(
      { message: "Failed to create message" },
      { status: 500 }
    );
  }
}
