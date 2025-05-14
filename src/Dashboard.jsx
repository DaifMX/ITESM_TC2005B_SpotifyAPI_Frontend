import { useState } from 'react';
import { spotifyAPI } from './api/spotifyAPI';

const Dashboard = () => {
    const selectTypes = [
        'album',
        'artist',
        'playlist',
        'track',
        'show',
        'episode',
        'audiobook',
    ];

    const [search, setSearch] = useState({
        song: '',
        types: '',
    });
    const [results, setResults] = useState([]);
    const [deviceId, setDeviceId] = useState(null);

    const handleChange = (e) => {
        const { value, name } = e.target;
        const newFom = {
            ...search,
            [name]: value,
        };

        setSearch(newFom);
    };

    const handleSearch = async () => {
        const params = new URLSearchParams();
        params.append('q', encodeURIComponent(`remaster track:${search.song}`));
        params.append('type', search.types);

        const queryString = params.toString();
        const url = 'https://api.spotify.com/v1/search';

        const updateURL = `${url}?${queryString}`;
        const token = localStorage.getItem('access_token');

        const response = await spotifyAPI(updateURL, 'GET', null, token);
        console.log(response);
        setResults(response.tracks.items);
    };

    const getDeviceId = async () => {
        const token = localStorage.getItem('access_token');
        const url = "https://api.spotify.com/v1/me/player/devices";
        const response = await spotifyAPI(url, 'GET', null, token);

        setDeviceId(response.devices[0].id);
    };

    const handlePlay = async (song) => {
        const token = localStorage.getItem('access_token');
        const data = {
            uris: [song]
        };

        const url = `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`;
        const play = await spotifyAPI(url, 'PUT', JSON.stringify(data), token);
        console.log(play);
    };

    return (
        <>
            <div>Dashboard</div>
            <button onClick={getDeviceId}>GET DEVICE ID</button>
            <p>Search</p>
            <input
                name="song"
                type="text"
                value={search.song}
                onChange={handleChange}
            />
            <p>Select Types:</p>
            <select name="types" value={search.types} onChange={handleChange} >
                {selectTypes.map((type) => (
                    <option key={type} value={type}>
                        {type}
                    </option>
                ))}
            </select>
            <button onClick={handleSearch}>Search</button>
            {results.map((result, index) => (
                <div key={index}>
                    <div>
                        <img src={result.album.images[0].url} width={150} alt="SongImg" />
                    </div>
                    <div>
                        <p>{result.artists[0].name}</p>
                    </div>
                    <div>
                        <button onClick={() => handlePlay(result.uri)}>Play Song</button>
                    </div>
                </div>
            ))}
        </>
    );
};

export default Dashboard;