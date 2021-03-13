import { Socket } from 'socket.io-client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { compile } from '../features/editor/editorSlice';

export function useCompileFiles(socket: Socket | null) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;

    socket.on(
      'result',
      (data: { files: { path: string; text: string }[]; errors: string[] }) => {
        if (data.files) {
          dispatch(
            compile(
              data.files.map((f, index) => {
                if (index === 0) {
                  return {
                    path: f.path,
                    contents: f.text,
                  };
                }

                return {
                  path: f.path,
                  contents: f.text,
                };
              })
            )
          );
        }
      }
    );

    return () => {
      socket!.off('result');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, socket]);
}
