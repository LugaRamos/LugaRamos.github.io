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
        showAlert('Nenhum filme encontrado.', 'info');
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
        posterImage.classList.add('card-img-top'); // Adiciona a classe para garantir que a imagem fique no topo
        posterImage.src = movie.poster; // Certifique-se de que 'movie' tenha uma propriedade 'poster' com o URL do poster
        posterImage.alt = `${movie.title} Poster`; // Adiciona um texto alternativo para acessibilidade

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
        deleteButton.textContent = 'Excluir';
        deleteButton.onclick = () => deleteMovie(movie.id);

        cardBody.appendChild(title);
        cardBody.appendChild(overview);
        cardBody.appendChild(voteAverage);

        // Adiciona a imagem do poster antes dos outros elementos
        movieCard.appendChild(posterImage);

        cardBody.appendChild(deleteButton);

        // Adiciona o corpo do cartão depois da imagem
        movieCard.appendChild(cardBody);

        // Adiciona o cartão à área principal
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
        showAlert('Preencha todos os campos.', 'danger');
        return;
    }

    const apiKey = '8a12ca07'; // Substitua com sua chave de API TMDb
    const apiUrl = `http://www.omdbapi.com/?t=${(title)}&apikey=${apiKey}`; // Use encodeURIComponent para garantir que o título seja codificado corretamente

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.Response === 'True') { // Verifica se a resposta da API é bem-sucedida
                const poster = data.Poster || ''; // Obtenha o URL do poster

                const newMovie = {
                    id: moviesData.length + 1,
                    title: title,
                    overview: overview,
                    vote_average: parseFloat(voteAverage),
                    poster: poster,
                };

                moviesData.push(newMovie);
                saveMovies(moviesData);
                loadMovies(); // Atualiza a exibição dos filmes

                // Exibe uma mensagem de sucesso e fecha o modal
                showAlert('Filme cadastrado com sucesso!', 'success');
                $('#movieFormModal').modal('hide'); // Fecha o modal de formulário

                // Limpa os valores dos campos do formulário
                document.getElementById('title').value = '';
                document.getElementById('overview').value = '';
                document.getElementById('vote-average').value = '';
            } else {
                // Exibe uma mensagem de erro se a resposta da API não for bem-sucedida
                showAlert('Erro ao obter informações do filme. Verifique o título e tente novamente.', 'danger');
            }
        })
        .catch(error => {
            console.error('Erro ao obter o poster do filme:', error);
        });
}



function showAlert(message, type) {
    const alertContainer = document.createElement('div');
    alertContainer.classList.add('alert', `alert-${type}`, 'alert-dismissible', 'fade', 'show');
    alertContainer.setAttribute('role', 'alert');

    const alertMessage = document.createTextNode(`${type.toUpperCase()}: ${message}`);

    const closeButton = document.createElement('button');
    closeButton.classList.add('close');
    closeButton.setAttribute('type', 'button');
    closeButton.setAttribute('data-dismiss', 'alert');
    closeButton.setAttribute('aria-label', 'Close');

    const closeIcon = document.createElement('span');
    closeIcon.setAttribute('aria-hidden', 'true');
    closeIcon.innerHTML = '&times;';

    closeButton.appendChild(closeIcon);
    alertContainer.appendChild(alertMessage);
    alertContainer.appendChild(closeButton);

    const mainContainer = document.getElementById('main-container');
    mainContainer.insertBefore(alertContainer, mainContainer.firstChild);

    setTimeout(() => {
        // Remove o alerta após alguns segundos (tempo de exibição)
        alertContainer.remove();
    }, 5000); // 5000 milissegundos = 5 segundos
}

function deleteMovie(movieId) {
    moviesData = moviesData.filter(movie => movie.id !== movieId);
    saveMovies(moviesData);
    loadMovies(); // Atualiza a exibição dos filmes
}




