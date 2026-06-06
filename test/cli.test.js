import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { runCli } from "../src/cli.js";

const fixturePath = new URL("./fixtures/sample-gh-log.txt", import.meta.url);

describe("runCli", () => {
  it("prints machine-readable JSON without writing files", async () => {
    let output = "";
    await runCli(
      ["node", "gha-repro-kit", "--log-file", fixturePath.pathname, "--json", "--no-files"],
      {
        stdout: {
          write(chunk) {
            output += chunk;
          },
        },
      },
    );

    const result = JSON.parse(output);
    assert.equal(result.schemaVersion, 1);
    assert.equal(result.artifacts, null);
    assert.equal(result.analysis.primaryFailure.job, "test");
    assert.equal(result.analysis.primaryFailure.nearestCommand.command, "pnpm test packages/parser");
  });

  it("writes artifacts and can return their paths as JSON", async () => {
    const outDir = await mkdtemp(path.join(os.tmpdir(), "gha-repro-kit-"));
    let output = "";

    try {
      await runCli(
        ["node", "gha-repro-kit", "--log-file", fixturePath.pathname, "--out", outDir, "--format", "json"],
        {
          stdout: {
            write(chunk) {
              output += chunk;
            },
          },
        },
      );

      const result = JSON.parse(output);
      assert.equal(result.artifacts.report, path.join(outDir, "report.md"));
      assert.equal(result.artifacts.repro, path.join(outDir, "repro.sh"));
      assert.equal(result.artifacts.summary, path.join(outDir, "summary.md"));
      assert.equal(result.artifacts.analysis, path.join(outDir, "analysis.json"));

      const report = await readFile(result.artifacts.report, "utf8");
      assert.match(report, /Primary job: test/);
    } finally {
      await rm(outDir, { recursive: true, force: true });
    }
  });
});
