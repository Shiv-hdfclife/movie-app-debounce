// import { useEffect, useState } from "react";
// import Badge from "./Badge"


// const API_KEY = '8f0dfea8a2802b58251c157f7a6b1916';
// const BASE_URL = 'https://api.themoviedb.org/3';
// const IMAGE_BASE = 'https://image.tmdb.org/t/p/w342';




// export async function searchMovies(query, limit = 20, signal) {
//     const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&limit=${limit}`;
//     return fetchMovies(url, limit, signal);
// }


// async function fetchMovies(url, limit, signal) {
//     try {
//         const res = await fetch(url, { signal })
//         if (!res.ok) {
//             throw new Error("The response is not valid", res.status);
//         }

//         const data = await res.json();
//         if (!data.results) {
//             throw new Error("Invalid resposne");
//         }

//         console.log("the data:", data.results);

//         // const value = 

//         // setResults(value);

//         return data.results.slice(0, limit).map((movie) => ({
//             id: movie.id,
//             title: movie.title,
//             year: (movie.release_date || '').split('-')[0],
//             poster: movie.poster_path
//                 ? IMAGE_BASE + movie.poster_path
//                 : 'https://via.placeholder.com/342x513?text=No+Image',
//         }))



//     } catch (err) {
//         if (err.name === 'AbortError') {
//             console.log("Fetch aborted");
//             return []; // or don't update state
//         }
//         throw new Error("Failed to get the movie data.");
//     }
// }

// const dummyData = [
//     {
//         id: 1,
//         title: "Spider-Man",
//         year: "2002",
//         poster: IMAGE_BASE + "/gh4cZbhZxyTbgxQPxD0dOudNPTn.jpg",
//     },
//     {
//         id: 2,
//         title: "The Secret in Their Eyes",
//         year: "2009",
//         poster: "https://upload.wikimedia.org/wikipedia/en/9/91/Cartel-nuevo-de-el-secreto-de-sus-ojos.jpg",
//     },
//     {
//         id: 3,
//         title: "The Hunger Games: Mockingjay - Part 1",
//         year: "2014",
//         poster: "https://m.media-amazon.com/images/M/MV5BMTcxNDI2NDAzNl5BMl5BanBnXkFtZTgwODM3MTc2MjE@._V1_.jpg",
//     },
// ];

// export function MovieCard() {
//     const [query, setQuery] = useState("");
//     const [results, setResults] = useState(dummyData); // Start with dummy data
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");

//     useEffect(() => {
//         if (!query.trim()) {
//             // If query empty or whitespace, show dummy data
//             setResults(dummyData);
//             setLoading(false);
//             setError("");
//             return;
//         }

//         const controller = new AbortController();

//         const timer = setTimeout(() => {
//             const fetchData = async () => {
//                 try {
//                     setLoading(true);
//                     setError("");
//                     const movies = await searchMovies(query, 10, controller.signal);
//                     setResults(movies);
//                     setLoading(false);
//                 } catch (err) {
//                     console.error(err);
//                     setError("Failed to fetch movies");
//                     setLoading(false);
//                 }
//             };

//             fetchData();
//         }, 500);

//         return () => {
//             clearTimeout(timer);
//             controller.abort();
//         };
//     }, [query]);

//     return (
//         <>
//             <h4>Moviecard</h4>

//             <div>
//                 <input
//                     type="text"
//                     placeholder="Enter the movie name"
//                     value={query}
//                     onChange={(e) => setQuery(e.target.value)}
//                 />
//                 {loading && <p>Loading...</p>}
//                 {error && <p>{error}</p>}

//                 <div className="movie-container">
//                     {results.map((data) => (
//                         <div className="movie-card" key={data.id}>
//                             <h3>{data.title}</h3>
//                             <img src={data.poster} alt={data.title} />
//                             <div className="badge">
//                                 <Badge year={data.year} />
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//         </>
//     );
// }


import { useEffect, useState } from "react";
import Badge from "./Badge";

const API_KEY = '8f0dfea8a2802b58251c157f7a6b1916';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w342';
const BASE_URL = 'https://api.themoviedb.org/3';

