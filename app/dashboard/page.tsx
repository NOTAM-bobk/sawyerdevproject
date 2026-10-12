import type { Metadata } from "next";
import { ClientDashboard } from "@/components/client-dashboard";
import { DashboardBar } from "@/components/dashboard-bar";
import { DashboardLogin } from "@/components/dashboard-login";
import { DashboardProjects } from "@/components/dashboard-projects";
import { Container } from "@/components/ui";
import { isAdminConfigured, isSignedIn } from "@/lib/admin";
import { clientProjectId } from "@/lib/client-auth";
import { isStorageConfigured } from "@/lib/mongodb";
import { getProject, listProjects, type Project } from "@/lib/projects";

/**
 * Private: one sign-in for clients and for Sawyer. Nothing here is cached or
 * indexable.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Client dashboard",
  robots: { index: false, follow: false, nocache: true },
};

export default async function DashboardPage() {
  const [admin, clientId] = await Promise.all([isSignedIn(), clientProjectId()]);
  const storageReady = isStorageConfigured();

  // Sawyer's own view: every client's dashboard in one list.
  if (admin && storageReady) {
    let projects: Project[] = [];
    let storageError = "";
    try {
      projects = await listProjects();
    } catch (error) {
      storageError = error instanceof Error ? error.message : "Could not reach storage.";
    }
    return (
      <>
        <DashboardBar
          label="Your dashboards"
          links={[{ href: "/admin", label: "Enquiries" }]}
        />
        <Container className="pt-10 pb-16 md:pt-14 md:pb-20">
          <DashboardProjects
            projects={projects}
            storageReady={storageReady}
            storageError={storageError}
          />
        </Container>
      </>
    );
  }

  // A client's own page.
  if (clientId && storageReady) {
    let project: Project | null = null;
    try {
      project = await getProject(clientId);
    } catch {
      project = null;
    }
    if (project) return <ClientDashboard project={project} />;
  }

  return (
    <>
      <DashboardBar label="Client dashboard" signedIn={false} />
      <Container className="flex min-h-[70vh] flex-col justify-center py-20">
        <DashboardLogin ready={isAdminConfigured() || storageReady} />
      </Container>
    </>
  );
}
