import { Plugin } from 'esbuild';
import axios from 'axios';

async function fetchPkg(url: string) {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.log(error);
    throw new Error(`GET ${url} failed with status`);
  }
}

export const httpPlugin: Plugin = {
  name: 'http',
  setup(build) {
    build.onResolve({ filter: /^https?:\/\// }, args => ({
      path: args.path,
      namespace: 'http-url',
    }));

    build.onResolve({ filter: /.*/, namespace: 'http-url' }, args => ({
      path: new URL(args.path, args.importer).toString(),
      namespace: 'http-url',
    }));

    build.onLoad({ filter: /.*/, namespace: 'http-url' }, async args => {
      const contents = await fetchPkg(args.path);
      return { contents };
    });
  },
};
