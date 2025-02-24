const YOUTUBE_API_KEY = 'AIzaSyAwl0OeE8lTXelI1NGuRdqYfdbDcTbdyco'; // Замените на ваш API ключ
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchResultsContainer = document.getElementById('search-results');
const searchResultsWrapper = document.getElementById('search-results-container');
const playerModal = document.getElementById('player-modal');
const youtubePlayer = document.getElementById('youtube-player');

// Функция для проверки, является ли видео трейлером
function isTrailer(title) {
    const trailerKeywords = ['трейлер', 'trailer', 'тизер', 'teaser', 'official'];
    return trailerKeywords.some(keyword => title.toLowerCase().includes(keyword));
}

// Поиск видео на YouTube
async function searchYouTube(query) {
    try {
        // Добавляем ключевые слова для поиска полных фильмов
        const searchQuery = `${query} полный фильм`;
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&key=${YOUTUBE_API_KEY}&maxResults=10`;
        const response = await fetch(url);
        const data = await response.json();

        // Фильтруем результаты, исключая трейлеры
        const filteredVideos = data.items.filter(video => !isTrailer(video.snippet.title));
        return filteredVideos[0]; // Возвращаем первый фильтрованный результат
    } catch (error) {
        console.error('Ошибка при поиске видео на YouTube:', error);
        return null;
    }
}

// Отображение результата поиска
function displayResult(video) {
    searchResultsContainer.innerHTML = '';
    if (!video) {
        searchResultsContainer.innerHTML = '<p>Ничего не найдено.</p>';
        return;
    }
    const videoCard = document.createElement('div');
    videoCard.classList.add('movie-card');
    videoCard.innerHTML = `
        <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
        <div class="movie-info">
            <h3>${video.snippet.title}</h3>
        </div>
    `;
    videoCard.addEventListener('click', () => playVideo(video.id.videoId));
    searchResultsContainer.appendChild(videoCard);
    searchResultsWrapper.style.display = 'block';
}

// Воспроизведение видео
function playVideo(videoId) {
    playerModal.style.display = 'block';
    youtubePlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
}

// Закрытие модального окна
function closePlayerModal() {
    playerModal.style.display = 'none';
    youtubePlayer.src = '';
}

// Обработка формы поиска
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        const video = await searchYouTube(query);
        displayResult(video);
    }
});
