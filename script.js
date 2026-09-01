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

async function sendOrderToBackend() {
    const endpointURL = "https://hook.us2.make.com/0nti4xn37xfgojkwdqmohf1jv3tx1m4p";

    try {
        const response = await fetch(endpointURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                Name: orderData.name,
                Quantity: orderData.quantity.toLowerCase().includes('dozen')
                    ? orderData.quantity
                    : `${orderData.quantity} dozen`,
                Address: orderData.address,
                _subject: "New Egg Order - The Daily Nest"
            })
        });

        if (response.ok) {
            return true;
        } else {
            console.error("Submission error:", response.statusText);
            return false;
        }
    } catch (error) {
        console.error("Network error:", error);
        return false;
    }
}

async function completeOrder() {
    appendMessage("Submitting your order to out team...", 'bot-message');

    const isSuccess = await sendOrderToBackend();

    setTimeout(() => {
        if (isSuccess) {
            appendMessage(
                `🎉 Order Received, ${orderData.name}!\n\n` +
                `• Quantity: ${orderData.quantity} dozen\n` +
                `• Delivery Address: ${orderData.address}\n\n` +
                `We have logged your order and will contact you directly to confirm delivery. Thank you for choosing The Daily Nest!`, 
                'bot-message'
            );
        } else {
            appendMessage(
                "Oops! We had trouble submitting your order automatically. Please try submitting again or reach out to us directly.",
                'bot-message'
            );
        }
    }, 600);
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
    
       