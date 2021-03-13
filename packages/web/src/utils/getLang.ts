export default function getLang(ext: string) {
  if (ext === '.js') return 'javascript';
  if (ext === '.ts') return 'typescript';
  if (ext === '.tsx') return 'typescriptreact';
  if (ext === '.jsx') return 'javascriptreact';
  if (ext === '.css') return 'css';
  if (ext === '.html') return 'html';
  if (ext === '') return 'plaintext';
  if (ext === '.json') return 'json';
  return 'default';
}
