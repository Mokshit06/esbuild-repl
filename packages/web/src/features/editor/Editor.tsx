import MonacoEditor, { BeforeMount } from '@monaco-editor/react';
import path from 'path-browserify';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../app/hooks';
import { useCompileEmit } from '../../hooks/useCompileEmit';
import { useCompileResult } from '../../hooks/useCompileResult';
import { useSocket } from '../../hooks/useSocket';
import getLang from '../../utils/getLang';
import AddFile from './AddFile';
import { changeCompiledFile, changeFile, updateFile } from './editorSlice';
import Tabs from './Tabs';
import Error from './Error';

export default function Editor() {
  const {
    files,
    currentId,
    currentCompiledId,
    compiledFiles,
    errors,
  } = useAppSelector(state => state.editor);
  const dispatch = useDispatch();
  const { socket } = useSocket();

  const hasError = errors.length > 0;
  const currentFile = files.find(f => f.path === currentId)!;
  const currentCompiledFile = compiledFiles.find(
    f => f.path === currentCompiledId
  )!;
  const currentCompiledLang = getLang(
    path.parse(currentCompiledFile?.path || 'index.js').ext
  );
  const currentLang = getLang(path.parse(currentFile?.path || 'index.ts').ext);

  useCompileEmit(socket);
  useCompileResult(socket);

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
      <div>{hasError && errors.map(e => <Error {...e} />)}</div>
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
