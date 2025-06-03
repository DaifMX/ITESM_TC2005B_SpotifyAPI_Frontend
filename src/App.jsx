import './App.css';
import { getToken } from './utils/getToken';
import { useNavigate } from 'react-router';

import { authFlow, getDataAuth } from './utils/setup';
import { spotifyAPI } from './api/spotifyAPI';
import { useEffect } from 'react';

function App() {
  const navigate = useNavigate();

  const handleSetup = async () => {
    const code = await getDataAuth();
    authFlow(code);
  };

  const handleGetToken = () => {
    getToken();
    navigate('/dashboard')
  };

  const getUsers = async () => {
    const url = "http://localhost:3000/api/users"
    const res = await spotifyAPI(url, 'GET', null);
    console.log(res);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <h1>Spotify Player</h1>
      <div style={{display: 'flex', alignContent: 'center', justifyContent: 'center'}}>
        <button onClick={handleSetup} style={{ backgroundColor: 'green', marginRight: '4px'}}>Login</button>
        <button onClick={handleGetToken} style={{ backgroundColor: 'green' }}>Save token</button>
      </div>
    </>
  );
}

export default App;