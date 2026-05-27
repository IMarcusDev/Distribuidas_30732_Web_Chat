const socket = io();

const chatForm = document.getElementById('chat-form'); // corregido de: form
const messageInput = document.getElementById('message-input'); // corregido de: input
const messagesList = document.getElementById('messages'); // corregido de: messages

function getCookieValueByName(cookieName) { // corregido de: getCookie(name)
    const cookieString = `; ${document.cookie}`; // corregido de: value
    const cookieParts = cookieString.split(`; ${cookieName}=`); // corregido de: parts
    if (cookieParts.length === 2) return decodeURIComponent(cookieParts.pop().split(';').shift());
    return null;
}

const currentUsername = getCookieValueByName('username') || 'Anónimo'; // corregido de: myUsername

chatForm.addEventListener('submit', (submitEvent) => { // corregido de: e
    submitEvent.preventDefault();
    const messageText = messageInput.value.trim(); // corregido de: text
    if (messageText) {
        socket.emit('chat message', { text: messageText });
        messageInput.value = '';
    }
});

const typingIndicator = document.getElementById('typing-indicator');
let clearTypingIndicatorTimeoutId; // corregido de: typingTimeout

messageInput.addEventListener('input', () => {
    socket.emit('typing', { isTyping: messageInput.value.trim().length > 0 });
});

socket.on('typing', ({ isTyping, username }) => {
    clearTimeout(clearTypingIndicatorTimeoutId);
    if (isTyping) {
        typingIndicator.textContent = `${username} está escribiendo...`;
        clearTypingIndicatorTimeoutId = setTimeout(() => { typingIndicator.textContent = ''; }, 3000);
    } else {
        typingIndicator.textContent = '';
    }
});

socket.on('chat message', ({ text, username, avatar, time }) => {
    const messageItem = document.createElement('li'); // corregido de: li
    messageItem.classList.add('chat-item');

    if (username === currentUsername) messageItem.classList.add('mine');

    const avatarImage = document.createElement('img'); // corregido de: img
    avatarImage.src = avatar;
    avatarImage.alt = `Foto de ${username}`;
    avatarImage.classList.add('chat-avatar');

    const messageContent = document.createElement('div'); // corregido de: contenido
    messageContent.classList.add('chat-content');

    const usernameSpan = document.createElement('span'); // corregido de: nombreSpan
    usernameSpan.classList.add('chat-username');
    usernameSpan.textContent = username;

    const messageTextParagraph = document.createElement('p'); // corregido de: textoP
    messageTextParagraph.classList.add('chat-text');
    messageTextParagraph.textContent = text;

    messageContent.appendChild(usernameSpan);
    messageContent.appendChild(messageTextParagraph);

    const messageTimeContainer = document.createElement('div'); // corregido de: horaMensaje
    messageTimeContainer.classList.add('chat-date');
    const messageTimeSpan = document.createElement('span'); // corregido de: hora
    messageTimeSpan.classList.add('chat-time');

    messageTimeSpan.textContent = new Date(time).toLocaleTimeString();
    messageTimeContainer.appendChild(messageTimeSpan);

    messageItem.appendChild(avatarImage);
    messageItem.appendChild(messageContent);
    messageItem.appendChild(messageTimeContainer);

    messagesList.appendChild(messageItem);
    messagesList.scrollTop = messagesList.scrollHeight;
});
