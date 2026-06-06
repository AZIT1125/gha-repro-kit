import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export async function fetchFailedRunLog(target) {
  if (!target.repo || (!target.runId && !target.jobId)) {
    throw new Error("Provide --log-file, a GitHub run URL, owner/repo --run <id>, or --repo owner/repo --job <id>.");
  }

  const args = ["run", "view"];
  if (target.jobId) {
    args.push("--job", target.jobId);
  } else {
    args.push(target.runId);
  }
  args.push("--repo", target.repo, "--log-failed");

  try {
    const { stdout } = await execFileAsync("gh", args, { maxBuffer: 25 * 1024 * 1024 });
    return stdout;
  } catch (error) {
    const stderr = error.stderr ? `\n${error.stderr}` : "";
    throw new Error(
      `Could not fetch failed run log with GitHub CLI. Try "gh auth login" or pass --log-file.\n${stderr}`,
    );
  }
}
