const form = document.querySelector('#register-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.querySelector('#username').value.trim();
    const fileInput = document.querySelector('#profile');
    const file = fileInput.files[0];

    if (!username) {
        alert('Por favor ingresa un nombre de usuario');
        return;
    }
    if (!file) {
        alert('Por favor selecciona una foto de perfil');
        return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('profile', file);

    const res = await fetch('/register', { method: 'POST', body: formData });

    if (res.ok) {
        document.location.href = '/chat';
    } else {
        alert('Error al registrarse, intenta de nuevo');
    }
});
