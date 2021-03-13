import { Provider } from 'react-redux';
import { store } from './app/store';
import Editor from './features/editor/Editor';

function App() {
  return (
    <Provider store={store}>
      <Editor />
    </Provider>
  );
}

export default App;