// ✅ Dummy data with real TMDb poster paths
const dummyData = [
    {
        id: 1,
        title: "Spider-Man",
        year: "2002",
        poster: IMAGE_BASE + "/gh4cZbhZxyTbgxQPxD0dOudNPTn.jpg",
        genres: ["Action", "Science Fiction"],
    },
    {
        id: 2,
        title: "The Secret in Their Eyes",
        year: "2009",
        poster: "https://upload.wikimedia.org/wikipedia/en/9/91/Cartel-nuevo-de-el-secreto-de-sus-ojos.jpg",
        genres: ["Crime", "Mystery", "Drama"],
    },
    {
        id: 3,
        title: "The Hunger Games: Mockingjay - Part 1",
        year: "2014",
        poster: "https://m.media-amazon.com/images/M/MV5BMTcxNDI2NDAzNl5BMl5BanBnXkFtZTgwODM3MTc2MjE@._V1_.jpg",
        genres: ["Science Fiction", "Adventure", "Thriller"],
    },
];

// ✅ Global genre map cache
let genreMap = null;

// ✅ Get genre ID-to-name map (movie genres)
async function getGenreMap() {
    if (genreMap) return genreMap;

    const res = await fetch(`${BASE_URL}/genre/movie/list?language=en`, {
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZjBkZmVhOGEyODAyYjU4MjUxYzE1N2Y3YTZiMTkxNiIsIm5iZiI6MTc1NDkxNzE5Ny41Mzc5OTk5LCJzdWIiOiI2ODk5ZTk0ZGI0YTEzMmJhMGQ4ZGFkNjAiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.DlDbsY4-B8H86NcfgHmZQ9b8cIgtGJoBjUveukGBuTI',
        },
    });

    const data = await res.json();
    genreMap = {};
    data.genres.forEach((g) => {
        genreMap[g.id] = g.name;
    });

    return genreMap;
}

// ✅ Search movies
export async function searchMovies(query, limit = 20, signal) {
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
    return fetchMovies(url, limit, signal);
}

// ✅ Fetch movies and map genres
async function fetchMovies(url, limit, signal) {
    try {
        const res = await fetch(url, { signal });
        if (!res.ok) {
            throw new Error("Invalid response");
        }

        const data = await res.json();
        if (!data.results) {
            throw new Error("Invalid data format");
        }

        const genres = await getGenreMap();

        return data.results.slice(0, limit).map((movie) => ({
            id: movie.id,
            title: movie.title,
            year: (movie.release_date || '').split('-')[0],
            poster: movie.poster_path
                ? IMAGE_BASE + movie.poster_path
                : 'https://via.placeholder.com/342x513?text=No+Image',
            genres: movie.genre_ids.map((id) => genres[id]).filter(Boolean),
        }));
    } catch (err) {
        if (err.name === 'AbortError') {
            console.log("Fetch aborted");
            return [];
        }
        console.error(err);
        throw new Error("Failed to fetch movie data");
    }
}

// ✅ Main Component
export function MovieCard() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState(dummyData); // initial dummy data
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!query.trim()) {
            setResults(dummyData);
            setLoading(false);
            setError("");
            return;
        }

        const controller = new AbortController();
        const timer = setTimeout(() => {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    setError("");
                    const movies = await searchMovies(query, 10, controller.signal);
                    setResults(movies);
                    setLoading(false);
                } catch (err) {
                    setError("Failed to fetch movies");
                    setLoading(false);
                }
            };
            fetchData();
        }, 500);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [query]);

    return (
        <>
            <h4>MovieCard</h4>
            <div>
                <input
                    type="text"
                    placeholder="Enter the movie name"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}

                <div className="movie-container">
                    {results.map((data) => (
                        <div className="movie-card" key={data.id}>
                            <h3>{data.title}</h3>
                            <img src={data.poster} alt={data.title} style={{ width: '150px' }} />
                            <div className="badge">
                                <Badge year={data.year} />
                            </div>
                            <div className="genres">
                                {data.genres && data.genres.length > 0 && (
                                    <p>{data.genres.join(', ')}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
