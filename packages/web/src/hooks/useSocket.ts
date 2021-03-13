import { useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';

export function useSocket() {
  const [isConnected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io('https://5000.code.mokshitjain.co');

    socketRef.current = socket;
    setConnected(true);
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
  };
}
