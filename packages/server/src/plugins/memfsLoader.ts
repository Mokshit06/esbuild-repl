import { OnLoadResult, Plugin, Loader } from 'esbuild';
import { File } from '../app';
import path from 'path';

const MemfsNS = 'memfs';

interface MemfsLoader {
  files: Array<File>;
}

const loaderMap: Record<string, Loader> = {
  js: 'js',
  jsx: 'jsx',
  ts: 'ts',
  tsx: 'tsx',
  css: 'css',
  json: 'json',
  txt: 'text',
  base64: 'base64',
  file: 'file',
  dataurl: 'dataurl',
  binary: 'binary',
  default: 'default',
};

export function memfsLoader({ files }: MemfsLoader): Plugin {
  return {
    name: 'memfs-loader',
    setup(build) {
      build.onResolve({ filter: /\.(ts|js|jsx|css|txt|tsx|json)$/ }, args => {
        return {
          namespace: MemfsNS,
          path: args.path,
          pluginData: args.pluginData,
        };
      });

      build.onLoad({ filter: /.*/, namespace: MemfsNS }, args => {
        const { base: filePath, ext } = path.parse(args.path);

        const extension = ext.replace(/^\./, '');

        const file = files.find(f => f.path === filePath);

        if (!file) throw new Error(`File ${filePath} not found`);

        const contents: string = file.contents || '';

        const returnObj: OnLoadResult = {
          contents,
          loader: extension in loaderMap ? (extension as Loader) : 'text',
        };

        return returnObj;
      });
    },
  };
}
