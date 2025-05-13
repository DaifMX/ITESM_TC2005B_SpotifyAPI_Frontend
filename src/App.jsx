import './App.css';
import { getToken } from './getToken';
import { useNavigate } from 'react-router';

import { authFlow, getDataAuth } from './setup';

function App() {
  const navigate = useNavigate();

  const handleSetup = async () => {
    const code = await getDataAuth();
    authFlow(code)
  };

  const handleGetToken = () => {
    getToken();
    navigate('/dashboard')
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