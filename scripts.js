let moviesData = [];

function saveMovies(movies) {
    localStorage.setItem('movies', JSON.stringify(movies));
}

function loadMovies() {
    const storedMovies = JSON.parse(localStorage.getItem('movies')) || [];
    moviesData = storedMovies;
    displayMovies(moviesData);

}

function displayMovies(movies) {
    const mainContainer = document.getElementById('main-container');
    mainContainer.innerHTML = '';

    if (movies.length === 0) {
        alert('Nenhum filme encontrado.', 'info');
        return;
    }

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('card', 'mb-3');

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const title = document.createElement('h5');
        title.classList.add('card-title');
        title.textContent = movie.title;

        const overview = document.createElement('p');
        overview.classList.add('card-text');
        overview.textContent = movie.overview;

        const voteAverage = document.createElement('p');
        voteAverage.classList.add('card-text');
        voteAverage.textContent = `Avaliação: ${movie.vote_average}`;

        // Adiciona a imagem do poster
        const posterImage = document.createElement('img');
        posterImage.classList.add('card-img-top');
        posterImage.src = movie.poster;
        posterImage.alt = `${movie.title} Poster`; 

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
        deleteButton.textContent = 'Excluir';
        deleteButton.onclick = () => deleteMovie(movie.id);

        const editButton = document.createElement('button');
        editButton.classList.add('btn', 'btn-primary', 'btn-sm', 'mr-2', 'ml-2');
        editButton.textContent = 'Editar';
        editButton.onclick = () => openEditForm(movie);

        cardBody.appendChild(title);
        cardBody.appendChild(overview);
        cardBody.appendChild(voteAverage);
        movieCard.appendChild(posterImage);

        cardBody.appendChild(deleteButton);
        cardBody.appendChild(editButton);
        movieCard.appendChild(cardBody);
        mainContainer.appendChild(movieCard);
    });
}



function loadForm() {
    $('#movieFormModal').modal('show');
}

function createMovie() {
    const title = document.getElementById('title').value;
    const overview = document.getElementById('overview').value;
    const voteAverage = document.getElementById('vote-average').value;

    if (!title || !overview || !voteAverage) {
        alert('Preencha todos os campos.', 'danger');
        return;
    }

    if (isNaN(voteAverage) || voteAverage < 1 || voteAverage > 10) {
        alert('A avaliação deve estar entre 1 e 10.', 'danger');
        return;
    }

    const apiKey = '8a12ca07';
    const apiUrl = `http://www.omdbapi.com/?t=${(title)}&apikey=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.Response === 'True') {
                const poster = data.Poster || '';

                const newMovie = {
                    id: moviesData.length + 1,
                    title: title,
                    overview: overview,
                    vote_average: parseFloat(voteAverage),
                    poster: poster,
                };

                moviesData.push(newMovie);
                saveMovies(moviesData);
                loadMovies();

                alert('Filme cadastrado com sucesso!', 'success');
                $('#movieFormModal').modal('hide'); 

                document.getElementById('title').value = '';
                document.getElementById('overview').value = '';
                document.getElementById('vote-average').value = '';
            } else {
                alert('Erro ao obter informações do filme. Verifique o título e tente novamente.', 'danger');
            }
        })
        .catch(error => {
            console.error('Erro ao obter o poster do filme:', error);
        });
}


function deleteMovie(movieId) {
    moviesData = moviesData.filter(movie => movie.id !== movieId);
    saveMovies(moviesData);
    loadMovies();
}

function openEditForm(movie) {
    document.getElementById('edit-overview').value = movie.overview;
    document.getElementById('edit-vote-average').value = movie.vote_average;

    $('#editMovieFormModal').modal('show');

    document.getElementById('editMovieForm').onsubmit = function(event) {
        event.preventDefault();
        updateMovie(movie.id);
        $('#editMovieFormModal').modal('hide');
    };
}

function updateMovie(movieId) {
    const editedOverview = document.getElementById('edit-overview').value;
    const editedVoteAverage = parseFloat(document.getElementById('edit-vote-average').value);

    // Encontra o filme na lista e atualiza as informações
    moviesData = moviesData.map(movie => {
        if (movie.id === movieId) {
            return {
                ...movie,
                overview: editedOverview,
                vote_average: editedVoteAverage,
            };
        } else {
            return movie;
        }
    });

    saveMovies(moviesData);
    loadMovies();
}

document.addEventListener('DOMContentLoaded', function() {
    loadMovies();
});




