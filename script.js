// Дожидаемся загрузки DOM, чтобы элементы точно существовали
document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const movieInput = document.getElementById('movieInput');

    if (searchButton) {
        searchButton.addEventListener('click', searchMovies);
    }
    if (movieInput) {
        movieInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                searchMovies();
            }
        });
    }
});

// Функция поиска (доступна глобально)
async function searchMovies() {
    const query = document.getElementById('movieInput').value.trim();
    if (!query) {
        showError('Пожалуйста, введите название фильма.');
        return;
    }

    // 🔑 ВСТАВЬТЕ СВОЙ НОВЫЙ ТОКЕН (СКОПИРУЙТЕ ИЗ БОТА)
    const API_KEY = '3W9C8C5-2H1M85S-GEXEN27-S5DG27B';
    
    // ✅ Правильный домен API (poiskkino.dev)
    const url = `https://api.poiskkino.dev/v1.4/movie/search?page=1&limit=10&query=${encodeURIComponent(query)}`;

    const loading = document.getElementById('loading');
    const resultsDiv = document.getElementById('results');
    const errorDiv = document.getElementById('error');

    loading.classList.remove('hidden');
    resultsDiv.innerHTML = '';
    errorDiv.classList.add('hidden');

    try {
        const response = await fetch(url, {
            headers: { 'X-API-KEY': API_KEY }
        });

        if (!response.ok) {
            throw new Error(`Ошибка API: ${response.status}`);
        }

        const data = await response.json();
        if (!data.docs || data.docs.length === 0) {
            showError('Ничего не найдено. Попробуйте изменить запрос.');
            return;
        }

        displayResults(data.docs);
    } catch (error) {
        console.error('Ошибка при поиске:', error);
        showError('Не удалось выполнить поиск. Проверьте API-ключ и попробуйте снова.');
    } finally {
        loading.classList.add('hidden');
    }
}

function displayResults(movies) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.className = 'movie-item';
        movieElement.onclick = () => openMovie(movie.id);

        const posterUrl = movie.poster?.previewUrl || 'https://via.placeholder.com/50x75?text=?';
        const year = movie.year ? ` (${movie.year})` : '';
        const rating = movie.rating?.kp ? `★ ${movie.rating.kp.toFixed(1)}` : '';

        movieElement.innerHTML = `
            <img class="movie-poster" src="${posterUrl}" alt="${movie.name}" onerror="this.src='https://via.placeholder.com/50x75?text=?'">
            <div class="movie-info">
                <div class="movie-title">${movie.name}${year}</div>
                <div class="movie-details">
                    ${movie.alternativeName ? `${movie.alternativeName} • ` : ''}
                    ${movie.movieLength ? `${movie.movieLength} мин` : ''}
                    ${rating ? ` • ${rating}` : ''}
                </div>
            </div>
        `;
        resultsDiv.appendChild(movieElement);
    });
}

function openMovie(kinopoiskId) {
    const wtfUrl = `https://www.kinopoisk.wtf/film/${kinopoiskId}/`;
    window.open(wtfUrl, '_blank');
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}
// Функция копирования DNS-ссылки при клике на саму ссылку
function copyDnsLink() {
    const linkElement = document.getElementById('dnsLink');
    if (!linkElement) return;
    
    const linkText = linkElement.textContent;
    navigator.clipboard.writeText(linkText).then(() => {
        // Визуальное подтверждение: временно меняем текст ссылки
        const originalText = linkElement.textContent;
        linkElement.textContent = '✅ Ссылка скопирована!';
        setTimeout(() => {
            linkElement.textContent = originalText;
        }, 2000);
    }).catch(err => {
        alert('Не удалось скопировать. Выделите ссылку вручную.');
    });
}
