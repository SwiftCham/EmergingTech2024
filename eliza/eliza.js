//ELIZA CHATBOT

document.addEventListener("DOMContentLoaded", () => {
    const chatHistory = document.getElementById("chat-history");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");

    // Function to get ELIZA's response
    function getElizaResponse(input) {
        const reflectedInput = reflect(input); // Reflect user input
        for (const entry of elizaResponses) {
            const match = reflectedInput.match(entry.pattern); // Check if the reflected input matches a pattern
            if (match) {
                return entry.response.replace("$1", match[1] || ""); // Replace $1 with the first matched group
            }
        }
        return "I didn't quite understand that."; // Default response if no match is found
    }

    // Function to update chat history
    function updateChatHistory(sender, message, typing = false) {
        const messageWrapper = document.createElement("div");
        messageWrapper.classList.add(sender === "user" ? "user-message-wrapper" : "eliza-message-wrapper"); // Add a class to the message wrapper based on the sender

        const senderName = document.createElement("span"); // Adds sender's name to the message
        senderName.classList.add("sender-name");
        senderName.textContent = sender === "user" ? "You" : "ELIZA";
        messageWrapper.appendChild(senderName);
        const messageElement = document.createElement("div");  // Adds the message bubble to the message wrapper
        messageElement.classList.add(sender === "user" ? "user-message" : "eliza-message"); // Sets the message bubble class based on the sender

        // If typing indicator is active, shows "ELIZA is typing..."
        if (typing) {
            messageElement.textContent = "ELIZA is typing...";
            messageElement.classList.add("typing-indicator");
        } else {
            messageElement.textContent = message; // Sets the response text content based on the sender
        }

        messageWrapper.appendChild(messageElement); // Attaches the message bubble to the message wrapper
        chatHistory.appendChild(messageWrapper); // Attaches the message wrapper to the chat history
        chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll to the bottom
        return messageWrapper; // Return the wrapper for removal if needed
    }


    // Adds a delay to ELIZA's response
    function respondWithDelay(input) {
        const response = getElizaResponse(input);

        // Add a 0.8-second delay before showing the typing indicator
        setTimeout(() => {
            const typingIndicator = updateChatHistory("eliza", "", true); // Adds "ELIZA is typing..." message to chat history
            const responseDelay = Math.random() * 1700 + 800; // Genereates a random delay between 0.8 and 2.5 seconds
            setTimeout(() => {
                // Remove the typing indicator
                typingIndicator.remove();
                // Update chat history with ELIZA's response
                updateChatHistory("eliza", response);
            }, responseDelay);
        }, 800);
    }

    // Function to reflect user input
    function reflect(input) {
        return input
            .split(/\b/) // Split input into words and boundaries
            .map(word => reflections[word.toLowerCase()] || word) // Replace words using reflections map
            .join(""); // Rejoin the reflected input
    }




    sendButton.addEventListener("click", () => {
        const input = userInput.value.trim();
        if (input === "") return;

        // Update chat history with user input
        updateChatHistory("user", input);

        // Clears the input field so the user can type a new message
        userInput.value = "";

        // Gets ELIZA's response and updates the chat history after a delay
        respondWithDelay(input);
    });


    // Array of possible matched patterns and responses for ELIZA
    const elizaResponses = [
        { pattern: /hello|hi/i, response: "Hello! How can I help you today?" },
        { pattern: /how are you/i, response: "I'm just a program, but I'm doing well. How about you?" },
        { pattern: /i feel (.*)/i, response: "Why do you feel $1?" },
        { pattern: /why (.*)/i, response: "Why do you think $1?" },
        { pattern: /no/i, response: "Why not?" },
        { pattern: /yes/i, response: "Why do you think so?" },
        { pattern: /what is your name/i, response: "I am ELIZA. What's your name?" },
        { pattern: /i need (.*)/i, response: "Why do you need $1?" },
        { pattern: /i want (.*)/i, response: "Why do you want $1?" },
        { pattern: /i am (.*)/i, response: "How long have you been $1?" },
        { pattern: /are you (.*)/i, response: "Why does it matter if I am $1?" },
        { pattern: /can you (.*)/i, response: "What makes you think I can $1?" },
        { pattern: /do you (.*)/i, response: "Why do you want to know if I $1?" },
        { pattern: /because (.*)/i, response: "Is that the real reason?" },
        { pattern: /sorry/i, response: "No need to apologize." },
        { pattern: /thank you/i, response: "You're welcome!" },
        { pattern: /.*/, response: "Hmm... Tell me more about that." } // Default response
    ];

    // Reflection map for swapping pronouns
    const reflections = {
        "am": "are",
        "was": "were",
        "i": "you",
        "i'd": "you'd",
        "i've": "you've",
        "i'll": "you'll",
        "my": "your",
        "you": "me",
        "you'd": "I'd",
        "you've": "I've",
        "you'll": "I'll",
        "your": "my",
        "yours": "mine",
        "myself": "yourself",
        "yourself": "myself",
        "me": "you"
    };
});
