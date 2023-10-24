const token = localStorage.getItem('token')

document.addEventListener('DOMContentLoaded', async () => {
    const resultContainer = document.querySelector('#results');
    const form = document.querySelector('#search-form');
    const input = document.querySelector('#search-input');

    form.addEventListener('submit', async (event) => {
        const query = input.value.trim();
        event.preventDefault();
        try {
            const detailsResponse = await fetch(`/api/profile/userProfile?userProfile=${encodeURIComponent(query)}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const profileData = await detailsResponse.json();
            const resultProfile = document.createElement('div');
            resultProfile.innerHTML = `
            <div class="profile-container">
            <div class="profile-details">
            <br>
            <div class="ul-profile">
            <img class="profile-image" src="${profileData.body.profile.icon ? profileData.body.profile.icon : 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.webp'}" alt="Ícone do perfil do usuário"/>
                <h1 class="profile-name">${profileData.body.profile.givenname} ${profileData.body.profile.familyname}</h1> 
                <p class="profile-bio">@${profileData.body.profile.userprofile}</p>
                <p class="profile-bio">${profileData.body.profile.bio}</p>

                </div>
                <div class="profile-info">
                <br>
                    
                <ul class="list-group ul-profile">
                <ul>

                <li class="list-group-item li-profile">
                <strong><i class="fas fa-map-marker-alt"></i> </strong>${profileData.body.profile.country}, ${profileData.body.profile.city}
                </li>
                
                <li class="list-group-item li-profile">
                <strong><i class="fas fa-calendar-alt"></i></strong> ${profileData.body.profile.birthday}
                </li>

                <li class="list-group-item li-profile">
                <i class="fab fa-twitter"></i> <strong><a href="https://www.twitter.com/${profileData.body.profile.socialmediax}">${profileData.body.profile.socialmediax}</a></strong>
                 </li>
 
                <li class="list-group-item li-profile">
                <i class="fab fa-instagram"></i> <strong><a href="https://www.instagram.com/${profileData.body.profile.socialmediainstagram}">${profileData.body.profile.socialmediainstagram}</a></strong>
                </li>

                <li class="list-group-item li-profile">
                <i class="fab fa-tiktok"></i> <strong><a href="https://www.tiktok.com/@${profileData.body.profile.socialmediatiktok}">${profileData.body.profile.socialmediatiktok}</a></strong>
                </li><br>
                </ul> <hr>

                <ul id="filmes-favoritos"></ul><hr><br>

                <a href="/getAllUserReviews" id="review-link" class="btn btn-primary text-warning btn-link profile-stat">
                Reviews: 
                <span class="stat-count">${profileData.body.profile.contadorreviews !== null ? profileData.body.profile.contadorreviews : 0}
                </span>
                </a>
                <canvas id="myChart"></canvas><br>
            </ul>
            <hr class="hr-bottom">
            <div class="text-center">
                    <a href="/getAllUserLists" id="list-link" class="btn btn-primary text-warning btn-link profile-stat"><i class="fas fa-list-ul"></i> <span class="stat-count">${profileData.body.profile.contadorlists !== null ? profileData.body.profile.contadorlists : 0}</span>
                    </a>
                    <a id="get-user-watchlist" href="/getUserWatchlist" class="btn btn-primary text-warning btn-link profile-stat"><i class="fa-solid fa-clock"></i> <span class="stat-count">${profileData.body.watchlistCount.movies_count !== null ? profileData.body.watchlistCount.movies_count : 0}</span>
                    </a>
                    <a href="/" class="back-link d-block mt-4 text-center">
                    <i class="fa-solid fa-house" style="color: #000000; font-size: 30px;"></i>
                    </div>
            </div>
                </div>
            </div>
            `;

            resultContainer.addEventListener('click', (event) => {
                if (event.target.id === 'list-link') {
                    if (profileData.body.profile.userprofile) {
                        localStorage.setItem('userprofile', profileData.body.profile.userprofile);
                    }
                }
                else if (event.target.id === 'review-link') {
                    if (profileData.body.profile.userprofile) {
                        localStorage.setItem('userprofile', profileData.body.profile.userprofile);
                    }
                }
            });
            resultContainer.innerHTML = '';
            resultContainer.appendChild(resultProfile);

            // mostrar filmes favoritos
            const filmsContainer = document.createElement('div');
            filmsContainer.classList.add('films-container');
            for (const movieTitle of profileData.body.profile.movies) {
                try {
                    const movieResponse = await fetch(`/api/movie/title?title=${encodeURIComponent(movieTitle)}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (movieResponse.ok) {
                        const movieData = await movieResponse.json();

                        const movieContainer = document.createElement('div');
                        movieContainer.classList.add('movie-container');

                        const movieLink = document.createElement('a');
                        movieLink.href = '/getMovieByTitle';

                        const posterImage = document.createElement('img');
                        posterImage.src = movieData.body.movieData.Poster;
                        posterImage.alt = 'Poster do Filme';
                        posterImage.classList.add('movie-poster');

                        movieLink.addEventListener('click', function () {
                            localStorage.setItem('movieimbdId', movieData.body.movieData.imdbID);
                        });

                        movieLink.appendChild(posterImage);
                        movieContainer.appendChild(movieLink);
                        filmsContainer.appendChild(movieContainer);
                    } else {
                        console.error('Erro ao obter detalhes do filme:', movieResponse.statusText);
                    }
                } catch (error) {
                    console.error('Erro ao buscar detalhes do filme:', error);
                }
            }
            const favoritesSection = document.querySelector('#filmes-favoritos');
            favoritesSection.appendChild(filmsContainer);

            // mostrar watchlist
            const watchlistSection = document.querySelector('#get-user-watchlist');
            watchlistSection.addEventListener('click', (event) => {
                localStorage.setItem('userprofile', profileData.body.profile.userprofile);
            });

            // Rating count
            const ratingCountResponse = await fetch(`api/rating/id?userProfile=${encodeURIComponent(profileData.body.profile.userprofile)}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const ratingData = await ratingCountResponse.json();

            let ratings = {
                '5': 0,
                '4': 0,
                '3': 0,
                '2': 0,
                '1': 0
            };

            for (const rating of ratingData.rating) {
                ratings[rating.rating.toString()] = rating.count;
            }

            const starLabels = {
                '5': '★★★★★',
                '4': '★★★★☆',
                '3': '★★★☆☆',
                '2': '★★☆☆☆',
                '1': '★☆☆☆☆'
            };

            let chartData = {
                type: 'bar',
                data: {
                    labels: Object.keys(ratings).map(rating => starLabels[rating]),
                    datasets: [{
                        label: 'REVIEWS',
                        data: Object.values(ratings),
                        backgroundColor: 'rgb(10, 25, 49)',
                        borderColor: 'rgba(0, 0, 0, 0.8)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(0, 0, 0, 0.9)',
                        hoverBorderColor: 'rgb(0,0,0)'
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            display: false,
                            grid: {
                                display: false,
                            },
                            ticks: {
                                callback: function (value, index, values) {
                                    return '';
                                }
                            }
                        },
                        x: {
                            display: false,
                            grid: {
                                display: false,
                            },
                            barPercentage: .1,
                            categoryPercentage: .1,
                        },
                        x2: {
                            display: true,
                            position: 'bottom',
                            labels: Object.keys(ratings).map(rating => starLabels[rating]),
                            grid: {
                                display: false,
                            },
                            ticks: {
                                autoSkip: false
                            }
                        }
                    },
                    plugins: {
                        datalabels: {
                            color: '#fff',
                            align: 'end',
                            formatter: function (value, context) {
                                const index = context.dataIndex;
                                const starCount = Object.keys(starLabels)[index];
                                return starCount + ' (' + value + ')';
                            }
                        }
                    },
                    legend: {
                        display: true,
                    },
                    animation: {
                        duration: 1000,
                        easing: 'easeOutBounce'
                    },
                    layout: {
                        padding: {
                            left: 10,
                            right: 10,
                            top: 10,
                            bottom: 10
                        }
                    },
                    tooltips: {
                        enabled: false,
                    },
                    shadow: {
                        enabled: true,
                        color: 'rgba(0, 0, 0, 0.2)',
                        blur: 10,
                        offsetY: 5,
                        offsetX: 5,
                    }
                }
            };


            var ctx = document.getElementById('myChart');
            new Chart(ctx, chartData);




        } catch (error) {
            console.log(error);
        }
    });
});
