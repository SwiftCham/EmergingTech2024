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


    sendButton.addEventListener("click", () => {
        const input = userInput.value.trim();
        if (input === "") return;

        // Update chat history with user input
        updateChatHistory("user", input);

        // Gets ELIZA's response and update chat history
        const response = getElizaResponse(input);
        updateChatHistory("eliza", response);

        // Clears the input field so the user can type a new message
        userInput.value = "";
    });


    // Array of possible matched patterns and responses for ELIZA
    const elizaResponses = [
        { pattern: /hello|hi/i, response: "Hello! How can I help you today?" },
        { pattern: /.*/, response: "Hmm... Tell me more about that." } // Default response
    ];

});
