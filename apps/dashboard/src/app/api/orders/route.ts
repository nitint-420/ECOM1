import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@ecom/database";
import { generateOrderNumber } from "@ecom/utils";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({ take: 50, orderBy: { createdAt: "desc" }, include: { items: true } });
    return NextResponse.json({ orders });
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const orderNumber = generateOrderNumber("ORD");
    const order = await prisma.order.create({
      data: {
        orderNumber, orderType: body.orderType || "POS",
        customerName: body.customerName || "Walk-in", customerPhone: body.customerPhone || "",
        subtotal: body.subtotal, totalAmount: body.totalAmount,
        paymentMethod: body.paymentMethod,
        paymentStatus: body.paymentMethod === "KHATA" ? "PENDING" : "PAID",
        status: body.orderType === "ONLINE" ? "PENDING" : "DELIVERED",
        khataAccountId: body.khataAccountId || null,
        items: { create: body.items.map((i: any) => ({ productId: i.productId, productName: "", productUnit: "", quantity: i.quantity, unitPrice: i.unitPrice, totalAmount: i.quantity * i.unitPrice })) },
      },
      include: { items: true },
    });

    for (const item of body.items) {
      const prod = await prisma.product.findUnique({ where: { id: item.productId } });
      if (prod) {
        await prisma.orderItem.updateMany({ where: { orderId: order.id, productId: item.productId }, data: { productName: prod.name, productUnit: prod.unit } });
        await prisma.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } });
        await prisma.stockLog.create({ data: { productId: item.productId, type: "SALE", quantity: item.quantity, previousStock: prod.stock, newStock: prod.stock - item.quantity, reference: orderNumber } });
      }
    }

    if (body.khataAccountId) {
      const acc = await prisma.khataAccount.findUnique({ where: { id: body.khataAccountId } });
      if (acc) {
        const newBal = acc.currentBalance + body.totalAmount;
        await prisma.khataAccount.update({ where: { id: body.khataAccountId }, data: { currentBalance: newBal } });
        await prisma.khataTransaction.create({ data: { khataAccountId: body.khataAccountId, type: "CREDIT", amount: body.totalAmount, balanceAfter: newBal, description: "Sale - " + orderNumber, reference: order.id } });
      }
    } else {
      await prisma.dayBook.create({ data: { type: "INCOME", category: "Sales", description: "Order " + orderNumber, amount: body.totalAmount, paymentMode: body.paymentMethod, reference: order.id } });
    }

    const full = await prisma.order.findUnique({ where: { id: order.id }, include: { items: { include: { product: true } } } });
    return NextResponse.json({ order: full });
  } catch (e) { console.error(e); return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
