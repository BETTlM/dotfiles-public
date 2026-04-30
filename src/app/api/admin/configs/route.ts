import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth-options";
import { isAdminSession } from "@/lib/authz";
import { upsertConfig, syncUpsertToGitHub } from "@/lib/admin";
import type { ConfigCategory } from "@/lib/types";

interface UpsertPayload {
  id: string;
  title: string;
  description: string;
  category: ConfigCategory;
  sourcePath: string;
  storedPath: string;
  targetPath: string;
  tags: string[];
  content: string;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!isAdminSession(session)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const payload = (await request.json()) as UpsertPayload;
  const result = await upsertConfig(payload);
  const synced = await syncUpsertToGitHub(result.entry, result.content, result.manifest);
  return Response.json({ entry: result.entry, synced });
}
