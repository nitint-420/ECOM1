import { NextResponse } from "next/server";
import { prisma } from "@ecom/database";
import { getSession } from "@/lib/auth";
export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { id: true, name: true, phone: true, email: true, role: true } });
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ user });
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
