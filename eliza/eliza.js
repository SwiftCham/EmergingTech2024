//ELIZA CHATBOT

document.addEventListener("DOMContentLoaded", () => {
    const chatHistory = document.getElementById("chat-history");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");

    // Function to get ELIZA's response
    function getElizaResponse(input) {
        if (!isCoherentEnglish(input)) { // Uses the isCoherentEnglish function to check if the input is coherent English
            return "What you typed doesn't seem like English, try again";
        }
        const normalizedInput = input.trim().toLowerCase(); // trim and lowercase the input
        const reflectedInput = reflect(normalizedInput); // Reflect user input
        for (const entry of elizaResponses) {
            const originalMatch = normalizedInput.match(entry.pattern);
            const reflectedMatch = reflectedInput.match(entry.pattern);

            const match = originalMatch || reflectedMatch; // Check if the reflected input matches a pattern
            if (match) {
                // If the response should meet the conditions for a multi-response, randomly select one
                const response = Array.isArray(entry.response)
                    ? entry.response[Math.floor(Math.random() * entry.response.length)]
                    : entry.response;
                return response.replace(/\$(\d+)/g, (_, index) => match[index] || ""); // Replace $1, $2, etc. with the matched groups
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

    function isCoherentEnglish(input) {
        if (!input || input.length < 2) return false;
        // Remove spaces and special characters
        const cleanInput = input.replace(/[^a-zA-Z]/g, '');
        if (cleanInput.length === 0) return false; // If the input is empty after cleaning, return false
        // Check for repeated characters
        if (/(.)\1{2,}/.test(cleanInput)) return false;
        // Check for consonant clusters 
        if (/[bcdfghjklmnpqrstvwxz]{5,}/.test(cleanInput.toLowerCase())) return false;
    
        // Calculates consonant to vowel ratio 
        const vowels = cleanInput.toLowerCase().match(/[aeiou]/g) || [];
        const consonants = cleanInput.toLowerCase().match(/[bcdfghjklmnpqrstvwxz]/g) || [];
        
        // If there are no vowels, or the ratio of consonants to vowels is too high, returns false
        if (vowels.length === 0 || (consonants.length / vowels.length > 5)) return false;
    
        return true;
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
        {
        pattern: /\b(hello|hi)\b/i,
        response: [
            "Hello! How can I help you today?",
            "Hi there! What's on your mind?",
            "Hello! I'm here to chat with you.",
            "Greetings! How are you feeling today?"
        ]
    },
    {
        pattern: /how are (you|me)( today)?/i,  
        response: [
            "I'm just a program, but I'm doing well. How about you?",
            "I'm here and ready to listen. How are you feeling?",
            "Thanks for asking! I'm functioning well. How's your day going?",
            "I'm operating as intended. How are you doing?"
        ]
    },
    {
        pattern: /(i|you) feel (.*)/i,  
        response: [
            "Why do you feel $2?",
            "What makes you feel $2?",
            "How long have you been feeling $2?",
            "Tell me more about feeling $2"
        ]
    },
    {
        pattern: /why (am i|are you) (.*)/i,  
        response: [
            "Why do you think you are $2?",
            "What makes you feel you are $2?",
            "Have you always felt you were $2?",
            "Tell me more about being $2"
        ]
    },
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
    { pattern: /i can't (.*)/i, response: "What makes you think you can't $1?" },
    { pattern: /i don't (.*)/i, response: "Why don't you $1?" },
    { pattern: /i love (.*)/i, response: "What do you love about $1?" },
    { pattern: /i hate (.*)/i, response: "Why do you hate $1?" },
    { pattern: /i'm not (.*)/i, response: "Why do you think you're not $1?" },
    { pattern: /i'm (.*)/i, response: "How does being $1 make you feel?" },
    { pattern: /i think (.*)/i, response: "Why do you think $1?" },
    { pattern: /i believe (.*)/i, response: "What makes you believe $1?" },
    { pattern: /i hope (.*)/i, response: "Why do you hope $1?" },
    { pattern: /i wish (.*)/i, response: "Why do you wish $1?" },
    { pattern: /i'm afraid (.*)/i, response: "What makes you afraid of $1?" },
    { pattern: /i'm worried (.*)/i, response: "Why are you worried about $1?" },
    { pattern: /i'm happy (.*)/i, response: "What makes you happy about $1?" },
    { pattern: /i'm sad (.*)/i, response: "Why does $1 make you sad?" },
    { pattern: /i'm tired/i, response: "Why do you feel tired?" },
    { pattern: /i'm excited/i, response: "What are you excited about?" },
    { pattern: /i'm bored/i, response: "Why do you feel bored?" },
    { pattern: /i'm stressed/i, response: "What is causing your stress?" },
    { pattern: /i'm confused/i, response: "What is confusing you?" },
    { pattern: /i'm anxious/i, response: "What is making you anxious?" },
    { pattern: /i'm frustrated/i, response: "What is frustrating you?" },
    { pattern: /i'm overwhelmed/i, response: "What is overwhelming you?" },
    { pattern: /i'm lonely/i, response: "Why do you feel lonely?" },
    { pattern: /i'm grateful/i, response: "What are you grateful for?" },
    {
        pattern: /.*/,
        response: [
            "Hmm... Tell me more about that.",
            "Could you elaborate on that?",
            "I see. And how does that make you feel?",
            "That's interesting. What else comes to mind?"
        ]
    } // Default response
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
