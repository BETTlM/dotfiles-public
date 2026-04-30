import { readManifest } from "@/lib/manifest";

export async function GET() {
  const manifest = await readManifest();
  return Response.json(manifest);
}
