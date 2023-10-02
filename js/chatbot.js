const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; 
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class=""><img src="images/Wordwave Logo Icon Final.png" alt="" width="50px"></span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; 
}

const generateResponse = (chatElement) => {
  
    const Message = chatElement.querySelector("p").textContent;

    const apiUrl ="https://chat.wordwave.in/Chat/?query=" + userMessage;

    
    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
        
            if (data && data.answer) {
            
                const incomingChatLi = createChatLi(data.answer, "incoming");
                chatbox.appendChild(incomingChatLi);
                chatbox.scrollTo(0, chatbox.scrollHeight);
            } else {
            
                console.error("No answer found in the JSON response.");
            }
        })
        .catch((error) => {
            
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
        chatbox.removeChild(incomingChatLi);
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






