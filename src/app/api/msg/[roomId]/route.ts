import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { roomId: string } }
) {
  const data = params;
  const messages = await prisma.message.findMany({
    where: { roomId: data.roomId },
    orderBy: { createdAt: "asc" },
    include: { user: true },
  });

  return NextResponse.json(messages);
}
