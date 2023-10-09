const registerForm = document.getElementById('register-form');
registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const familyName = document.getElementById('familyName').value;
  const bio = document.getElementById('bio').value;
  const city = document.getElementById('city').value;
  const country = document.getElementById('country').value;
  const birthday = document.getElementById('birthday').value;
  const socialMediaX = document.getElementById('socialmediax').value;
  const socialmediaInstagram = document.getElementById('socialmediaInstagram').value;
  const socialMediaTikTok = document.getElementById('socialmediaTikTok').value;
  const userProfileTag = document.getElementById('user').value;


  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const response = await fetch('api/user/profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ name, familyName, bio, city, country, birthday, socialMediaX, socialmediaInstagram, socialMediaTikTok, userProfileTag })
  });
  const data = await response.json();
  console.log(response);
  if (response.ok) {
    alert(`Usuário ${username} criado com sucesso!`);

    const watchlistResponse = await fetch('api/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Watchlist',
        description: 'Lista de filmes para assistir',
        movieTitles: [],
        isPublic: true,
      })
    });

    const favoriteMovieResponse = await fetch('/api/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Meus filmes favoritos',
        description: 'Os melhores!',
        movieTitles: [],
        isPublic: true,
      }),
    });

    if (watchlistResponse.ok && favoriteMovieResponse.ok) {
      window.location.href = '/profile';
    }
  } else {
    alert(data.message);
  }
});
