import { PayloadActionCreator } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { File } from '../../interfaces';

interface TabProps {
  files: File[];
  path: string;
  action: PayloadActionCreator<string>;
}

export default function Tabs({ files, action, path }: TabProps) {
  const dispatch = useDispatch();

  return (
    <div>
      {files.map(file => (
        <button
          style={{ background: file.path === path ? 'grey' : 'white' }}
          key={file.path}
          onClick={() => dispatch(action(file.path))}
        >
          {file.path}
        </button>
      ))}
    </div>
  );
}
