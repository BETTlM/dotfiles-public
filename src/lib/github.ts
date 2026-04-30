import { Buffer } from "node:buffer";

import { Octokit } from "@octokit/rest";

function getRepoConfig() {
  const token = process.env.GITHUB_REPO_TOKEN;
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;
  const branch = process.env.GITHUB_REPO_BRANCH ?? "main";

  if (!token || !owner || !repo) {
    throw new Error(
      "Missing GitHub repo configuration. Set GITHUB_REPO_TOKEN, GITHUB_REPO_OWNER, and GITHUB_REPO_NAME.",
    );
  }

  return { token, owner, repo, branch };
}

function createClient() {
  const { token } = getRepoConfig();
  return new Octokit({ auth: token });
}

export async function upsertRepoFile(filePath: string, content: string, message: string) {
  const cfg = getRepoConfig();
  const octokit = createClient();
  let sha: string | undefined;

  try {
    const current = await octokit.repos.getContent({
      owner: cfg.owner,
      repo: cfg.repo,
      path: filePath,
      ref: cfg.branch,
    });

    if (!Array.isArray(current.data) && "sha" in current.data) {
      sha = current.data.sha;
    }
  } catch {
    sha = undefined;
  }

  const encoded = Buffer.from(content).toString("base64");
  await octokit.repos.createOrUpdateFileContents({
    owner: cfg.owner,
    repo: cfg.repo,
    path: filePath,
    branch: cfg.branch,
    message,
    content: encoded,
    sha,
  });
}

export async function deleteRepoFile(filePath: string, message: string) {
  const cfg = getRepoConfig();
  const octokit = createClient();

  const current = await octokit.repos.getContent({
    owner: cfg.owner,
    repo: cfg.repo,
    path: filePath,
    ref: cfg.branch,
  });

  if (Array.isArray(current.data) || !("sha" in current.data)) {
    throw new Error(`Cannot delete non-file path: ${filePath}`);
  }

  await octokit.repos.deleteFile({
    owner: cfg.owner,
    repo: cfg.repo,
    path: filePath,
    branch: cfg.branch,
    message,
    sha: current.data.sha,
  });
}
