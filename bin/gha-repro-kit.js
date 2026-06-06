#!/usr/bin/env node
import { runCli } from "../src/cli.js";

runCli(process.argv).catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
