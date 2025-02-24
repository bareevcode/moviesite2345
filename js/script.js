const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYmM1N2M3MDQzYzgzY2EwY2NiMzA5N2UwYjMyMDkyOCIsIm5iZiI6MTc0MDM5ODUxOC4zNjksInN1YiI6IjY3YmM1ZmI2MjQ5MmY0MDM3MDQ2NjBlYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EVrOoWvdz6h0dmnDYojRulMgWRRn_FIRR8x_TkOkfZ0'; // Замените на ваш API-ключ
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

// Элементы DOM
const popularMoviesContainer = document.getElementById('popular-movies');
const searchResultsContainer = document.getElementById('search-results');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

// Загрузка популярных фильмов
async function fetchPopularMovies() {
    const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ru-RU`;
    const response = await fetch(url);
    const data = await response.json();
    displayMovies(data.results, popularMoviesContainer);
}

// Поиск фильмов
async function searchMovies(query) {
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=ru-RU&query=${query}`;
    const response = await fetch(url);
    const data = await response.json();
    displayMovies(data.results, searchResultsContainer);
    document.querySelector('.search-results').style.display = 'block'; // Показываем результаты поиска
}

// Отображение фильмов
function displayMovies(movies, container) {
    container.innerHTML = ''; // Очищаем контейнер
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="${IMAGE_URL}${movie.poster_path}" alt="${movie.title}">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <p>Рейтинг: ${movie.vote_average}</p>
            </div>
        `;
        movieCard.addEventListener('click', () => playMovie(movie.id)); // Воспроизведение фильма
        container.appendChild(movieCard);
    });
}

// Воспроизведение фильма (используем YouTube)
async function playMovie(movieId) {
    const url = `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=ru-RU`;
    const response = await fetch(url);
    const data = await response.json();
    const trailer = data.results.find(video => video.site === 'YouTube' && video.type === 'Trailer');
    if (trailer) {
        window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank');
    } else {
        alert('Трейлер не найден.');
    }
}

// Обработка формы поиска
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        searchMovies(query);
    }
});

// Загружаем популярные фильмы при загрузке страницы
fetchPopularMovies();
