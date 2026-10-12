import { isSignedIn } from "@/lib/admin";
import { isStorageConfigured, listSubmissions, submissionsCsv } from "@/lib/submissions";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isSignedIn())) {
    return new Response("Not signed in.", { status: 401 });
  }
  if (!isStorageConfigured()) {
    return new Response("Storage is not connected.", { status: 503 });
  }

  const submissions = await listSubmissions();
  const stamp = new Date().toISOString().slice(0, 10);

  return new Response(submissionsCsv(submissions), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="enquiries-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
