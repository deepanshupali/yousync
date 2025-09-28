import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { roomId: string } }
) {
  const data = await params;
  const messages = await prisma.message.findMany({
    where: { roomId: data.roomId },
    orderBy: { createdAt: "asc" },
    include: { user: true },
  });

  return NextResponse.json(messages);
}
