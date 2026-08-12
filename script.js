// script.js
document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const movieInput = document.getElementById('movieInput');
    if (searchButton) searchButton.addEventListener('click', searchMovies);
    if (movieInput) {
        movieInput.addEventListener('keypress', (e) => { 
            if (e.key === 'Enter') { e.preventDefault(); searchMovies(); }
        });
    }
});

// Адрес твоего Cloudflare Worker
const WORKER_URL = 'https://deploy.romanbor555.workers.dev';

const VIEW_DOMAIN = 'www.kinopoisk.cam'; 

async function searchMovies() {
    const query = document.getElementById('movieInput').value.trim();
    if (!query) return;
     
    const url = `${WORKER_URL}/api/search?q=${encodeURIComponent(query)}&page=1`;

    const loading = document.getElementById('loading');
    const resultsDiv = document.getElementById('results');
    loading.classList.remove('hidden');
    resultsDiv.innerHTML = '';

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.films) displayResults(data.films);
    } catch (error) {
        console.error('Ошибка:', error);
    } finally {
        loading.classList.add('hidden');
    }
}

function displayResults(movies) {
    const resultsDiv = document.getElementById('results');
    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.className = 'movie-item';
        movieElement.onclick = () => openMovie(movie.filmId);

        const poster = movie.posterUrlPreview || '';
        const title = movie.nameRu || movie.nameEn || 'Без названия';
        
        movieElement.innerHTML = `
            <img class="movie-poster" src="${poster}">
            <div class="movie-info">
                <div class="movie-title">${title} (${movie.year || ''})</div>
                <div class="movie-details">★ ${movie.rating || '0.0'}</div>
            </div>
        `;
        resultsDiv.appendChild(movieElement);
    });
}

function openMovie(id) {
    // ID
    const finalUrl = `https://${VIEW_DOMAIN}/film/${id}/`;
    window.open(finalUrl, '_blank');
}

function copyDnsLink() {
    const linkElement = document.getElementById('dnsLink');
    navigator.clipboard.writeText(linkElement.textContent);
}
