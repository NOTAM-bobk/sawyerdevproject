/**
 * Types for private client invoices and PayPal payments.
 */

export type InvoiceStatus = "unpaid" | "paid" | "cancelled";

export type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number; // in USD
  total: number;
};

export type Invoice = {
  id: string; // e.g. inv_xxxxxxxxxxxx
  token: string; // Unguessable secret token used in URL
  number: string; // e.g. "INV-2026-001"
  createdAt: string;
  dueDate: string;
  paidAt?: string;
  status: InvoiceStatus;
  
  // Client info
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  
  // Optional link to project
  projectId?: string;
  projectTitle?: string;
  
  // Financials
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string; // Default "USD"
  
  notes?: string;
  
  // Payment capture records
  paypalOrderId?: string;
  paypalCaptureId?: string;
  paypalPayerEmail?: string;
  paypalPayerName?: string;
};

export type CreateInvoiceInput = {
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  projectId?: string;
  projectTitle?: string;
  dueDate?: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
  notes?: string;
};
