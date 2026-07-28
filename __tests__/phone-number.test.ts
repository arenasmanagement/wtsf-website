/**
 * Verifies that no phone number matching 731-608-6009 (in any common format)
 * appears in any TypeScript/TSX source file in the project.
 *
 * This is a regression guard — the number was intentionally removed from the
 * codebase as part of the security audit. If it reappears, this test fails.
 */
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

const PROJECT_ROOT = join(__dirname, "..");

const EXCLUDED_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "public",
  "__tests__", // exclude self to avoid this file triggering the pattern
]);

const PHONE_PATTERNS = [
  /731[-.\s]?608[-.\s]?6009/,
  /7316086009/,
  /\+17316086009/,
];

function collectSourceFiles(dir: string, files: string[] = []): string[] {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    if (EXCLUDED_DIRS.has(entry)) continue;
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      collectSourceFiles(fullPath, files);
    } else if ([".ts", ".tsx", ".js", ".jsx"].includes(extname(entry))) {
      files.push(fullPath);
    }
  }
  return files;
}

describe("Phone number regression guard", () => {
  const sourceFiles = collectSourceFiles(PROJECT_ROOT);

  it("should find at least some source files to check", () => {
    expect(sourceFiles.length).toBeGreaterThan(0);
  });

  it("no .ts/.tsx source file contains the 731-608-6009 phone number", () => {
    const violations: string[] = [];

    for (const filePath of sourceFiles) {
      const content = readFileSync(filePath, "utf-8");
      for (const pattern of PHONE_PATTERNS) {
        if (pattern.test(content)) {
          const relative = filePath.replace(PROJECT_ROOT, "").replace(/^\//, "");
          violations.push(`${relative} (matches ${pattern})`);
          break; // one report per file is enough
        }
      }
    }

    if (violations.length > 0) {
      throw new Error(
        `Phone number found in ${violations.length} file(s):\n` +
          violations.map((v) => `  - ${v}`).join("\n")
      );
    }

    expect(violations).toHaveLength(0);
  });
});
