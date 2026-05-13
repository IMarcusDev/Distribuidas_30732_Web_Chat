const socket = io();

const form = document.getElementById('chat-form');
const input = document.getElementById('message-input');
const messages = document.getElementById('messages');

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
    return null;
}

const myUsername = getCookie('username') || 'Anónimo';

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (text) {
        socket.emit('chat message', { text });
        input.value = '';
    }
});

const typingIndicator = document.getElementById('typing-indicator');
let typingTimeout;

input.addEventListener('input', () => {
    socket.emit('typing', { isTyping: input.value.trim().length > 0 });
});

socket.on('typing', ({ isTyping, username }) => {
    clearTimeout(typingTimeout);
    if (isTyping) {
        typingIndicator.textContent = `${username} está escribiendo...`;
        typingTimeout = setTimeout(() => { typingIndicator.textContent = ''; }, 3000);
    } else {
        typingIndicator.textContent = '';
    }
});

socket.on('chat message', ({ text, username, avatar, time }) => {
    const li = document.createElement('li');
    li.classList.add('chat-item');

    if (username === myUsername) li.classList.add('mine');

    const img = document.createElement('img');
    img.src = avatar;
    img.alt = `Foto de ${username}`;
    img.classList.add('chat-avatar');

    const contenido = document.createElement('div');
    contenido.classList.add('chat-content');

    const nombreSpan = document.createElement('span');
    nombreSpan.classList.add('chat-username');
    nombreSpan.textContent = username;

    const textoP = document.createElement('p');
    textoP.classList.add('chat-text');
    textoP.textContent = text;

    contenido.appendChild(nombreSpan);
    contenido.appendChild(textoP);

    const horaMensaje = document.createElement('div');
    horaMensaje.classList.add('chat-date');
    const hora = document.createElement('span');
    hora.classList.add('chat-time');

    hora.textContent = new Date(time).toLocaleTimeString();
    horaMensaje.appendChild(hora);

    li.appendChild(img);
    li.appendChild(contenido);
    li.appendChild(horaMensaje);

    messages.appendChild(li);
    messages.scrollTop = messages.scrollHeight;
});