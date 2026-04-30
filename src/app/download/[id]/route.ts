import { readConfigFile, readManifest } from "@/lib/manifest";

interface DownloadRouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: DownloadRouteContext) {
  const { id } = await context.params;
  const manifest = await readManifest();
  const entry = manifest.entries.find((item) => item.id === id);

  if (!entry) {
    return new Response("Not found", { status: 404 });
  }

  const content = await readConfigFile(entry.storedPath);

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${entry.storedPath.split("/").pop() ?? `${id}.txt`}"`,
    },
  });
}
