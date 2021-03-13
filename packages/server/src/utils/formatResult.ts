import { BuildResult, OutputFile } from 'esbuild';
import path from 'path';

export default function formatResult(
  result: BuildResult & { outputFiles: OutputFile[] }
) {
  return result.outputFiles.map(f => ({
    ...f,
    path: path.parse(f.path).base,
  }));
}
