import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import "dotenv/config";

const pool = new pg.Pool({ connectionString: process.env["DATABASE_URL"] });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '../db.json');

async function migrate() {
  try {
    const data = JSON.parse(await fs.readFile(DB_FILE, 'utf-8'));

    // Clear existing data (optional, but good for a fresh start)
    await prisma.logEntry.deleteMany();
    await prisma.saleHistoryEntry.deleteMany();
    await prisma.saleItem.deleteMany();
    await prisma.sale.deleteMany();
    await prisma.product.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.serviceOrder.deleteMany();
    await prisma.user.deleteMany();
    await prisma.setting.deleteMany();

    console.log('Migrating products...');
    for (const p of data.products) {
      await prisma.product.create({
        data: {
          id: p.id,
          name: p.name,
          category: p.category,
          quantity: p.quantity,
          price: p.price,
          costPrice: p.costPrice,
          sku: p.sku,
          condition: p.condition,
          lastUpdated: new Date(p.lastUpdated),
          isService: p.isService || false,
        },
      });
    }

    console.log('Migrating customers...');
    for (const c of data.customers) {
      await prisma.customer.create({
        data: {
          id: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone,
          cpf: c.cpf,
          address: c.address,
          totalSpent: c.totalSpent || 0,
          lastPurchase: c.lastPurchase ? new Date(c.lastPurchase) : null,
          createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
        },
      });
    }

    console.log('Migrating sales...');
    for (const s of data.sales) {
      await prisma.sale.create({
        data: {
          id: s.id,
          totalValue: s.totalValue,
          discount: s.discount,
          finalValue: s.finalValue,
          seller: s.seller,
          customerName: s.customerName,
          customerEmail: s.customerEmail,
          customerCPF: s.customerCPF,
          customerPhone: s.customerPhone,
          paymentMethod: s.paymentMethod,
          timestamp: new Date(s.timestamp),
          status: s.status || 'active',
          customerId: data.customers.find((c: any) => c.cpf === s.customerCPF)?.id,
          items: {
            create: s.items.map((item: any) => ({
              productId: item.productId,
              name: item.name,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              costPrice: item.costPrice,
              priceType: item.priceType,
              warranty: item.warranty,
              total: item.total,
            })),
          },
          history: {
            create: (s.history || []).map((h: any) => ({
              timestamp: new Date(h.timestamp),
              userId: h.userId,
              userName: h.userName,
              action: h.action,
              details: h.details,
              previousState: h.previousState,
            })),
          },
        },
      });
    }

    console.log('Migrating service orders...');
    for (const so of data.service_orders) {
      await prisma.serviceOrder.create({
        data: {
          id: so.id,
          customerName: so.customerName,
          customerPhone: so.customerPhone,
          customerCPF: so.customerCPF,
          equipment: so.equipment,
          serialNumber: so.serialNumber,
          problemDescription: so.problemDescription,
          status: so.status,
          priority: so.priority,
          entryDate: new Date(so.entryDate),
          deliveryDate: so.deliveryDate ? new Date(so.deliveryDate) : null,
          technician: so.technician,
          estimatedCost: so.estimatedCost,
          observations: so.observations,
          servicePerformed: so.servicePerformed,
          items: so.items, // JSON field
        },
      });
    }

    console.log('Migrating users...');
    for (const u of data.users) {
      await prisma.user.create({
        data: {
          id: u.id,
          username: u.username,
          password: u.password,
          role: u.role,
          name: u.name,
        },
      });
    }

    console.log('Migrating logs...');
    for (const l of data.logs) {
      await prisma.logEntry.create({
        data: {
          id: l.id || undefined,
          timestamp: new Date(l.timestamp),
          userId: l.userId,
          userName: l.userName,
          action: l.action,
          details: l.details,
          payload: l.payload,
        },
      });
    }

    console.log('Migrating settings...');
    for (const [key, value] of Object.entries(data.settings)) {
      await prisma.setting.create({
        data: {
          key,
          value: String(value),
        },
      });
    }

    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
