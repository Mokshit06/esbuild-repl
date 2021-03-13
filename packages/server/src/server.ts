import { build, BuildOptions } from 'esbuild';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import app, { corsOptions } from './app';
import { httpPlugin } from './plugins/httpPlugin';
import { memfsLoader } from './plugins/memfsLoader';
import formatError from './utils/formatError';
import formatResult from './utils/formatResult';

const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});

export interface File {
  id: string;
  path: string;
  contents: string;
}

io.on('connection', socket => {
  socket.on(
    'compile',
    async ({ files, config }: { files: File[]; config: BuildOptions }) => {
      try {
        const result = await build({
          ...config,
          bundle: true,
          entryPoints: [path.join(__dirname, './esbuild/index.ts')],
          write: false,
          outdir: 'dist',
          format: 'esm',
          splitting: true,
          plugins: [httpPlugin, memfsLoader({ files })],
        });

        socket.emit('result', formatResult(result));
      } catch (error) {
        if (error.errors) {
          socket.emit('error', formatError(error.errors));
        }
      }
    }
  );
});

export default server;
