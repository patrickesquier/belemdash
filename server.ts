import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env["JWT_SECRET"] || "default_secret";
const SALT_ROUNDS = 10;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new pg.Pool({ connectionString: process.env["DATABASE_URL"] });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });

export const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Security Middlewares
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
    req.user = user;
    next();
  });
};

const checkRole = (roles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied. Insufficient permissions." });
    }
    next();
  };
};

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Authentication
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Handle both hashed and plain text passwords (for transition)
  let validPassword = false;
  const isHashed = /^\$2[ayb]\$.{56}$/.test(user.password);
  
  if (isHashed) {
    validPassword = await bcrypt.compare(password, user.password);
  } else {
    validPassword = (password === user.password);
    // Auto-migrate to hashed if successful
    if (validPassword) {
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      });
    }
  }

  if (!validPassword) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({ 
    token, 
    user: { id: user.id, username: user.username, name: user.name, role: user.role } 
  });
});

// Protected routes middleware applied collectively
const protectedRouter = express.Router();
protectedRouter.use(authenticateToken);

// Products
protectedRouter.get("/products", async (req, res) => {
  const products = await prisma.product.findMany({
    orderBy: { name: 'asc' }
  });
  res.json(products);
});

protectedRouter.post("/products", async (req, res) => {
  const p = req.body;
  await prisma.product.upsert({
    where: { id: p.id },
    update: {
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
    create: {
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
  res.json({ success: true });
});

protectedRouter.delete("/products/:id", checkRole(['admin']), async (req, res) => {
  await prisma.product.delete({
    where: { id: req.params.id }
  });
  res.json({ success: true });
});

// Sellers
protectedRouter.get("/sellers", async (req, res) => {
  const sellers = await prisma.seller.findMany({
    orderBy: { name: 'asc' }
  });
  res.json(sellers);
});

protectedRouter.post("/sellers", async (req, res) => {
  const s = req.body;
  await prisma.seller.upsert({
    where: { id: s.id || 'new' },
    update: {
      name: s.name,
      email: s.email,
      phone: s.phone
    },
    create: {
      id: s.id || undefined,
      name: s.name,
      email: s.email,
      phone: s.phone
    },
  });
  res.json({ success: true });
});

protectedRouter.delete("/sellers/:id", checkRole(['admin']), async (req, res) => {
  await prisma.seller.delete({
    where: { id: req.params.id }
  });
  res.json({ success: true });
});

// Customers
protectedRouter.get("/sales", async (req, res) => {
  const sales = await prisma.sale.findMany({
    include: {
      items: true,
      history: true
    },
    orderBy: { timestamp: 'desc' }
  });
  res.json(sales);
});

protectedRouter.post("/sales", async (req, res) => {
  const s = req.body;
  await prisma.$transaction(async (tx) => {
    const existing = await tx.sale.findUnique({ where: { id: s.id } });
    if (existing) {
      await tx.saleItem.deleteMany({ where: { saleId: s.id } });
      await tx.saleHistoryEntry.deleteMany({ where: { saleId: s.id } });
      await tx.sale.update({
        where: { id: s.id },
        data: {
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
          customerId: s.customerId,
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
        }
      });
    } else {
      await tx.sale.create({
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
          customerId: s.customerId,
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
        }
      });
    }
  });
  res.json({ success: true });
});

protectedRouter.delete("/sales/:id", checkRole(['admin']), async (req, res) => {
  await prisma.$transaction([
    prisma.saleItem.deleteMany({ where: { saleId: req.params.id } }),
    prisma.saleHistoryEntry.deleteMany({ where: { saleId: req.params.id } }),
    prisma.sale.delete({ where: { id: req.params.id } })
  ]);
  res.json({ success: true });
});

// Customers
protectedRouter.get("/customers", async (req, res) => {
  const customers = await prisma.customer.findMany({
    orderBy: { name: 'asc' }
  });
  res.json(customers);
});

protectedRouter.post("/customers", async (req, res) => {
  const c = req.body;
  await prisma.customer.upsert({
    where: { id: c.id },
    update: {
      name: c.name,
      email: c.email,
      phone: c.phone,
      cpf: c.cpf,
      address: c.address,
      totalSpent: c.totalSpent || 0,
      lastPurchase: c.lastPurchase ? new Date(c.lastPurchase) : null,
      createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
    },
    create: {
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
  res.json({ success: true });
});

protectedRouter.delete("/customers/:id", async (req, res) => {
  await prisma.customer.delete({
    where: { id: req.params.id }
  });
  res.json({ success: true });
});

// Service Orders
protectedRouter.get("/service-orders", async (req, res) => {
  const orders = await prisma.serviceOrder.findMany({
    orderBy: { entryDate: 'desc' }
  });
  res.json(orders);
});

protectedRouter.post("/service-orders", async (req, res) => {
  const o = req.body;
  await prisma.serviceOrder.upsert({
    where: { id: o.id },
    update: {
      customerName: o.customerName,
      customerPhone: o.customerPhone,
      customerCPF: o.customerCPF,
      equipment: o.equipment,
      serialNumber: o.serialNumber,
      problemDescription: o.problemDescription,
      status: o.status,
      priority: o.priority,
      entryDate: new Date(o.entryDate),
      deliveryDate: o.deliveryDate ? new Date(o.deliveryDate) : null,
      technician: o.technician,
      estimatedCost: o.estimatedCost,
      observations: o.observations,
      servicePerformed: o.servicePerformed,
      items: o.items,
    },
    create: {
      id: o.id,
      customerName: o.customerName,
      customerPhone: o.customerPhone,
      customerCPF: o.customerCPF,
      equipment: o.equipment,
      serialNumber: o.serialNumber,
      problemDescription: o.problemDescription,
      status: o.status,
      priority: o.priority,
      entryDate: new Date(o.entryDate),
      deliveryDate: o.deliveryDate ? new Date(o.deliveryDate) : null,
      technician: o.technician,
      estimatedCost: o.estimatedCost,
      observations: o.observations,
      servicePerformed: o.servicePerformed,
      items: o.items,
    },
  });
  res.json({ success: true });
});

protectedRouter.delete("/service-orders/:id", async (req, res) => {
  await prisma.serviceOrder.delete({
    where: { id: req.params.id }
  });
  res.json({ success: true });
});

// Users
protectedRouter.get("/users", checkRole(['admin', 'supervisor']), async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, username: true, name: true, role: true },
    orderBy: { name: 'asc' }
  });
  res.json(users);
});

protectedRouter.post("/users", checkRole(['admin', 'supervisor']), async (req, res) => {
  const u = req.body;
  
  const updateData: any = {
    username: u.username,
    role: u.role,
    name: u.name,
  };

  if (u.password && String(u.password).trim() !== '') {
    const isHashed = /^\$2[ayb]\$.{56}$/.test(u.password);
    updateData.password = isHashed ? u.password : await bcrypt.hash(u.password, SALT_ROUNDS);
  }

  await prisma.user.upsert({
    where: { id: u.id || 'new_user_placeholder_to_force_create' },
    update: updateData,
    create: {
      id: u.id || undefined,
      username: u.username,
      password: updateData.password || await bcrypt.hash('123456', SALT_ROUNDS),
      role: u.role,
      name: u.name,
    },
  });
  res.json({ success: true });
});

protectedRouter.delete("/users/:id", checkRole(['admin']), async (req, res) => {
  await prisma.user.delete({
    where: { id: req.params.id }
  });
  res.json({ success: true });
});

// Logs
protectedRouter.get("/logs", checkRole(['admin']), async (req, res) => {
  const logs = await prisma.logEntry.findMany({
    orderBy: { timestamp: 'desc' },
    take: 1000
  });
  res.json(logs);
});

protectedRouter.post("/logs", async (req, res) => {
  const l = req.body;
  await prisma.logEntry.create({
    data: {
      timestamp: new Date(l.timestamp),
      userId: l.userId,
      userName: l.userName,
      action: l.action,
      details: l.details,
      payload: l.payload,
    }
  });
  res.json({ success: true });
});

// Settings
protectedRouter.get("/settings", async (req, res) => {
  const settings = await prisma.setting.findMany();
  const settingsObj = settings.reduce((acc: any, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {});
  res.json(settingsObj);
});

protectedRouter.post("/settings", checkRole(['admin']), async (req, res) => {
  const { key, value } = req.body;
  await prisma.setting.upsert({
    where: { key },
    update: { value: String(value) },
    create: { key, value: String(value) }
  });
  res.json({ success: true });
});

// Bulk Import
protectedRouter.post("/import", checkRole(['admin']), async (req, res) => {
  const data = req.body;
  await prisma.$transaction(async (tx) => {
    await tx.logEntry.deleteMany();
    await tx.saleHistoryEntry.deleteMany();
    await tx.saleItem.deleteMany();
    await tx.sale.deleteMany();
    await tx.product.deleteMany();
    await tx.customer.deleteMany();
    await tx.serviceOrder.deleteMany();
    await tx.user.deleteMany();
    await tx.setting.deleteMany();

    if (data.products) {
      for (const p of data.products) {
        await tx.product.create({ 
          data: { ...p, lastUpdated: new Date(p.lastUpdated), isService: p.isService || false } 
        });
      }
    }
    if (data.customers) {
      for (const c of data.customers) {
        await tx.customer.create({ 
          data: { ...c, lastPurchase: c.lastPurchase ? new Date(c.lastPurchase) : null, createdAt: c.createdAt ? new Date(c.createdAt) : new Date() } 
        });
      }
    }
    // ... sales, service_orders, users, etc. (OMITTED for brevity in plan, but FULL implementation below)
    if (data.sales) {
      for (const s of data.sales) {
        await tx.sale.create({
          data: {
            ...s,
            timestamp: new Date(s.timestamp),
            items: { create: s.items },
            history: { create: (s.history || []).map((h: any) => ({ ...h, timestamp: new Date(h.timestamp) })) }
          }
        });
      }
    }
    if (data.service_orders) {
      for (const so of data.service_orders) {
        await tx.serviceOrder.create({ data: { ...so, entryDate: new Date(so.entryDate), deliveryDate: so.deliveryDate ? new Date(so.deliveryDate) : null } });
      }
    }
    if (data.users) {
      for (const u of data.users) {
        // When importing users, we assume passwords might be plain text if they don't look hashed
        const isHashed = /^\$2[ayb]\$.{56}$/.test(u.password);
        const password = isHashed ? u.password : await bcrypt.hash(u.password, SALT_ROUNDS);
        await tx.user.create({ data: { ...u, password } });
      }
    }
    if (data.logs) {
      for (const l of data.logs) {
        await tx.logEntry.create({ data: { ...l, timestamp: new Date(l.timestamp) } });
      }
    }
    if (data.settings) {
      for (const [key, value] of Object.entries(data.settings)) {
        await tx.setting.create({ data: { key, value: String(value) } });
      }
    }
  });
  res.json({ success: true });
});

// Map the router
app.use("/api", protectedRouter);

export async function startServer() {
  const PORT = Number(process.env.PORT) || 3000;

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}
