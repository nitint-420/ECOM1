import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@ecom/database";
export async function GET() {
  try {
    const accounts = await prisma.khataAccount.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });
    return NextResponse.json({ accounts });
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const account = await prisma.khataAccount.create({ data: { name: body.name, phone: body.phone, address: body.address || null, creditLimit: body.creditLimit || 5000 } });
    return NextResponse.json({ account });
  } catch (e: any) {
    if (e.code === "P2002") return NextResponse.json({ error: "Phone exists" }, { status: 400 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
