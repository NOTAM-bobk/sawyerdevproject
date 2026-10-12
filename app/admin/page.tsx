import type { Metadata } from "next";
import { AdminClients } from "@/components/admin-clients";
import { AdminInvoices } from "@/components/admin-invoices";
import { AdminLogin } from "@/components/admin-login";
import { AdminSubmissions } from "@/components/admin-submissions";
import { Container } from "@/components/ui";
import { isAdminConfigured, isSignedIn } from "@/lib/admin";
import { listInvoices } from "@/lib/invoices";
import type { Invoice } from "@/lib/invoice-types";
import { listProjects, type Project } from "@/lib/projects";
import { isStorageConfigured, listSubmissions, type Submission } from "@/lib/submissions";

/**
 * Private admin panel. Force-dynamic: it reads a cookie and the database, so
 * there is nothing here to cache or prerender — and every response is no-store.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminPage() {
  const signedIn = await isSignedIn();
  const storageReady = isStorageConfigured();

  if (!signedIn) {
    return (
      <Container className="flex min-h-[70vh] flex-col justify-center py-20">
        <AdminLogin configured={isAdminConfigured()} />
      </Container>
    );
  }

  // A database outage should say so, not throw a stack trace at you.
  let submissions: Submission[] = [];
  let projects: Project[] = [];
  let invoices: Invoice[] = [];
  let storageError = "";
  if (storageReady) {
    try {
      [submissions, projects, invoices] = await Promise.all([
        listSubmissions(),
        listProjects(),
        listInvoices(),
      ]);
    } catch (error) {
      storageError = error instanceof Error ? error.message : "Could not reach storage.";
    }
  }

  return (
    <Container className="py-16 md:py-20 space-y-12">
      <AdminSubmissions
        submissions={submissions}
        storageReady={storageReady}
        storageError={storageError}
      />

      {storageReady && !storageError ? <AdminClients projects={projects} /> : null}

      {storageReady && !storageError ? <AdminInvoices initialInvoices={invoices} /> : null}
    </Container>
  );
}
