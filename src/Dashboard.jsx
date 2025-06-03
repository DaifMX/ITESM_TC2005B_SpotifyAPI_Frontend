import { useEffect, useState } from 'react';
import { spotifyAPI } from './api/spotifyAPI';

export default function Dashboard() {
    const selectTypes = ["album", "artist", "track"];
    const [search, setSearch] = useState({
        song: '',
        types: 'album',
    });
    const [deviceId, setDeviceId] = useState(null);
    const [results, setResults] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [isPlayable, setIsPlayable] = useState(false);

    useEffect(() => {
        (async function getDeviceId() {
            const token = localStorage.getItem('access_token');
            const url = "https://api.spotify.com/v1/me/player/devices";
            const response = await spotifyAPI(url, 'GET', null, token);

            if (response) {
                return setDeviceId(response.devices[0].id);
            }
            alert('Unable to set device id.');
        })();
    }, []);

    const handleChange = (e) => {
        const { value, name } = e.target;
        const newForm = {
            ...search,
            [name]: value,
        };

        setSearch(newForm);
        setResults([]);
    };

    const handleSearch = async () => {
        const url = `https://api.spotify.com/v1/search?q=${search.song}&type=${search.types}`;
        const token = localStorage.getItem('access_token');
        const response = await spotifyAPI(url, 'GET', null, token);

        if (search.types === 'track') setIsPlayable(true);
        else setIsPlayable(false);

        setResults(response[`${search.types}s`].items);
    };

    const handlePlay = async (song) => {
        if (!search.types) alert('Not a song.');
        const token = localStorage.getItem('access_token');
        const data = {
            uris: [song]
        };

        const url = `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`;
        await spotifyAPI(url, 'PUT', JSON.stringify(data), token);
    };

    const createFavs = async (favs) => {
        const user_Id = 1;
        const url = `http://localhost:3000/api/favorites/create`;

        const data = {
            user_Id,
            items: favs
        };

        await spotifyAPI(url, 'POST', JSON.stringify(data), null);
    };

    const saveFavs = async () => await createFavs(favorites);

    const handleAddFavorite = async (fav) => {
        const isAlreadyFav = favorites.some((e) => e.id === fav.id);
        if (isAlreadyFav) return setFavorites((prev) => prev.filter((el) => el.id !== fav.id));

        setFavorites((prev) => [...prev, fav]);
    };

    return (
        <>
            <div className='parent-container' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '4px', marginBottom: '100vh' }}>
                <h1>SpotiApp</h1>
                <button
                    onClick={saveFavs}
                    style={{
                        backgroundColor: "#28a745",
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                        padding: "12px 24px",
                        fontSize: "16px",
                        fontWeight: "500",
                        cursor: "pointer",
                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
                        transition: "background-color 0.2s, transform 0.1s",
                        marginBottom: '8px',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#218838")}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#28a745")}
                >
                    SAVE FAVS
                </button>
                <div
                    className="search-container"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        backgroundColor: "#1e1e1e",
                        padding: "16px",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                        marginBottom: '8px'
                    }}
                >
                    <p
                        style={{
                            margin: 0,
                            fontSize: "16px",
                            fontWeight: 500,
                            color: "#fff",
                        }}
                    >
                        Search
                    </p>

                    <input
                        name="song"
                        type="text"
                        value={search.song}
                        onChange={handleChange}
                        placeholder="Enter song name"
                        style={{
                            flex: 1,
                            backgroundColor: "#2a2a2a",
                            border: "none",
                            borderRadius: "8px",
                            padding: "12px 16px",
                            fontSize: "16px",
                            color: "#fff",
                            boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.2)",
                            outline: "none",
                        }}
                    />

                    <p
                        style={{
                            margin: 0,
                            fontSize: "16px",
                            fontWeight: 500,
                            color: "#fff",
                        }}
                    >
                        Select Types:
                    </p>

                    <select
                        name="types"
                        value={search.types}
                        onChange={handleChange}
                        style={{
                            backgroundColor: "#2a2a2a",
                            border: "none",
                            borderRadius: "8px",
                            padding: "12px 16px",
                            fontSize: "16px",
                            color: "#fff",
                            boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.2)",
                            outline: "none",
                        }}
                    >
                        {selectTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={handleSearch}
                        style={{
                            backgroundColor: "#007bff",
                            border: "none",
                            borderRadius: "8px",
                            color: "#fff",
                            padding: "12px 24px",
                            fontSize: "16px",
                            fontWeight: 500,
                            cursor: "pointer",
                            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
                            transition: "background-color 0.2s, transform 0.1s",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#0069d9")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#007bff")
                        }
                    >
                        SEARCH
                    </button>
                </div>

                <div className='results-container' style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    {results.length > 0 ? results.map((result, index) => {
                        const getMeta = () => {
                            switch (search.types) {
                                case "album":
                                    return {
                                        image: result.images[0].url,
                                        data: [
                                            { key: "Álbum", value: result.name },
                                            { key: "Artista", value: result.artists[0].name },
                                            { key: "Lanzamiento", value: result.release_date },
                                            { key: "Total de pistas", value: result.total_tracks.toString() }
                                        ]
                                    };

                                case "artist":
                                    return {
                                        image: (result.images && result.images.length > 0)
                                            ? result.images[0].url
                                            : null,
                                        data: [
                                            { key: "Artista", value: result.name },
                                            { key: "Seguidores", value: result.followers.total.toString() },
                                            { key: "Géneros", value: result.genres.join(", ") || "—" }
                                        ]
                                    };

                                case "track":
                                    return {
                                        image: result.album.images[0].url,
                                        data: [
                                            { key: "Canción", value: result.name },
                                            { key: "Álbum", value: result.album.name },
                                            { key: "Artista", value: result.artists[0].name }
                                        ]
                                    };

                                default:
                                    return { image: null, data: [] };
                            }
                        };

                        const meta = getMeta();

                        return (
                            <div
                                className="card-container"
                                key={`card-container-${index}`}
                                style={{
                                    height: "500px",
                                    width: "400px",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    backgroundColor: "#1e1e1e",
                                    borderRadius: "12px",
                                    padding: "16px",
                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                                    color: "#fff",
                                }}
                            >
                                <div>
                                    <img src={meta.image} width={150} alt="SongImg" />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                    {meta.data.map((item, idx) => (
                                        <p key={idx}>{item.key}: {item.value}</p>
                                    ))}
                                </div>
                                <div className='card-btns-container' style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
                                    <button disabled={!isPlayable} onClick={() => handlePlay(result.uri)}>Play Song</button>
                                    <button onClick={() => handleAddFavorite(result)}>Add to Favorites</button>
                                </div>
                            </div>
                        );
                    }) : undefined}
                </div>
            </div>
        </>
    );
};