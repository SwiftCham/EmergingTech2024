//ELIZA CHATBOT

document.addEventListener("DOMContentLoaded", () => {
    const chatHistory = document.getElementById("chat-history");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");

    // Function to get ELIZA's response
    function getElizaResponse(input) {
        for (const entry of elizaResponses) {
            const match = input.match(entry.pattern); // Checks if the input matches with provided array of patterns
            if (match) {
                return entry.response.replace("$1", match[1] || ""); // Replaces $1 in the user text with the first match from the array
            }
        }
        return "I didn't quite understand that."; // Default response if no match is found
    }

    // Function to update chat history
    function updateChatHistory(sender, message) {
        const messageElement = document.createElement("div");
        messageElement.classList.add(sender === "user" ? "user-message" : "eliza-message"); // Adds a class to the message element based on the sender
        messageElement.textContent = `${sender === "user" ? "You" : "ELIZA"}: ${message}`; // Sets the response text content based on the sender
        chatHistory.appendChild(messageElement); // Attaches the most recent message to the chat history
        chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll to the bottom
    }

    // Adds a delay to ELIZA's response
    function respondWithDelay(input) {
        const response = getElizaResponse(input);
        const delay = Math.random() * 1700 + 800; // Generates a random delay between 0.8 and 2.5 seconds
        setTimeout(() => { 
            updateChatHistory("eliza", response); // Updates chat history with ELIZA's response
        }, delay);
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
        { pattern: /.*/, response: "Hmm... Tell me more about that." } // Default response
    ];

});
