let currentStep = 0;

const orderData = {
    name: '',
    quantity: '',
    address: ''
};

const botQuestions = [
    "Hi there! Welcome to The Daily Nest 🥚. What's your name?",
    "Nice to meet you! How many dozen farm fresh eggs would you like to order?",
    "Got it! What is your delivery address?",
    "Thank you! Preparing your order summary now..." 
];

const chatModal = document.getElementById('chat-modal');
const chatBody = document.getElementById('chat-body');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const closeChatBtn = document.getElementById('close-chat');

//Select the main order button
const orderHeroBtn = document.querySelector('.orderBtn button');


function appendMessage(text, className) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', className);
    messageDiv.textContent = text;
    chatBody.appendChild(messageDiv);

    chatBody.scrollTop = chatBody.scrollHeight;
}

function handleSendMessage() {
    const text = userInput.value.trim();
    if (text === '') return;//Ignore empty inputs

    appendMessage(text, 'user-message');
    userInput.value = '';

    if (currentStep === 0) {
        orderData.name = text;
    } else if (currentStep === 1) {
        orderData.quantity = text;
    } else if (currentStep === 2) {
        orderData.address = text;
    } 

    currentStep++;

    setTimeout(() => {
        if (currentStep < 3) {
            appendMessage(botQuestions[currentStep], 'bot-message');
        } else {
            appendMessage(botQuestions[3], 'bot-message');
            completeOrder();
        }
    }, 600); //600ms slight delayfor natural conversational feel
}

function completeOrder() {
    const formattedMessage = `Hi The Daily nest! I'd like to place an order:%0A` + 
    `• Name: ${encodeURIComponent(orderData.name)}%0A` + 
    `• Quantity: ${encodeURIComponent(orderData.quantity)}%0A` + 
    `• Delivery Address: ${encodeURIComponent(orderData.address)}`;

    const phoneNumber = "18768902808";
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${formattedMessage}`;

    setTimeout(() => {
        const actionContainer = document.createElement('div');
        actionContainer.style.textAlign = 'center';
        actionContainer.style.marginTop = '0.5rem';

        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = 'Send Order via WhatsApp 🚀';
        confirmBtn.style.cssText =`
            background-color: #25D366;
            color: white;
            border: none;
            padding: 0.6rem 1rem;
            border-radius: 6px;
            font-weight: bold;
            cursor: pointer;
        `;

        confirmBtn.addEventListener('click', () => {
            window.open(whatsappURL, '_blank');
        });

        chatBody.appendChild(actionContainer);
        actionContainer.appendChild(confirmBtn);
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 1000);
}
    

//Open chat modal when "Order here" is pressed
orderHeroBtn.addEventListener('click', () => {
    chatModal.style.display = 'flex';
    if (chatBody.children.length === 0) {
    appendMessage(botQuestions[0], 'bot-message');
    }
});

closeChatBtn.addEventListener('click', () => {
    chatModal.style.display = 'none';
});

sendBtn.addEventListener('click', handleSendMessage);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
    handleSendMessage();
    }
});
    
       