import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@ecom/database";
import * as bcrypt from "bcryptjs";
import { createToken, setAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { phone, password } = await req.json();
    if (!phone || !password) return NextResponse.json({ error: "Required" }, { status: 400 });
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user || !(await bcrypt.compare(password, user.password))) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    if (user.role === "CUSTOMER") return NextResponse.json({ error: "Access denied" }, { status: 403 });
    if (!user.isActive) return NextResponse.json({ error: "Account disabled" }, { status: 403 });
    const token = await createToken({ userId: user.id, phone: user.phone, role: user.role, name: user.name });
    setAuthCookie(token);
    return NextResponse.json({ success: true, user: { id: user.id, name: user.name, phone: user.phone, role: user.role } });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
