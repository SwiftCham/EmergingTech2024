//ELIZA CHATBOT

document.addEventListener("DOMContentLoaded", () => {
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");
    
    sendButton.addEventListener("click", () => {
        const input = userInput.value.trim();
        if (input === "") return;
        // Clears the input field so the user can type a new message
        userInput.value = "";
    });
});
