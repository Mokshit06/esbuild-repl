import { BuildFailure } from 'esbuild';
import path from 'path';

export default function formatError(errors: BuildFailure['errors']) {
  return errors.map(e => {
    let lineText = '';
    const { column, line, lineText: text, file } = e.location!;
    const { base } = path.parse(file);

    lineText = text;

    if (e.notes.length > 0) {
      lineText = e.notes[e.notes.length - 1].location?.lineText || '';
    }

    return {
      message: `${base}: ${e.text} (${line}:${column})`,
      error: lineText,
    };
  });
}
