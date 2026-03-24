import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import process from "node:process";

export type TempProjectFiles = Record<string, string>;

export async function createTempProject(files: TempProjectFiles): Promise<string> {
  const projectRoot = await mkdtemp(path.join(tmpdir(), "sdd-navigator-tests-"));

  await Promise.all(
    Object.entries(files).map(async ([relativePath, contents]) => {
      const absolutePath = path.join(projectRoot, relativePath);

      await mkdir(path.dirname(absolutePath), { recursive: true });
      await writeFile(absolutePath, contents, "utf8");
    }),
  );

  return projectRoot;
}

export async function removeTempProject(projectRoot: string): Promise<void> {
  await rm(projectRoot, { recursive: true, force: true });
}

export async function withWorkingDirectory<T>(
  projectRoot: string,
  callback: () => Promise<T>,
): Promise<T> {
  const originalDirectory = process.cwd();

  process.chdir(projectRoot);

  try {
    return await callback();
  } finally {
    process.chdir(originalDirectory);
  }
}
