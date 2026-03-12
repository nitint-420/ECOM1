import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding...\n");

  await prisma.user.upsert({
    where: { phone: "9999999999" }, update: {},
    create: { phone: "9999999999", email: "admin@store.com", password: await bcrypt.hash("admin123", 10), name: "Admin", role: "ADMIN" },
  });
  console.log("Admin: 9999999999 / admin123");

  await prisma.user.upsert({
    where: { phone: "9999999998" }, update: {},
    create: { phone: "9999999998", email: "staff@store.com", password: await bcrypt.hash("staff123", 10), name: "Staff", role: "STAFF" },
  });

  const cats = [
    { name: "Atta & Flour", slug: "atta-flour", sortOrder: 1 },
    { name: "Rice & Dal", slug: "rice-dal", sortOrder: 2 },
    { name: "Oil & Ghee", slug: "oil-ghee", sortOrder: 3 },
    { name: "Spices & Masala", slug: "spices-masala", sortOrder: 4 },
    { name: "Sugar & Salt", slug: "sugar-salt", sortOrder: 5 },
    { name: "Tea & Coffee", slug: "tea-coffee", sortOrder: 6 },
    { name: "Biscuits & Snacks", slug: "biscuits-snacks", sortOrder: 7 },
    { name: "Dairy Products", slug: "dairy", sortOrder: 8 },
  ];
  for (const c of cats) await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
  console.log("Categories: " + cats.length);

  const get = (slug: string) => prisma.category.findUnique({ where: { slug } });
  const atta = await get("atta-flour");
  const rice = await get("rice-dal");
  const oil = await get("oil-ghee");
  const spice = await get("spices-masala");
  const snack = await get("biscuits-snacks");
  const sugar = await get("sugar-salt");
  const tea = await get("tea-coffee");

  const prods = [
    { name: "Aashirvaad Atta 5kg", sku: "ATTA001", barcode: "8901063010101", categoryId: atta!.id, mrp: 280, sellingPrice: 265, costPrice: 240, stock: 50, unit: "PCS", isFeatured: true },
    { name: "Aashirvaad Atta 10kg", sku: "ATTA002", barcode: "8901063010102", categoryId: atta!.id, mrp: 520, sellingPrice: 495, costPrice: 460, stock: 30, unit: "PCS", isFeatured: true },
    { name: "Fortune Chakki Atta 5kg", sku: "ATTA003", barcode: "8901063010103", categoryId: atta!.id, mrp: 260, sellingPrice: 245, costPrice: 220, stock: 40, unit: "PCS" },
    { name: "India Gate Basmati 5kg", sku: "RICE001", barcode: "8901063020101", categoryId: rice!.id, mrp: 650, sellingPrice: 620, costPrice: 580, stock: 40, unit: "PCS", isFeatured: true },
    { name: "Toor Dal 1kg", sku: "DAL001", barcode: "8901063020103", categoryId: rice!.id, mrp: 160, sellingPrice: 150, costPrice: 130, stock: 80, unit: "KG", isFeatured: true },
    { name: "Moong Dal 1kg", sku: "DAL002", barcode: "8901063020104", categoryId: rice!.id, mrp: 140, sellingPrice: 130, costPrice: 115, stock: 70, unit: "KG" },
    { name: "Fortune Sunflower Oil 1L", sku: "OIL001", barcode: "8901063030101", categoryId: oil!.id, mrp: 180, sellingPrice: 170, costPrice: 155, stock: 100, unit: "PCS", isFeatured: true },
    { name: "Amul Ghee 500ml", sku: "GHEE001", barcode: "8901063030104", categoryId: oil!.id, mrp: 320, sellingPrice: 305, costPrice: 280, stock: 30, unit: "PCS", isFeatured: true },
    { name: "MDH Garam Masala 100g", sku: "SPICE001", barcode: "8901063040101", categoryId: spice!.id, mrp: 95, sellingPrice: 90, costPrice: 78, stock: 100, unit: "PCS" },
    { name: "Everest Turmeric 200g", sku: "SPICE002", barcode: "8901063040102", categoryId: spice!.id, mrp: 75, sellingPrice: 70, costPrice: 60, stock: 120, unit: "PCS" },
    { name: "Parle-G 800g", sku: "BIS001", barcode: "8901063050101", categoryId: snack!.id, mrp: 100, sellingPrice: 95, costPrice: 82, stock: 150, unit: "PCS", isFeatured: true },
    { name: "Britannia Good Day 250g", sku: "BIS002", barcode: "8901063050102", categoryId: snack!.id, mrp: 50, sellingPrice: 48, costPrice: 40, stock: 100, unit: "PCS" },
    { name: "Sugar 1kg", sku: "SUG001", barcode: "8901063060101", categoryId: sugar!.id, mrp: 50, sellingPrice: 48, costPrice: 42, stock: 200, unit: "KG", isFeatured: true },
    { name: "Tata Salt 1kg", sku: "SALT001", barcode: "8901063060103", categoryId: sugar!.id, mrp: 28, sellingPrice: 26, costPrice: 22, stock: 150, unit: "PCS" },
    { name: "Tata Tea Gold 500g", sku: "TEA001", barcode: "8901063070101", categoryId: tea!.id, mrp: 280, sellingPrice: 265, costPrice: 240, stock: 60, unit: "PCS", isFeatured: true },
    { name: "Nescafe Classic 100g", sku: "COF001", barcode: "8901063070104", categoryId: tea!.id, mrp: 350, sellingPrice: 335, costPrice: 300, stock: 40, unit: "PCS" },
  ];

  for (const p of prods) {
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await prisma.product.upsert({ where: { sku: p.sku }, update: {}, create: { ...p, slug } });
  }
  console.log("Products: " + prods.length);

  const settings = [
    { key: "store_name", value: "My Grocery Store" },
    { key: "store_phone", value: "9876543210" },
    { key: "store_whatsapp", value: "9876543210" },
    { key: "store_email", value: "store@example.com" },
    { key: "store_address", value: "123, Main Market, City" },
    { key: "store_timing", value: "8:00 AM - 10:00 PM" },
    { key: "order_prefix", value: "ORD" },
  ];
  for (const s of settings) await prisma.setting.upsert({ where: { key: s.key }, update: { value: s.value }, create: s });

  const kAccounts = [
    { name: "Ramesh Kumar", phone: "9876543001", creditLimit: 5000, currentBalance: 1500, address: "Near Temple" },
    { name: "Suresh Sharma", phone: "9876543002", creditLimit: 10000, currentBalance: 3200, address: "Block B" },
    { name: "Mahesh Gupta", phone: "9876543003", creditLimit: 3000, currentBalance: 0, address: "Lane 4" },
  ];
  for (const a of kAccounts) await prisma.khataAccount.upsert({ where: { phone: a.phone }, update: {}, create: a });

  await prisma.product.updateMany({
    where: { image: null },
    data: {
      image: "https://via.placeholder.com/300x300"
    }
  });

  console.log("\n=== SEEDED! Login: 9999999999 / admin123 ===\n");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
