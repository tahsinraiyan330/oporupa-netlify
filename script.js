document.addEventListener('DOMContentLoaded', function() {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    
    // Focus on input field
    userInput.focus();
    
    // Function to add message to chat
    function addMessage(text, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
        messageDiv.textContent = text;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    
    // Function to show loading indicator
    function showLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.classList.add('message', 'bot-message');
        loadingDiv.id = 'loading-message';
        loadingDiv.innerHTML = '<span class="loading"></span> Thinking...';
        chatBox.appendChild(loadingDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    
    // Function to hide loading indicator
    function hideLoading() {
        const loadingDiv = document.getElementById('loading-message');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }
    
    // Function to send message to our Netlify function
    async function sendToOporupa(message) {
        showLoading();
        
        try {
            const response = await fetch('/.netlify/functions/oporupa-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            return data.response;
            
        } catch (error) {
            console.error('Error:', error);
            return "I'm sorry, I'm experiencing technical difficulties at the moment. Please try again later.";
        } finally {
            hideLoading();
        }
    }
    
    // Event listener for send button
    sendBtn.addEventListener('click', async function() {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, true);
            userInput.value = '';
            
            const response = await sendToOporupa(message);
            addMessage(response, false);
        }
    });
    
    // Event listener for Enter key
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });
});
