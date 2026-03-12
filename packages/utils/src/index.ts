import { format, parseISO } from "date-fns";

export function formatCurrency(amount: number): string {
  return "\u20B9" + amount.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export function formatDate(date: Date | string, fmt = "dd/MM/yyyy"): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, fmt);
}

export function formatDateTime(date: Date | string): string {
  return formatDate(date, "dd/MM/yyyy hh:mm a");
}

export function formatTime(date: Date | string): string {
  return formatDate(date, "hh:mm a");
}

export function generateOrderNumber(prefix = "ORD"): string {
  const date = format(new Date(), "yyyyMMdd");
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${date}${rand}`;
}

export function getWhatsAppLink(phone: string, message: string): string {
  const clean = phone.replace(/\D/g, "");
  const num = clean.startsWith("91") ? clean : `91${clean}`;
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}

export function generateInvoiceMessage(order: {
  orderNumber: string; customerName: string;
  items: { name: string; quantity: number; unit: string; price: number }[];
  subtotal: number; deliveryCharge: number; total: number;
  storeName: string; storePhone: string;
}): string {
  let msg = `*${order.storeName}*\nPhone: ${order.storePhone}\n--------\n`;
  msg += `Bill: ${order.orderNumber}\nCustomer: ${order.customerName}\n--------\n`;
  order.items.forEach((i, idx) => {
    msg += `${idx + 1}. ${i.name}\n   ${i.quantity} ${i.unit} x Rs${i.price} = Rs${(i.quantity * i.price).toFixed(0)}\n`;
  });
  msg += `--------\nSubtotal: Rs${order.subtotal}\n`;
  if (order.deliveryCharge > 0) msg += `Delivery: Rs${order.deliveryCharge}\n`;
  msg += `*Total: Rs${order.total}*\n--------\nThank you!`;
  return msg;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
