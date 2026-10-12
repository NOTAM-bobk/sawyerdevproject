import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AdminProjectEditor } from "@/components/admin-project-editor";
import { Container } from "@/components/ui";
import { isSignedIn } from "@/lib/admin";
import { isStorageConfigured } from "@/lib/mongodb";
import { getProject } from "@/lib/projects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Client dashboard",
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminClientPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isSignedIn())) redirect("/admin");

  const { id } = await params;

  if (!isStorageConfigured()) {
    return (
      <Container className="py-16 md:py-20">
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">No dashboard to show.</h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
          Dashboards need somewhere to live. Add <code className="font-mono text-xs">MONGODB_URI</code>{" "}
          to your environment variables and redeploy.
        </p>
      </Container>
    );
  }

  let project = null;
  try {
    project = await getProject(id);
  } catch (error) {
    return (
      <Container className="py-16 md:py-20">
        <h1 className="text-3xl font-semibold tracking-[-0.04em]">Storage is unreachable.</h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
          The database could not be reached, so this dashboard can&apos;t be edited right now.
        </p>
        <p className="mt-3 font-mono text-[11px] break-all text-muted opacity-80">
          {error instanceof Error ? error.message : ""}
        </p>
      </Container>
    );
  }

  if (!project) notFound();

  return (
    <Container className="py-16 md:py-20">
      <AdminProjectEditor project={project} />
    </Container>
  );
}
