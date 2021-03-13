import cors, { CorsOptions } from 'cors';
import { build, BuildOptions, BuildResult, BuildFailure } from 'esbuild';
import express from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import { httpPlugin } from './plugins/httpPlugin';
import { memfsLoader } from './plugins/memfsLoader';
import formatError from './utils/formatError';
import formatResult from './utils/formatResult';

const corsOptions: CorsOptions = {
  origin: (origin, cb) => {
    cb(null, true);
  },
};

const app = express();

app.use(cors(corsOptions));

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
