import { randomBytes, randomUUID } from "node:crypto";
import type { CreateInvoiceInput, Invoice, InvoiceItem } from "@/lib/invoice-types";
import { getDb, isStorageConfigured } from "@/lib/mongodb";

export const INVOICES_COLLECTION = "invoices";

export * from "@/lib/invoice-types";

function generateSecureToken(): string {
  // 16 bytes = 32 hex characters, cryptographically unguessable
  return randomBytes(16).toString("hex");
}

function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `INV-${year}-${rand}`;
}

export async function createInvoice(input: CreateInvoiceInput): Promise<Invoice> {
  const id = `inv_${randomUUID().replace(/-/g, "").slice(0, 16)}`;
  const token = generateSecureToken();
  const number = generateInvoiceNumber();

  const items: InvoiceItem[] = input.items.map((item) => ({
    id: randomUUID(),
    description: item.description.trim(),
    quantity: Math.max(1, Number(item.quantity) || 1),
    unitPrice: Math.max(0, Number(item.unitPrice) || 0),
    total: Math.max(1, Number(item.quantity) || 1) * Math.max(0, Number(item.unitPrice) || 0),
  }));

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = 0; // standard flat services
  const total = subtotal + tax;

  const now = new Date();
  const defaultDue = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  const invoice: Invoice = {
    id,
    token,
    number,
    createdAt: now.toISOString(),
    dueDate: input.dueDate || defaultDue.toISOString().split("T")[0],
    status: "unpaid",
    clientName: input.clientName.trim(),
    clientEmail: input.clientEmail.trim(),
    clientCompany: input.clientCompany?.trim() || undefined,
    projectId: input.projectId || undefined,
    projectTitle: input.projectTitle || undefined,
    items,
    subtotal,
    tax,
    total,
    currency: "USD",
    notes: input.notes?.trim() || undefined,
  };

  if (isStorageConfigured()) {
    const db = await getDb();
    await db.collection<Invoice>(INVOICES_COLLECTION).insertOne(invoice);
  }

  return invoice;
}

export async function getInvoiceByTokenOrId(identifier: string): Promise<Invoice | null> {
  if (!identifier) return null;

  if (isStorageConfigured()) {
    const db = await getDb();
    const doc = await db
      .collection<Invoice>(INVOICES_COLLECTION)
      .findOne({
        $or: [{ token: identifier }, { id: identifier }],
      }, { projection: { _id: 0 } });

    if (doc) return doc as Invoice;
  }

  return null;
}

export async function markInvoiceAsPaid({
  id,
  paypalOrderId,
  paypalCaptureId,
  paypalPayerEmail,
  paypalPayerName,
}: {
  id: string;
  paypalOrderId: string;
  paypalCaptureId?: string;
  paypalPayerEmail?: string;
  paypalPayerName?: string;
}): Promise<Invoice | null> {
  const updateData: Partial<Invoice> = {
    status: "paid",
    paidAt: new Date().toISOString(),
    paypalOrderId,
    paypalCaptureId,
    paypalPayerEmail,
    paypalPayerName,
  };

  if (isStorageConfigured()) {
    const db = await getDb();
    const result = await db
      .collection<Invoice>(INVOICES_COLLECTION)
      .findOneAndUpdate(
        { $or: [{ id }, { token: id }] },
        { $set: updateData },
        { returnDocument: "after", projection: { _id: 0 } },
      );

    return result ? (result as Invoice) : null;
  }

  return null;
}

export async function listInvoices(limit = 100): Promise<Invoice[]> {
  if (!isStorageConfigured()) return [];

  const db = await getDb();
  const docs = await db
    .collection<Invoice>(INVOICES_COLLECTION)
    .find({}, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  return docs as Invoice[];
}

export async function deleteInvoice(id: string): Promise<boolean> {
  if (!isStorageConfigured()) return false;

  const db = await getDb();
  const res = await db.collection(INVOICES_COLLECTION).deleteOne({
    $or: [{ id }, { token: id }],
  });
  return res.deletedCount === 1;
}
