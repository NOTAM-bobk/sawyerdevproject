"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink, FilePlus2, FileText, Loader2, Plus, Trash2 } from "lucide-react";
import type { Invoice } from "@/lib/invoice-types";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function AdminInvoices({
  initialInvoices = [],
}: {
  initialInvoices?: Invoice[];
}) {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [showModal, setShowModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form state
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    return d.toISOString().split("T")[0];
  });
  const [items, setItems] = useState([
    { description: "Custom Website Design & Development (Flat Fee)", quantity: 1, unitPrice: 1500 },
  ]);
  const [notes, setNotes] = useState("Payable via PayPal, card, or Pay in 4. 100% money back guarantee.");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  function addItem() {
    setItems((prev) => [...prev, { description: "", quantity: 1, unitPrice: 0 }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: string, val: string | number) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: val } : item)),
    );
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!clientName || !clientEmail) {
      setError("Client name and email are required.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          clientEmail,
          clientCompany,
          projectTitle,
          dueDate,
          items,
          notes,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.ok && data?.invoice) {
        setInvoices((prev) => [data.invoice, ...prev]);
        setShowModal(false);
        // Reset form
        setClientName("");
        setClientEmail("");
        setClientCompany("");
        setProjectTitle("");
        setItems([
          { description: "Custom Website Design & Development (Flat Fee)", quantity: 1, unitPrice: 1500 },
        ]);
      } else {
        setError(data?.error || "Failed to create invoice.");
      }
    } catch {
      setError("Network error creating invoice.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this invoice?")) return;

    try {
      const res = await fetch(`/api/admin/invoices/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok) {
        setInvoices((prev) => prev.filter((inv) => inv.id !== id && inv.token !== id));
      } else {
        alert(data?.error || "Failed to delete invoice.");
      }
    } catch {
      alert("Error deleting invoice.");
    }
  }

  async function copyInvoiceLink(invoice: Invoice) {
    const url = `${window.location.origin}/invoice/${invoice.token || invoice.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(invoice.id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      // fallback
    }
  }

  return (
    <section className="mt-14">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
            Client Invoices & PayPal Payments
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Create private, unlisted invoices and send direct payment links to your clients.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="btn3d btn3d-dark inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-medium text-paper self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          Create New Invoice
        </button>
      </div>

      {/* Invoice List */}
      <div className="surface rounded-2xl border border-line bg-paper overflow-hidden shadow-xs">
        {invoices.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="mx-auto h-8 w-8 text-muted/60 mb-3" />
            <p className="text-sm font-medium text-ink">No invoices created yet.</p>
            <p className="text-xs text-muted mt-1">
              Create an invoice to send a secure PayPal payment link to a client.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-mist/50 border-b border-line text-[11px] font-mono uppercase tracking-wider text-muted">
                <tr>
                  <th scope="col" className="px-6 py-3.5 font-medium">Invoice</th>
                  <th scope="col" className="px-6 py-3.5 font-medium">Client</th>
                  <th scope="col" className="px-6 py-3.5 font-medium">Amount</th>
                  <th scope="col" className="px-6 py-3.5 font-medium">Status</th>
                  <th scope="col" className="px-6 py-3.5 font-medium">Due Date</th>
                  <th scope="col" className="px-6 py-3.5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {invoices.map((inv) => {
                  const isPaid = inv.status === "paid";
                  const copied = copiedId === inv.id;

                  return (
                    <tr key={inv.id} className="hover:bg-mist/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono font-medium text-ink">{inv.number}</span>
                        {inv.projectTitle ? (
                          <span className="block text-xs text-muted truncate max-w-[180px]">
                            {inv.projectTitle}
                          </span>
                        ) : null}
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-semibold text-ink text-xs block">{inv.clientName}</span>
                        <span className="text-[11px] text-muted block truncate max-w-[200px]">
                          {inv.clientEmail}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-mono font-bold text-ink">
                        {formatCurrency(inv.total)}
                      </td>

                      <td className="px-6 py-4">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                            <Check className="h-3 w-3 stroke-[2.5]" />
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-300 px-2.5 py-0.5 text-[11px] font-medium text-amber-900">
                            Unpaid
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-xs text-muted">
                        {formatDate(inv.dueDate)}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => copyInvoiceLink(inv)}
                            className="inline-flex items-center gap-1 rounded-md border border-line px-2.5 py-1 text-xs text-muted hover:border-line-strong hover:text-ink transition-colors"
                            title="Copy private link to send to client"
                          >
                            {copied ? (
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                            <span>{copied ? "Copied Link" : "Copy Link"}</span>
                          </button>

                          <Link
                            href={`/invoice/${inv.token || inv.id}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 rounded-md border border-line px-2.5 py-1 text-xs text-muted hover:border-line-strong hover:text-ink transition-colors"
                            title="Open invoice"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(inv.id)}
                            className="rounded-md p-1.5 text-muted hover:text-red-600 transition-colors"
                            title="Delete invoice"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="surface max-h-[90vh] overflow-y-auto w-full max-w-2xl rounded-3xl border border-line bg-paper p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-line pb-4 mb-6">
              <div className="flex items-center gap-2">
                <FilePlus2 className="h-5 w-5 text-ink" />
                <h3 className="text-lg font-bold text-ink">Create Client Invoice</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-muted hover:text-ink text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            {error ? (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1">
                    Client Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1">
                    Company (optional)
                  </label>
                  <input
                    type="text"
                    value={clientCompany}
                    onChange={(e) => setClientCompany(e.target.value)}
                    placeholder="e.g. Acme Studio"
                    className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-muted mb-1">
                    Project Title (optional)
                  </label>
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g. Studio Redesign"
                    className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted mb-1">
                  Payment Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
                />
              </div>

              {/* Line Items */}
              <div className="border-t border-line pt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase text-muted font-semibold">
                    Line Items
                  </span>
                  <button
                    type="button"
                    onClick={addItem}
                    className="inline-flex items-center gap-1 text-xs text-ink hover:underline font-medium"
                  >
                    <Plus className="h-3 w-3" /> Add item
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => updateItem(index, "description", e.target.value)}
                        className="flex-1 rounded-lg border border-line px-3 py-2 text-xs text-ink focus:border-ink focus:outline-none"
                      />
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 1)}
                        className="w-16 rounded-lg border border-line px-2.5 py-2 text-xs text-ink focus:border-ink focus:outline-none text-center"
                      />
                      <div className="relative">
                        <span className="absolute left-2.5 top-2 text-xs text-muted">$</span>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Price"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, "unitPrice", parseFloat(e.target.value) || 0)}
                          className="w-24 rounded-lg border border-line pl-6 pr-2 py-2 text-xs text-ink focus:border-ink focus:outline-none"
                        />
                      </div>
                      {items.length > 1 ? (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-1 text-muted hover:text-red-500"
                        >
                          ✕
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>

                <div className="mt-3 text-right">
                  <span className="text-xs text-muted">Total: </span>
                  <span className="font-mono font-bold text-ink text-base">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted mb-1">
                  Notes / Terms
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-line bg-paper px-3.5 py-2 text-xs text-ink focus:border-ink focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-full px-5 py-2 text-xs text-muted hover:text-ink font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn3d btn3d-dark inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-medium text-paper"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Creating…
                    </>
                  ) : (
                    "Generate Private Invoice"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
