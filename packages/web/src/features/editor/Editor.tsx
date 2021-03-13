import MonacoEditor, { BeforeMount } from '@monaco-editor/react';
import path from 'path-browserify';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../app/hooks';
import { changeFile, updateFile, changeCompiledFile } from './editorSlice';
import { useCompileFiles } from '../../hooks/useCompileFiles';
import { useSocket } from '../../hooks/useSocket';
import getLang from '../../utils/getLang';
import AddFile from './AddFile';
import Tabs from './Tabs';

export default function Editor() {
  const {
    files,
    currentId,
    currentCompiledId,
    compiledFiles,
    config,
  } = useAppSelector(state => state.editor);
  const dispatch = useDispatch();
  const { socket } = useSocket();

  const currentFile = files.find(f => f.path === currentId)!;
  const currentCompiledFile = compiledFiles.find(
    f => f.path === currentCompiledId
  )!;
  const currentCompiledLang = getLang(
    path.parse(currentCompiledFile?.path || 'index.js').ext
  );
  const currentLang = getLang(path.parse(currentFile?.path || 'index.ts').ext);

  useCompileFiles(socket);

  useEffect(() => {
    if (!socket) return;

    const timeout = setTimeout(() => {
      socket.emit('compile', {
        files,
        config,
      });
    }, 600);

    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, files]);

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <div>
          <div style={{ display: 'flex' }}>
            <Tabs files={files} path={currentId} action={changeFile} />
            <AddFile />
          </div>
          <MonacoEditor
            language={currentLang}
            value={currentFile?.contents}
            onChange={(value = '') =>
              dispatch(updateFile({ path: currentFile.path, contents: value }))
            }
            width="50vw"
            height="50vh"
            theme="vs-dark"
            path={currentFile?.path}
            beforeMount={handleBeforeMount}
          />
        </div>
        <div>
          <Tabs
            files={compiledFiles}
            path={currentCompiledId}
            action={changeCompiledFile}
          />
          <MonacoEditor
            language={currentCompiledLang}
            value={currentCompiledFile.contents}
            width="50vw"
            height="50vh"
            theme="vs-dark"
            path={`${currentCompiledFile.path}-compiled`}
            beforeMount={handleBeforeMount}
          />
        </div>
      </div>
    </div>
  );
}

const handleBeforeMount: BeforeMount = monaco => {
  monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);

  const textDeclaration = `
    declare module '*.txt' {
      const text: string;
      export default text;
    }
  `;

  const textFilename = 'ts:filename/text.d.ts';

  monaco.languages.typescript.javascriptDefaults.addExtraLib(
    textDeclaration,
    textFilename
  );

  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    jsx: monaco.languages.typescript.JsxEmit.React,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    allowJs: true,
  });
};
