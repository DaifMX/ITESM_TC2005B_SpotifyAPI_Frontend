import './App.css';
import { getToken } from './getToken';

import { authFlow, getDataAuth } from './setup';

function App() {

  const handleSetup = async () => {
    const code = await getDataAuth();
    authFlow(code)
  };

  const handleGetToken = () => {
    getToken();
  };
  
  return (
    <>
      <h1>Hola Mund34</h1>
      <button onClick={handleSetup}>START SETUP </button>
      <button onClick={handleGetToken}>GET TOKEN </button>
    </>
  );
}

export default App;