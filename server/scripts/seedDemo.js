import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Ticket from "../models/Ticket.js";
import AuditLog from "../models/AuditLog.js";

dotenv.config();

const demoUsers = [
  {
    name: "Demo Client",
    email: "demo.client@deskops.local",
    password: "DemoClient123",
    role: "CLIENT",
  },
  {
    name: "Demo Agent",
    email: "demo.agent@deskops.local",
    password: "DemoAgent123",
    role: "AGENT",
  },
  {
    name: "Demo Admin",
    email: "demo.admin@deskops.local",
    password: "DemoAdmin123",
    role: "ADMIN",
  },
];

const demoTickets = [
  {
    title: "Demo: Cannot access company email",
    description: "The mail client shows a connection timeout.",
    priority: "HIGH",
    status: "OPEN",
  },
  {
    title: "Demo: VPN connection request",
    description: "The client needs VPN access for remote work.",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
  },
  {
    title: "Demo: Printer driver installation",
    description: "The workstation needs the approved printer driver.",
    priority: "LOW",
    status: "RESOLVED",
  },
];

async function upsertDemoUser({ name, email, password, role }) {
  const passwordHash = await bcrypt.hash(password, 10);
  return User.findOneAndUpdate(
    { email },
    {
      $set: {
        name,
        password: passwordHash,
        role,
      },
      $setOnInsert: {
        activeTicketsCount: 0,
      },
    },
    { upsert: true, returnDocument: "after", runValidators: true },
  );
}

async function seedDemo() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const users = {};
  for (const demoUser of demoUsers) {
    users[demoUser.role] = await upsertDemoUser(demoUser);
  }

  const ticketIds = [];
  for (const demoTicket of demoTickets) {
    const ticket = await Ticket.findOneAndUpdate(
      { title: demoTicket.title, createdBy: users.CLIENT._id },
      {
        $set: {
          description: demoTicket.description,
          priority: demoTicket.priority,
          status: demoTicket.status,
          assignedTo:
            demoTicket.status === "IN_PROGRESS" ? users.AGENT._id : null,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    ticketIds.push(ticket._id);
  }

  await AuditLog.deleteMany({ ticketId: { $in: ticketIds } });

  const auditLogs = [
    {
      ticketId: ticketIds[0],
      action: "Demo ticket created by client",
      performedBy: users.CLIENT._id,
    },
    {
      ticketId: ticketIds[1],
      action: "Demo ticket assigned to agent",
      performedBy: users.AGENT._id,
    },
    {
      ticketId: ticketIds[2],
      action: "Demo ticket resolved by agent",
      performedBy: users.AGENT._id,
    },
  ];

  await AuditLog.insertMany(auditLogs);

  console.log("Demo data seeded successfully.");
  console.log("Client: demo.client@deskops.local / DemoClient123");
  console.log("Agent:  demo.agent@deskops.local / DemoAgent123");
  console.log("Admin:  demo.admin@deskops.local / DemoAdmin123");
}

try {
  await seedDemo();
} catch (error) {
  console.error(`Demo seed failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
