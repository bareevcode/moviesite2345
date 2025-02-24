const API_KEY = 'ВАШ_API_КЛЮЧ'; // Замените на ваш API-ключ
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

// Элементы DOM
const popularMoviesContainer = document.getElementById('popular-movies');
const searchResultsContainer = document.getElementById('search-results');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

// Загрузка популярных фильмов
async function fetchPopularMovies() {
    try {
        const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ru-RU`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Ошибка при загрузке популярных фильмов');
        }
        const data = await response.json();
        displayMovies(data.results, popularMoviesContainer);
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось загрузить популярные фильмы. Пожалуйста, попробуйте позже.');
    }
}

// Поиск фильмов
async function searchMovies(query) {
    try {
        const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=ru-RU&query=${query}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Ошибка при поиске фильмов');
        }
        const data = await response.json();
        displayMovies(data.results, searchResultsContainer);
        document.querySelector('.search-results').style.display = 'block'; // Показываем результаты поиска
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось выполнить поиск. Пожалуйста, попробуйте позже.');
    }
}

// Отображение фильмов
function displayMovies(movies, container) {
    container.innerHTML = ''; // Очищаем контейнер
    if (movies.length === 0) {
        container.innerHTML = '<p>Ничего не найдено.</p>'; // Сообщение, если фильмов нет
        return;
    }
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
        movieCard.addEventListener('click', () => showMovieDetails(movie.id)); // Показ деталей фильма
        container.appendChild(movieCard);
    });
}

// Показ деталей фильма
async function showMovieDetails(movieId) {
    try {
        const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=ru-RU`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Ошибка при загрузке деталей фильма');
        }
        const data = await response.json();
        displayMovieDetails(data);
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось загрузить детали фильма. Пожалуйста, попробуйте позже.');
    }
}

// Отображение деталей фильма
function displayMovieDetails(movie) {
    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('movie-details');
    detailsContainer.innerHTML = `
        <h2>${movie.title}</h2>
        <img src="${IMAGE_URL}${movie.poster_path}" alt="${movie.title}">
        <p><strong>Описание:</strong> ${movie.overview}</p>
        <p><strong>Рейтинг:</strong> ${movie.vote_average}</p>
        <p><strong>Дата выхода:</strong> ${movie.release_date}</p>
        <button onclick="closeMovieDetails()">Закрыть</button>
    `;
    document.body.appendChild(detailsContainer);
}

// Закрытие деталей фильма
function closeMovieDetails() {
    const detailsContainer = document.querySelector('.movie-details');
    if (detailsContainer) {
        detailsContainer.remove();
    }
}

// Воспроизведение трейлера фильма (используем YouTube)
async function playMovie(movieId) {
    try {
        const url = `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=ru-RU`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Ошибка при загрузке трейлера');
        }
        const data = await response.json();
        const trailer = data.results.find(video => video.site === 'YouTube' && video.type === 'Trailer');
        if (trailer) {
            window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank');
        } else {
            alert('Трейлер не найден.');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось загрузить трейлер. Пожалуйста, попробуйте позже.');
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
