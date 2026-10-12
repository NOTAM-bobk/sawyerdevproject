/**
 * PayPal REST API integration.
 *
 * Keeps PAYPAL_CLIENT_SECRET strictly server-side.
 * The client only receives the PayPal Client ID to initialize PayPalButtons.
 * Order creation and payment capture are executed and verified on the server.
 */

const clientId =
  process.env.PAYPAL_CLIENT_ID?.trim() ||
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.trim() ||
  "";

const clientSecret = process.env.PAYPAL_CLIENT_SECRET?.trim() || "";

const environment = (
  process.env.PAYPAL_ENVIRONMENT?.trim() ||
  (clientId.startsWith("sb-") || clientId.length < 30 ? "sandbox" : "production")
).toLowerCase() as "sandbox" | "production";

export function isPayPalConfigured(): boolean {
  return Boolean(clientId && clientSecret);
}

export function getPayPalPublicConfig() {
  return {
    clientId: clientId || "test",
    configured: isPayPalConfigured(),
    environment,
    currency: "USD",
  };
}

function getBaseUrl(): string {
  return environment === "sandbox"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";
}

let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getPayPalAccessToken(): Promise<string> {
  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials (PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET) are not set.");
  }

  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 60000) {
    return cachedToken.token;
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(`${getBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PayPal OAuth token request failed (${response.status}): ${errorText}`);
  }

  const data = (await response.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    token: data.access_token,
    expiresAt: now + data.expires_in * 1000,
  };

  return data.access_token;
}

export async function createPayPalCheckoutOrder({
  invoiceId,
  invoiceNumber,
  description,
  total,
  items,
}: {
  invoiceId: string;
  invoiceNumber: string;
  description: string;
  total: number;
  items: Array<{ description: string; quantity: number; unitPrice: number }>;
}): Promise<string> {
  const token = await getPayPalAccessToken();

  const formattedTotal = total.toFixed(2);
  const purchaseUnit: Record<string, unknown> = {
    reference_id: invoiceId,
    description: description.slice(0, 127),
    custom_id: invoiceId,
    invoice_id: invoiceNumber,
    amount: {
      currency_code: "USD",
      value: formattedTotal,
    },
  };

  if (items.length > 0) {
    const itemsTotal = items
      .reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
      .toFixed(2);

    if (itemsTotal === formattedTotal) {
      purchaseUnit.items = items.map((item) => ({
        name: item.description.slice(0, 127),
        unit_amount: {
          currency_code: "USD",
          value: item.unitPrice.toFixed(2),
        },
        quantity: String(item.quantity),
      }));
      (purchaseUnit.amount as Record<string, unknown>).breakdown = {
        item_total: {
          currency_code: "USD",
          value: itemsTotal,
        },
      };
    }
  }

  const response = await fetch(`${getBaseUrl()}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [purchaseUnit],
      application_context: {
        brand_name: "Sawyer Schulz Web Design",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        shipping_preference: "NO_SHIPPING",
      },
    }),
  });

  const data = (await response.json()) as { id?: string; error?: string; message?: string };
  if (!response.ok || !data.id) {
    throw new Error(data.message || data.error || `Failed to create PayPal order (${response.status})`);
  }

  return data.id;
}

export async function capturePayPalCheckoutOrder(orderId: string): Promise<{
  id: string;
  status: string;
  captureId?: string;
  payerEmail?: string;
  payerName?: string;
}> {
  const token = await getPayPalAccessToken();

  const response = await fetch(`${getBaseUrl()}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
  });

  const data = (await response.json()) as {
    id: string;
    status: string;
    purchase_units?: Array<{
      payments?: {
        captures?: Array<{ id: string; status: string }>;
      };
    }>;
    payer?: {
      email_address?: string;
      name?: { given_name?: string; surname?: string };
    };
    error?: string;
    message?: string;
  };

  if (!response.ok || data.status !== "COMPLETED") {
    throw new Error(
      data.message || data.error || `PayPal payment capture failed with status: ${data.status}`,
    );
  }

  const capture = data.purchase_units?.[0]?.payments?.captures?.[0];
  const payerName = [data.payer?.name?.given_name, data.payer?.name?.surname]
    .filter(Boolean)
    .join(" ");

  return {
    id: data.id,
    status: data.status,
    captureId: capture?.id,
    payerEmail: data.payer?.email_address,
    payerName,
  };
}
