import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import { parseFailureLog, parseRunTarget } from "../src/parser.js";

const sampleLog = [
  "test\tRun tests\t2026-06-06T00:00:01Z\tRun pnpm test packages/parser",
  "test\tRun tests\t2026-06-06T00:00:02Z\tpnpm test packages/parser",
  "test\tRun tests\t2026-06-06T00:00:03Z\tFAIL packages/parser/tokenize.test.ts",
  "test\tRun tests\t2026-06-06T00:00:04Z\tError: expected token EOF",
  "test\tRun tests\t2026-06-06T00:00:05Z\tProcess completed with exit code 1",
].join("\n");

describe("parseRunTarget", () => {
  it("parses GitHub Actions run URLs", () => {
    const target = parseRunTarget({
      positional: ["https://github.com/acme/widgets/actions/runs/123456789"],
    });

    assert.equal(target.repo, "acme/widgets");
    assert.equal(target.runId, "123456789");
  });

  it("parses owner/repo plus run ID", () => {
    const target = parseRunTarget({ positional: ["acme/widgets"], run: "42", job: "99" });

    assert.equal(target.repo, "acme/widgets");
    assert.equal(target.runId, "42");
    assert.equal(target.jobId, "99");
  });

  it("parses repo and job ID options", () => {
    const target = parseRunTarget({ positional: [], repo: "acme/widgets", job: "99" });

    assert.equal(target.repo, "acme/widgets");
    assert.equal(target.jobId, "99");
  });
});

describe("parseFailureLog", () => {
  it("extracts the primary failure and nearest command", () => {
    const analysis = parseFailureLog(sampleLog, { repo: "acme/widgets", runId: "42" });

    assert.equal(analysis.primaryFailure.job, "test");
    assert.equal(analysis.primaryFailure.step, "Run tests");
    assert.equal(analysis.primaryFailure.message, "packages/parser/tokenize.test.ts");
    assert.equal(analysis.primaryFailure.nearestCommand.command, "pnpm test packages/parser");
    assert.equal(analysis.failures.length, 3);
  });

  it("extracts environment hints from matrix-style logs", async () => {
    const log = await readFile(new URL("./fixtures/node-matrix-gh-log.txt", import.meta.url), "utf8");
    const analysis = parseFailureLog(log);

    assert.deepEqual(analysis.environment.runner, ["ubuntu"]);
    assert.equal(analysis.environment.matrix.job_value_1, "20");
    assert.equal(analysis.environment.matrix.job_value_2, "ubuntu-latest");
    assert.equal(analysis.environment.languages.node, "20.19.0");
    assert.equal(analysis.environment.setupSteps[0].step, "Setup Node");
    assert.equal(analysis.primaryFailure.nearestCommand.command, "pnpm test packages/parser");
  });

  it("classifies setup action failures without a local repro command", () => {
    const log = [
      "lint\tUNKNOWN STEP\t2026-06-06T00:00:01Z\t##[group]Run actions/setup-python@v5",
      "lint\tUNKNOWN STEP\t2026-06-06T00:00:02Z\tpython-version: 3.15",
      "lint\tUNKNOWN STEP\t2026-06-06T00:00:03Z\tVersion 3.15 was not found in the local cache",
      "lint\tUNKNOWN STEP\t2026-06-06T00:00:04Z\t##[error]The version '3.15' with architecture 'x64' was not found for Ubuntu 24.04.",
    ].join("\n");
    const analysis = parseFailureLog(log);

    assert.equal(analysis.failureClass.id, "action-step");
    assert.equal(analysis.failureClass.localRepro, false);
  });

  it("classifies download archive failures and keeps the download command", () => {
    const log = [
      "test\tUNKNOWN STEP\t2026-06-06T00:00:01Z\tcurl -LO https://example.test/tool.tar.gz",
      "test\tUNKNOWN STEP\t2026-06-06T00:00:02Z\ttar xf tool.tar.gz",
      "test\tUNKNOWN STEP\t2026-06-06T00:00:03Z\tgzip: stdin: not in gzip format",
      "test\tUNKNOWN STEP\t2026-06-06T00:00:04Z\ttar: Child returned status 1",
    ].join("\n");
    const analysis = parseFailureLog(log);

    assert.equal(analysis.failureClass.id, "download-archive");
    assert.deepEqual(analysis.failureClass.relatedCommands, [
      "curl -LO https://example.test/tool.tar.gz",
      "tar xf tool.tar.gz",
    ]);
    assert.equal(analysis.commands.some((command) => command.command.startsWith("tar:")), false);
  });

  it("classifies native extension build failures", () => {
    const log = [
      "lint\tBuild\t2026-06-06T00:00:01Z\tuv sync --all-packages",
      "lint\tBuild\t2026-06-06T00:00:02Z\terror: could not compile `pydantic-core` (lib) due to 10 previous errors",
      "lint\tBuild\t2026-06-06T00:00:03Z\tmaturin failed",
      "lint\tBuild\t2026-06-06T00:00:04Z\tCaused by: Failed to build a native library through cargo",
      "lint\tBuild\t2026-06-06T00:00:05Z\tFor more information about this error, try `rustc --explain E0599`.",
    ].join("\n");
    const analysis = parseFailureLog(log);

    assert.equal(analysis.failureClass.id, "native-extension");
    assert.equal(analysis.failureClass.localRepro, true);
  });
});
