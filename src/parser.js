const RUN_URL_PATTERN = /^https:\/\/github\.com\/([^/]+\/[^/]+)\/actions\/runs\/(\d+)/;

const FAILURE_PATTERNS = [
  /##\[error\](?<message>.+)$/i,
  /\b(?<message>ERR_[A-Z0-9_]+.+)$/i,
  /^(?<message>gzip:.+)$/i,
  /^(?<message>tar:.+)$/i,
  /\bError:\s+(?<message>.+)$/i,
  /^\s*FAIL(?:ED)?\b[:\s-]*(?<message>.*)$/i,
  /\bAssertionError\b[:\s-]*(?<message>.*)$/i,
  /\bProcess completed with exit code (?<message>\d+)/i,
];

const COMMAND_PATTERNS = [
  /^##\[group\]Run\s+(?<command>.+)$/i,
  /^\[command\](?<command>.+)$/i,
  /^\s*Run\s+(?<command>.+)$/i,
  /^\s*\$\s+(?<command>.+)$/,
  /^\s*(?<command>(?:npm|pnpm|yarn|bun|pytest|python|uv|tox|nox|cargo|cross|rustup|curl|wget|tar|go|make|swift|gradle|mvn|ruby|bundle|\.\/[\w./-]+)\b.*)$/i,
];

const TIMESTAMP_PATTERN = /^\uFEFF?(?<timestamp>\d{4}-\d{2}-\d{2}T[^\s]+)\s?(?<message>.*)$/;

export function parseRunTarget(args) {
  const first = args.positional[0];

  if (first) {
    const match = first.match(RUN_URL_PATTERN);
    if (match) {
      return { repo: match[1], runId: match[2], url: first };
    }

    if (/^[^/\s]+\/[^/\s]+$/.test(first)) {
      return { repo: first, runId: args.run, jobId: args.job };
    }
  }

  return { repo: args.repo, runId: args.run, jobId: args.job };
}

export function parseFailureLog(logText, target = {}) {
  const lines = logText.split(/\r?\n/).filter((line, index, allLines) => {
    return line.length > 0 || index < allLines.length - 1;
  });
  const entries = inferStepNames(lines.map(parseLogLine));
  const failures = [];
  const commands = [];

  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    const command = extractCommand(entry.message);

    if (command) {
      commands.push({ ...entry, lineNumber: index + 1, command });
    }

    const failure = extractFailure(entry.message);
    if (failure) {
      failures.push({
        ...entry,
        lineNumber: index + 1,
        message: failure,
        context: buildContext(entries, index),
        nearestCommand: findNearestCommand(commands, index + 1),
      });
    }
  }

  const primaryFailure = failures[0] ?? inferFallbackFailure(entries);
  const failureClass = classifyFailure({
    entries,
    failures,
    commands,
    primaryFailure,
  });

  return {
    target,
    totalLines: lines.length,
    primaryFailure,
    failureClass,
    failures: failures.slice(0, 10),
    commands: dedupeCommands(commands).slice(-8),
    environment: inferEnvironment(entries),
    jobs: summarizeJobs(entries),
  };
}

function parseLogLine(line) {
  const parts = line.split("\t");
  if (parts.length >= 4 && /^\d{4}-\d{2}-\d{2}T/.test(parts[2])) {
    return {
      job: parts[0],
      step: parts[1],
      timestamp: parts[2],
      message: cleanLogMessage(parts.slice(3).join("\t")),
      raw: line,
    };
  }

  if (parts.length >= 3) {
    const match = parts.slice(2).join("\t").match(TIMESTAMP_PATTERN);
    if (match) {
      return {
        job: parts[0],
        step: parts[1],
        timestamp: match.groups.timestamp,
        message: cleanLogMessage(match.groups.message),
        raw: line,
      };
    }
  }

  return {
    job: "unknown",
    step: "unknown",
    timestamp: null,
    message: cleanLogMessage(line),
    raw: line,
  };
}

