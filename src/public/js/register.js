const registerForm = document.querySelector('#register-form'); // corregido de: form

registerForm.addEventListener('submit', async (submitEvent) => { // corregido de: e
    submitEvent.preventDefault();

    const username = document.querySelector('#username').value.trim();
    const profileImageInput = document.querySelector('#profile'); // corregido de: fileInput
    const profileImageFile = profileImageInput.files[0]; // corregido de: file

    if (!username) {
        alert('Por favor ingresa un nombre de usuario');
        return;
    }
    if (!profileImageFile) {
        alert('Por favor selecciona una foto de perfil');
        return;
    }

    const registerFormData = new FormData(); // corregido de: formData
    registerFormData.append('username', username);
    registerFormData.append('profile', profileImageFile);

    const registerResponse = await fetch('/register', { method: 'POST', body: registerFormData }); // corregido de: res

    if (registerResponse.ok) {
        document.location.href = '/chat';
    } else {
        alert('Error al registrarse, intenta de nuevo');
    }
});
