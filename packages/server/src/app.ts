import cors, { CorsOptions } from 'cors';
import { build, BuildOptions } from 'esbuild';
import express from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import { httpPlugin } from './plugins/httpPlugin';
import { memfsLoader } from './plugins/memfsLoader';

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

        socket.emit('result', {
          files: result.outputFiles.map(f => ({
            ...f,
            path: path.parse(f.path).base,
          })),
          errors: result.warnings,
        });
      } catch (error) {
        console.log('ERROR');
        console.log(error);
      }
    }
  );
});

export default server;
