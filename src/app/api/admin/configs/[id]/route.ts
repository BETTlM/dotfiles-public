import { getServerSession } from "next-auth";

import { deleteConfig, syncDeleteToGitHub, upsertConfig, syncUpsertToGitHub } from "@/lib/admin";
import { authOptions } from "@/lib/auth-options";
import { isAdminSession } from "@/lib/authz";
import { readManifest } from "@/lib/manifest";
import type { ConfigCategory } from "@/lib/types";

interface RouteCtx {
  params: Promise<{ id: string }>;
}

interface UpdatePayload {
  title: string;
  description: string;
  category: ConfigCategory;
  sourcePath: string;
  storedPath: string;
  targetPath: string;
  tags: string[];
  content: string;
}

export async function PUT(request: Request, context: RouteCtx) {
  const session = await getServerSession(authOptions);
  if (!isAdminSession(session)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await context.params;
  const payload = (await request.json()) as UpdatePayload;
  const result = await upsertConfig({ id, ...payload });
  const synced = await syncUpsertToGitHub(result.entry, result.content, result.manifest);
  return Response.json({ entry: result.entry, synced });
}

export async function DELETE(_request: Request, context: RouteCtx) {
  const session = await getServerSession(authOptions);
  if (!isAdminSession(session)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await context.params;
  const manifest = await readManifest();
  const existing = manifest.entries.find((entry) => entry.id === id);
  if (!existing) {
    return new Response("Not found", { status: 404 });
  }

  const result = await deleteConfig(id);
  const synced = await syncDeleteToGitHub(existing.storedPath, result.manifest, id);
  return Response.json({ deleted: id, synced });
}
