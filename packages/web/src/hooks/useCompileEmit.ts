import { Socket } from 'socket.io-client';
import { useEffect } from 'react';
import { useAppSelector } from '../app/hooks';

export function useCompileEmit(socket: Socket | null) {
  const config = useAppSelector(state => state.editor.config);
  const files = useAppSelector(state => state.editor.files);

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
  }, [config, files, socket]);
}
