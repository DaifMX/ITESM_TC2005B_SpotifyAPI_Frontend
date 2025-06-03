export const spotifyAPI = async (url, method, body, token) => {
    const response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: body ?? null
    });

    if (!response.ok) return console.error(response);
    else return response.json();
};