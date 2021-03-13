import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../app/hooks';
import { addFile, showInput } from './editorSlice';

export default function AddFile() {
  const dispatch = useDispatch();
  const inputOpen = useAppSelector(state => state.editor.inputOpen);
  const [fileName, setFileName] = useState('');

  return (
    <div>
      {inputOpen ? (
        <input
          value={fileName}
          onChange={e => setFileName(e.target.value)}
          onKeyDown={e => {
            if (e.keyCode === 13) {
              dispatch(addFile(fileName));
              setFileName('');
            }
          }}
        />
      ) : (
        <button onClick={() => dispatch(showInput())}>+</button>
      )}
    </div>
  );
}