function inferStepNames(entries) {
  const currentStepByJob = new Map();

  return entries.map((entry) => {
    const groupCommand = entry.message.match(/^##\[group\]Run\s+(?<step>.+)$/i);
    const groupName = entry.message.match(/^##\[group\](?<step>(?!Run\b).+)$/i);

    if (groupCommand?.groups?.step) {
      currentStepByJob.set(entry.job, groupCommand.groups.step.trim());
    } else if (groupName?.groups?.step && entry.step === "UNKNOWN STEP") {
      currentStepByJob.set(entry.job, groupName.groups.step.trim());
    }

    if (entry.step === "UNKNOWN STEP") {
      return {
        ...entry,
        step: currentStepByJob.get(entry.job) ?? entry.step,
      };
    }

    return entry;
  });
}

function extractFailure(message) {
  for (const pattern of FAILURE_PATTERNS) {
    const match = message.match(pattern);
    if (match) {
      return (match.groups?.message || match[0]).trim();
    }
  }
  return null;
}

function extractCommand(message) {
  for (const pattern of COMMAND_PATTERNS) {
    const match = message.match(pattern);
    const command = match?.groups?.command?.trim();
    if (command && isUsefulCommand(command)) {
      return command;
    }
  }
  return null;
}

function isUsefulCommand(command) {
  if (!command || command.startsWith("echo ") || command.startsWith("#")) {
    return false;
  }

  if (/^(?:with|to)\s+/i.test(command)) {
    return false;
  }

  if (/^(?:if|then|else|elif|fi|for|do|done|while|case|esac)\b/.test(command)) {
    return false;
  }

  if (/^[A-Z_][A-Z0-9_]*:\s/.test(command) || /^[a-z][a-z0-9_-]*:\s/.test(command)) {
    return false;
  }

  if (/^(?:gzip|tar):\s/i.test(command)) {
    return false;
  }

  if (/^[\w.-]+\/[\w./-]+@[\w.-]+$/.test(command)) {
    return false;
  }

  if (/^(?:\/usr\/bin\/)?git\b/.test(command)) {
    return false;
  }

  return true;
}

function cleanLogMessage(message) {
  return message
    .replace(/\u001B\[[0-?]*[ -/]*[@-~]/g, "")
    .replace(/^\uFEFF/, "")
    .trimEnd();
}

function buildContext(entries, index) {
  const start = Math.max(0, index - 8);
  const end = Math.min(entries.length, index + 6);
  return entries.slice(start, end).map((entry) => entry.raw);
}

function findNearestCommand(commands, lineNumber) {
  for (let index = commands.length - 1; index >= 0; index -= 1) {
    if (commands[index].lineNumber <= lineNumber) {
      return commands[index];
    }
  }
  return null;
}

function inferFallbackFailure(entries) {
  const tail = entries.slice(-20);
  const lastMeaningful = [...tail].reverse().find((entry) => entry.message.trim());

  return {
    job: lastMeaningful?.job ?? "unknown",
    step: lastMeaningful?.step ?? "unknown",
    timestamp: lastMeaningful?.timestamp ?? null,
    lineNumber: entries.length,
    message: lastMeaningful?.message.trim() || "No explicit failure marker found.",
    context: tail.map((entry) => entry.raw),
    nearestCommand: null,
  };
}

function classifyFailure({ entries, failures, commands, primaryFailure }) {
  const relevantText = [
    primaryFailure.job,
    primaryFailure.step,
    primaryFailure.message,
    ...primaryFailure.context,
    ...failures.flatMap((failure) => [failure.message, ...failure.context]),
  ].join("\n");
  const cleanedRelevantText = cleanLogMessage(relevantText);

  if (isNativeExtensionFailure(cleanedRelevantText)) {
    return {
      id: "native-extension",
      label: "Native extension build failure",
      localRepro: true,
      summary:
        "A Python package with Rust/native components failed while building through maturin, cargo, rustc, or PyO3.",
      recommendations: [
        "Re-run the package install/build command with the same Python and Rust toolchain versions.",
        "Check Cargo.lock, pyproject build settings, and dependency versions around the native package.",
        "If the error mentions a Rust diagnostic, run the suggested rustc explanation or cargo tree command.",
      ],
      relatedCommands: findRelatedCommands(commands, primaryFailure, /(?:uv|pip|python|maturin|cargo|rustc)\b/i),
    };
  }

  if (isActionStepFailure(cleanedRelevantText, entries, primaryFailure)) {
    return {
      id: "action-step",
      label: "GitHub Action setup step failure",
      localRepro: false,
      summary:
        "The failure happened inside a GitHub Action setup step, so there may not be a meaningful local shell command to run.",
      recommendations: [
        "Check the action inputs and requested tool version in the workflow file.",
        "Confirm the requested version exists for the runner image and architecture.",
        "Retry with check-latest or a stable version if the requested prerelease is unavailable.",
      ],
      relatedCommands: [],
    };
  }

  if (isGitSafeDirectoryFailure(cleanedRelevantText)) {
    return {
      id: "git-safe-directory",
      label: "Git safe.directory ownership failure",
      localRepro: true,
      summary:
        "Git rejected a mounted checkout because the repository ownership differs from the user inside the runner or container.",
      recommendations: [
        "Re-run the failing container command with the same mounted checkout path.",
        "Confirm whether the container user differs from the checkout owner.",
        "If this is expected in CI, add the mounted checkout path with git config --global --add safe.directory <path> before commands that inspect Git state.",
      ],
      relatedCommands: findRelatedCommands(commands, primaryFailure, /(?:docker|podman|git)\b/i),
    };
  }

  if (isArchiveDownloadFailure(cleanedRelevantText, primaryFailure)) {
    return {
      id: "download-archive",
      label: "Download/archive extraction failure",
      localRepro: true,
      summary:
        "An archive extraction command failed after a download, which often means the downloaded file was HTML, empty, redirected, or rate-limited.",
      recommendations: [
        "Check the download URL, redirects, authentication, and rate limits.",
        "Inspect the downloaded file with file/head before extracting it.",
        "Re-run the download and extraction commands together instead of only retrying tar or gzip.",
      ],
      relatedCommands: findRelatedCommands(commands, primaryFailure, /(?:curl|wget|tar|gzip)\b/i),
    };
  }

  return {
    id: "generic",
    label: "Generic command failure",
    localRepro: true,
    summary: "No specialized failure class matched this log.",
    recommendations: [],
    relatedCommands: [],
  };
}

function isNativeExtensionFailure(text) {
  return /\b(?:maturin|pyo3|cargo|rustc)\b/i.test(text) && /\b(?:native library|build-wheel|could not compile|returned non-zero exit status|exit status:\s*101)\b/i.test(text);
}

function isActionStepFailure(text, entries, primaryFailure) {
  const actionStepPattern = /\b(?:actions\/setup-[\w-]+|setup-[\w-]+)\b/i;
  if (actionStepPattern.test(text)) {
    return true;
  }

  return entries.some((entry) => {
    return (
      entry.job === primaryFailure.job &&
      actionStepPattern.test(entry.step) &&
      Math.abs(entries.indexOf(entry) + 1 - primaryFailure.lineNumber) <= 40
    );
  });
}

function isGitSafeDirectoryFailure(text) {
  return /\bfatal:\s+detected dubious ownership in repository\b/i.test(text);
}

function isArchiveDownloadFailure(text, primaryFailure) {
  return (
    /\b(?:gzip:\s+stdin:\s+not in gzip format|tar:\s+(?:Child returned status|Error is not recoverable|This does not look like a tar archive))\b/i.test(
      text,
    ) ||
    /\b(?:gzip|tar)\b/i.test(primaryFailure.message)
  );
}

function findRelatedCommands(commands, primaryFailure, pattern) {
  return commands
    .filter((command) => {
      return (
        command.job === primaryFailure.job &&
        command.lineNumber <= primaryFailure.lineNumber &&
        pattern.test(command.command)
      );
    })
    .slice(-4)
    .map((command) => command.command);
}

function dedupeCommands(commands) {
  const seen = new Set();
  return commands.filter((command) => {
    const key = `${command.job}:${command.step}:${command.command}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function summarizeJobs(entries) {
  const jobs = new Map();

  for (const entry of entries) {
    const current = jobs.get(entry.job) ?? { job: entry.job, steps: new Set(), lines: 0 };
    current.steps.add(entry.step);
    current.lines += 1;
    jobs.set(entry.job, current);
  }

  return [...jobs.values()].map((job) => ({
    job: job.job,
    steps: [...job.steps].filter(Boolean),
    lines: job.lines,
  }));
}

function inferEnvironment(entries) {
  const environment = {
    runner: new Set(),
    matrix: new Map(),
    languages: new Map(),
    setupSteps: [],
  };

  for (const entry of entries) {
    collectRunnerHints(environment, entry);
    collectMatrixHints(environment, entry);
    collectLanguageHints(environment, entry);
    collectSetupSteps(environment, entry);
  }

  return {
    runner: [...environment.runner],
    matrix: Object.fromEntries(environment.matrix),
    languages: Object.fromEntries(environment.languages),
    setupSteps: environment.setupSteps.slice(0, 8),
  };
}

function collectRunnerHints(environment, entry) {
  const haystack = `${entry.job} ${entry.step} ${entry.message}`;
  const runnerMatch = haystack.match(/\b(?<runner>ubuntu|windows|macos)(?:-[\w.]+)?(?:-latest)?\b/i);
  if (runnerMatch) {
    environment.runner.add(runnerMatch.groups.runner.toLowerCase());
  }

  const imageMatch = entry.message.match(/\bImage:\s*(?<image>[\w.-]+)/i);
  if (imageMatch) {
    environment.runner.add(imageMatch.groups.image);
  }
}

function collectMatrixHints(environment, entry) {
  const matrixFromJob = entry.job.match(/\((?<values>[^)]+)\)/);
  if (matrixFromJob) {
    const values = matrixFromJob.groups.values.split(",").map((value) => value.trim());
    values.forEach((value, index) => {
      if (value) environment.matrix.set(`job_value_${index + 1}`, value);
    });
  }

  const explicitMatrix = entry.message.match(/\bmatrix[.: ]+(?<key>[\w-]+)[=: ]+(?<value>[\w./-]+)/i);
  if (explicitMatrix) {
    environment.matrix.set(explicitMatrix.groups.key, explicitMatrix.groups.value);
  }
}

function collectLanguageHints(environment, entry) {
  const patterns = [
    ["node", /\bnode(?:\.js)?(?: version)?\s*(?:=|:)?\s*v?(?<version>\d+\.\d+(?:\.\d+)?)/i],
    ["node", /\bFound in cache.*\/node\/(?<version>\d+\.\d+(?:\.\d+)?)/i],
    ["python", /\bpython\s*(?<version>\d+\.\d+(?:\.\d+)?)/i],
    ["python", /\bpython-version:\s*(?<version>\d+\.\d+(?:\.\d+)?)/i],
    ["go", /\bgo version go(?<version>\d+\.\d+(?:\.\d+)?)/i],
    ["rust", /\brustc\s+(?<version>\d+\.\d+(?:\.\d+)?)/i],
    ["ruby", /\bruby\s+(?<version>\d+\.\d+(?:\.\d+)?)/i],
    ["java", /\b(?:java|temurin|jdk)\s+(?<version>\d+(?:\.\d+)?)/i],
  ];

  for (const [language, pattern] of patterns) {
    const match = entry.message.match(pattern);
    if (match?.groups?.version) {
      environment.languages.set(language, match.groups.version);
    }
  }
}

function collectSetupSteps(environment, entry) {
  if (/\bsetup\b|actions\/setup-|install|restore cache/i.test(entry.step)) {
    const key = `${entry.job}:${entry.step}`;
    if (!environment.setupSteps.some((step) => step.key === key)) {
      environment.setupSteps.push({
        key,
        job: entry.job,
        step: entry.step,
      });
    }
  }
}
