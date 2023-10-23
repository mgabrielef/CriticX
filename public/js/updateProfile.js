document.addEventListener('DOMContentLoaded', async () => {
    const actualName = localStorage.getItem('ProfileName');
    const NameElement = document.getElementById('name');
    NameElement.value = actualName;

    const actualfamilyname = localStorage.getItem('familyname');
    const familynameElement = document.getElementById('familyName');
    familynameElement.value = actualfamilyname;

    const actualBio = localStorage.getItem('bio');
    const bioElement = document.getElementById('bio');
    bioElement.value = actualBio;

    const actualbirthday = localStorage.getItem('birthday');
    const birthdayElement = document.getElementById('birthday');

    const parts = actualbirthday.split('/');
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    birthdayElement.value = formattedDate;

    const actualsocialmediainstagram = localStorage.getItem('socialmediainstagram');
    const socialmediainstagramElement = document.getElementById('socialmediaInstagram');
    socialmediainstagramElement.value = actualsocialmediainstagram;

    const actualsocialmediatiktok = localStorage.getItem('socialmediatiktok');
    const socialmediatiktokElement = document.getElementById('socialmediaTikTok');
    socialmediatiktokElement.value = actualsocialmediatiktok;

    const actualsocialmediax = localStorage.getItem('socialmediax');
    const actualsocialmediaxElement = document.getElementById('socialmediax');
    actualsocialmediaxElement.value = actualsocialmediax;

    const actualuserprofile = localStorage.getItem('userprofile');
    const userprofileElement = document.getElementById('user');
    userprofileElement.value = actualuserprofile;
})

const catImages = document.querySelectorAll('.cat-image');
const selectedCatInput = document.getElementById('selectedCat');

catImages.forEach(catImage => {
    catImage.addEventListener('click', function () {
        selectedCatInput.value = this.id;
        catImages.forEach(image => {
            image.style.border = 'none';
        });
        this.style.border = '3px solid black';
    });


});

const updateProfileForm = document.getElementById('update-profile-form');
updateProfileForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');

    const givenName = document.getElementById('name').value;
    const familyName = document.getElementById('familyName').value;
    const bio = document.getElementById('bio').value;
    const birthday = document.getElementById('birthday').value;
    const socialMediaX = document.getElementById('socialmediax').value;
    const socialmediaInstagram = document.getElementById('socialmediaInstagram').value;
    const socialMediaTikTok = document.getElementById('socialmediaTikTok').value;
    const userProfileTag = document.getElementById('user').value;
    const selectedCatUrl = document.getElementById(selectedCatInput.value).src;

    const isValidDate = isValidDateOfBirth(birthday);

    if (!isValidDate) {
        alert('Por favor, insira uma data de nascimento válida.');
        return;
    }

    const response = await fetch(`/api/user/profile`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name: givenName,
            familyName,
            bio,
            birthday,
            socialMediaX,
            socialmediaInstagram,
            socialMediaTikTok,
            userProfileTag,
            icon: selectedCatUrl
        })
    });
    const data = await response.json();
    if (response.ok) {
        alert(`Perfil Atualizado com sucesso!`);
        window.location.href = '/profile';
    } else {
        alert(data.message);
    }
});

function isValidDateOfBirth(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;

    const parts = dateString.split("-");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const currentDate = new Date();
    const inputDate = new Date(year, month, day);

    return inputDate.getFullYear() === year && inputDate.getMonth() === month && inputDate.getDate() === day && inputDate < currentDate;
}