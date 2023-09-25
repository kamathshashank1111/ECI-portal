const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; 
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; 
}

const generateResponse = (chatElement) => {
    // Get the user message from the chatElement
    const Message = chatElement.querySelector("p").textContent;

    // Construct the URL with the user's message
    const apiUrl ="https://chat.wordwave.in/Chat/?query=" + userMessage;

    // Fetch data from the API
    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            // Check if the JSON response contains an "answer" attribute
            if (data && data.answer) {
                // Create an incoming chat element with the answer
                const incomingChatLi = createChatLi(data.answer, "incoming");
                chatbox.appendChild(incomingChatLi);
                chatbox.scrollTo(0, chatbox.scrollHeight);
            } else {
                // Handle the case where there is no answer in the response
                console.error("No answer found in the JSON response.");
            }
        })
        .catch((error) => {
            // Handle errors from the fetch or JSON parsing
            console.error("Error fetching or parsing data:", error);
            const errorChatLi = createChatLi("An error occurred while fetching data.", "incoming");
    chatbox.appendChild(errorChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
        });
}


const handleChat = () => {
    userMessage = chatInput.value.trim(); 
    if(!userMessage) return;

    
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;


    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {

    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));











// const API_URL = "https://api.openai.com/v1/chat/completions";
//     const messageElement = chatElement.querySelector("p");

    
//     const requestOptions = {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${API_KEY}`
//         },
//         body: JSON.stringify({
//             model: "gpt-3.5-turbo",
//             messages: [{role: "user", content: userMessage}],
//         })
//     }
    

    
//     fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
//         messageElement.textContent = data.choices[0].message.content.trim();
//     }).catch(() => {
//         messageElement.classList.add("error");
//         messageElement.textContent = "Oops! Something went wrong. Please try again.";
//     }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));