import cors, { CorsOptions } from 'cors';
import express from 'express';
import path from 'path';

export const corsOptions: CorsOptions = {
  origin: (_origin, cb) => {
    cb(null, true);
  },
};

const app = express();

app.use(cors(corsOptions));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

export default app;
