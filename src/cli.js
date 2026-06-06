import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fetchFailedRunLog } from "./github.js";
import { parseFailureLog, parseRunTarget } from "./parser.js";
import { renderReport, renderReproScript, renderSummary } from "./report.js";

const usage = `gha-repro-kit

Usage:
  gha-repro-kit --log-file ./failed.log [--out ./repro]
  gha-repro-kit --log-file ./failed.log --json --no-files
  gha-repro-kit owner/repo --run 123456789 [--out ./repro]
  gha-repro-kit owner/repo --run 123456789 --job 987654321 [--out ./repro]
  gha-repro-kit --repo owner/repo --job 987654321 [--out ./repro]
  gha-repro-kit https://github.com/owner/repo/actions/runs/123456789 [--out ./repro]

Options:
  --log-file <path>   Read an existing GitHub Actions failed log.
  --repo <owner/repo> GitHub repository when using --run.
  --run <id>          GitHub Actions run ID.
  --job <id>          GitHub Actions job ID for large workflows.
  --out <dir>         Output directory. Defaults to ./gha-repro-output.
  --format <format>   Output format: text or json. Defaults to text.
  --json              Alias for --format json.
  --quiet             Do not print human-readable status lines.
  --no-files          Do not write report artifacts; useful for agents.
  --help              Show this help.
`;

export async function runCli(argv, io = {}) {
  const stdout = io.stdout ?? process.stdout;
  const args = parseArgs(argv.slice(2));

  if (args.help) {
    stdout.write(`${usage.trim()}\n`);
    return;
  }

  const format = args.format ?? "text";
  if (!["text", "json"].includes(format)) {
    throw new Error(`Unsupported format: ${format}`);
  }

  const target = parseRunTarget(args);
  const logText = args.logFile
    ? await readFile(path.resolve(args.logFile), "utf8")
    : await fetchFailedRunLog(target);

  const analysis = parseFailureLog(logText, target);
  const artifacts = args.noFiles ? null : await writeArtifacts(analysis, args.out);

  if (format === "json") {
    stdout.write(`${JSON.stringify(buildJsonOutput(analysis, artifacts), null, 2)}\n`);
    return;
  }

  if (!args.quiet && artifacts) {
    stdout.write(`Wrote ${artifacts.report}\n`);
    stdout.write(`Wrote ${artifacts.repro}\n`);
    stdout.write(`Wrote ${artifacts.summary}\n`);
    stdout.write(`Wrote ${artifacts.analysis}\n`);
  } else if (!args.quiet && args.noFiles) {
    stdout.write("Analysis complete. No files written because --no-files was set.\n");
  }
}

async function writeArtifacts(analysis, out) {
  const outDir = path.resolve(out ?? "gha-repro-output");
  await mkdir(outDir, { recursive: true });

  const report = renderReport(analysis);
  const reproScript = renderReproScript(analysis);
  const summary = renderSummary(analysis);

  const reportPath = path.join(outDir, "report.md");
  const reproPath = path.join(outDir, "repro.sh");
  const summaryPath = path.join(outDir, "summary.md");
  const analysisPath = path.join(outDir, "analysis.json");

  await writeFile(reportPath, report);
  await writeFile(reproPath, reproScript, { mode: 0o755 });
  await writeFile(summaryPath, summary);
  await writeFile(analysisPath, `${JSON.stringify(analysis, null, 2)}\n`);

  return {
    report: reportPath,
    repro: reproPath,
    summary: summaryPath,
    analysis: analysisPath,
  };
}

function buildJsonOutput(analysis, artifacts) {
  return {
    schemaVersion: 1,
    analysis,
    artifacts,
  };
}

function parseArgs(tokens) {
  const args = { positional: [] };

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];

    if (token === "--help" || token === "-h") {
      args.help = true;
    } else if (token === "--log-file") {
      args.logFile = requireValue(tokens, ++index, token);
    } else if (token === "--repo") {
      args.repo = requireValue(tokens, ++index, token);
    } else if (token === "--run") {
      args.run = requireValue(tokens, ++index, token);
    } else if (token === "--job") {
      args.job = requireValue(tokens, ++index, token);
    } else if (token === "--out") {
      args.out = requireValue(tokens, ++index, token);
    } else if (token === "--format") {
      args.format = requireValue(tokens, ++index, token);
    } else if (token === "--json") {
      args.format = "json";
    } else if (token === "--quiet") {
      args.quiet = true;
    } else if (token === "--no-files") {
      args.noFiles = true;
    } else if (token.startsWith("--")) {
      throw new Error(`Unknown option: ${token}`);
    } else {
      args.positional.push(token);
    }
  }

  return args;
}

function requireValue(tokens, index, option) {
  const value = tokens[index];
  if (!value || value.startsWith("--")) {
    throw new Error(`${option} requires a value`);
  }
  return value;
}
