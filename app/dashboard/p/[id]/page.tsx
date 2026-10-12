import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ClientDashboard } from "@/components/client-dashboard";
import { isSignedIn } from "@/lib/admin";
import { isStorageConfigured } from "@/lib/mongodb";
import { getProject } from "@/lib/projects";

/**
 * Preview of a single client's dashboard, for the admin only. The client's own
 * page is `/dashboard` itself, so this route never exposes anyone else.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard preview",
  robots: { index: false, follow: false, nocache: true },
};

export default async function DashboardPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!(await isSignedIn())) redirect("/dashboard");
  if (!isStorageConfigured()) notFound();

  let project = null;
  try {
    project = await getProject(id);
  } catch {
    project = null;
  }
  if (!project) notFound();

  return <ClientDashboard project={project} preview />;
}
