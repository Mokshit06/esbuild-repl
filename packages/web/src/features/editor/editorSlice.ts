import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { File } from '../../interfaces';
import type { BuildOptions } from 'esbuild';

const editorSlice = createSlice({
  name: 'editor',
  initialState: {
    files: [
      {
        contents: '// Type here',
        path: 'index.ts',
      },
    ] as File[],
    compiledFiles: [
      {
        contents: '// Compiled',
        path: 'index.js',
      },
    ] as File[],
    currentId: 'index.ts',
    currentCompiledId: 'index.js',
    inputOpen: false,
    config: {
      platform: 'neutral',
    } as Partial<BuildOptions>,
  },
  reducers: {
    showInput: state => {
      state.inputOpen = true;
    },
    addFile: (state, { payload: path }: PayloadAction<string>) => {
      state.inputOpen = false;
      state.files.push({ path, contents: '' });
    },
    compile: (state, { payload: files }: PayloadAction<File[]>) => {
      state.compiledFiles = files;
    },
    changeFile: (state, { payload: id }: PayloadAction<string>) => {
      state.currentId = id;
    },
    changeCompiledFile: (state, { payload: id }: PayloadAction<string>) => {
      state.currentCompiledId = id;
    },
    updateFile: (
      state,
      {
        payload: { path, contents },
      }: PayloadAction<{ path: string; contents: string }>
    ) => {
      const file = state.files.find(f => f.path === path);
      if (!file) return;

      file.contents = contents;
    },
    updateConfig: (
      state,
      action: PayloadAction<{ key: keyof BuildOptions; value: any }>
    ) => {
      const { key, value } = action.payload;

      state.config[key] = value;
    },
  },
});

export const {
  addFile,
  changeFile,
  compile,
  showInput,
  updateFile,
  changeCompiledFile,
  updateConfig,
} = editorSlice.actions;

export default editorSlice.reducer;
