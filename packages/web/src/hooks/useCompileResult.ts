import { Socket } from 'socket.io-client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { compile, failure } from '../features/editor/editorSlice';

export function useCompileResult(socket: Socket | null) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;

    socket.on('result', (files: { path: string; text: string }[]) => {
      if (files) {
        dispatch(
          compile(
            files.map(f => ({
              path: f.path,
              contents: f.text,
            }))
          )
        );
      }
    });

    socket.on('error', (errors: { error: string; message: string }[]) => {
      if (errors) {
        dispatch(failure(errors));
      }
    });

    return () => {
      socket.off('result');
      socket.off('errors');
    };
  }, [dispatch, socket]);
}
