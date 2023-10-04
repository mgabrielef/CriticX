document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const reviewsContainer = document.getElementById('reviews');
    const username = localStorage.getItem('userprofile');

        try {
            const reviewResponse = await fetch(`/api/allReviews/user/?userProfile=${encodeURIComponent(username)}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (reviewResponse.ok) {
                const reviewsData = await reviewResponse.json();

                reviewsContainer.innerHTML = '';

                const titleHeader = document.createElement('h1');
                titleHeader.textContent = `Avaliações para o Usuário: ${username}`;
                reviewsContainer.appendChild(titleHeader);

                reviewsData.forEach((review) => {
                    const movieGenre = `${review.genre}`;

                    const specialRatingMap = new Map([
                        ['Horror', 'Nivel de Medo'],
                        ['Comedy', 'Nivel de Diversão'],
                        ['Action', 'Nivel de Adrenalina'],
                        ['Romance', 'Nivel de Amor'],
                        ['Drama', 'Nivel de Drama'],
                    ]);

                    const getSpecialRating = (genre) => {
                        const genreArray = genre.split(',');
                        const firstGenre = genreArray[0];
                        return specialRatingMap.get(firstGenre.trim());
                    }

                    const movieGenreMapped = getSpecialRating(movieGenre);

                    const table = document.createElement('table');
                    table.classList.add('table');

                    const tbody = document.createElement('tbody');

                    const titleRow = document.createElement('tr');
                    const titleCell = document.createElement('td');
                    titleCell.textContent = `Título: ${review.title}`;
                    titleRow.appendChild(titleCell);
                    tbody.appendChild(titleRow);

                    const ratingRow = document.createElement('tr');
                    const ratingCell = document.createElement('td');
                    ratingCell.textContent = `Nota: ${review.rating}`;
                    ratingRow.appendChild(ratingCell);
                    tbody.appendChild(ratingRow);

                    const commentRow = document.createElement('tr');
                    const commentCell = document.createElement('td');
                    commentCell.textContent = `Comentário: ${review.review}`;
                    commentRow.appendChild(commentCell);
                    tbody.appendChild(commentRow);


                    if (review.specialrating !== null) {
                        const specialRatingRow = document.createElement('tr');
                        const specialRatingCell = document.createElement('td');
                        specialRatingCell.textContent = `${movieGenreMapped}: ${review.specialrating}`;
                        specialRatingRow.appendChild(specialRatingCell);
                        tbody.appendChild(specialRatingRow);
                    }

                    table.appendChild(tbody);
                    reviewsContainer.appendChild(table);

                    const commentReviewButtonRow = document.createElement('tr');
                    const commentReviewButtonCell = document.createElement('td');
                    const commentButton = document.createElement('button');
                    commentButton.id = 'get-review-id'
                    commentButton.textContent = 'Comentar';
                    commentButton.addEventListener('click', () => {
                        localStorage.setItem('reviewId', review.id);
                        window.location.href = '/createComment';
                    });
                    commentReviewButtonCell.appendChild(commentButton);
                    commentReviewButtonRow.appendChild(commentReviewButtonCell);
                    tbody.appendChild(commentReviewButtonRow);
                    commentButton.classList.add('btn', 'btn-warning', 'text-dark', 'btn-link', 'mt-3');

                    const getcommentReviewButtonRow = document.createElement('tr');
                    const getcommentReviewButtonCell = document.createElement('td');
                    const getcommentButton = document.createElement('button');
                    getcommentButton.id = 'get-review-id'
                    getcommentButton.textContent = 'Comentarios';
                    getcommentButton.addEventListener('click', () => {
                        localStorage.setItem('reviewId', review.id);
                        window.location.href = '/getAllReviewsComments';
                    });
                    getcommentReviewButtonCell.appendChild(getcommentButton);
                    getcommentReviewButtonRow.appendChild(getcommentReviewButtonCell);
                    tbody.appendChild(getcommentReviewButtonRow);

                    table.appendChild(tbody);
                    getcommentButton.classList.add('btn', 'btn-warning', 'text-dark', 'btn-link', 'mt-3');
                    reviewsContainer.appendChild(table);
                    
                });
            }
        } catch (error) {
            console.error('Erro ao buscar revisões do usuário:', error);
        }
    });