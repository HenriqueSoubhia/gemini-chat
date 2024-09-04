import { GoogleGenerativeAI } from "@google/generative-ai"

const chatContainer = document.querySelector<HTMLUListElement>("#chatContainer")
const form = document.querySelector<HTMLFormElement>("#form")
const textbox = document.querySelector<HTMLInputElement>("#textbox")

const API_KEY = "AIzaSyBVt9QKnUJqTNBw28z5-5wzZwx0-e7w_pE"

interface History {
    role: "model" | "user"
    parts: Array<{ text: string }>
}

const history: Array<History> = [
    // {
    //     "role": "user",
    //     "parts": [
    //         {
    //             "text": "oi chat"
    //         }
    //     ]
    // },
    // {
    //     "parts": [
    //         {
    //             "text": "Oi! Como posso te ajudar hoje? \n"
    //         }
    //     ],
    //     "role": "model"
    // }
]

const getModel = async () => {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({ history });
    return chat
}

const sendMessage = async (message: string) => {

    const chat = await getModel()
    await chat.sendMessage(message);
    // let result = await chat.sendMessage(message);

    // history.push({ role: "user", parts: [{ text: message }] })
    // history.push({ role: "model", parts: [{ text: result.response.text() }] })

    updateChat()
}

const updateChat = async (newChat?: string) => {
    if (chatContainer) {

        chatContainer.innerHTML = ""

        history.forEach(msg => {
            const li = document.createElement("li")
            li.innerHTML = msg.parts[0].text
            li.classList.add(`role-${msg.role}`)
            chatContainer.appendChild(li)
        });


        if (newChat) {
            chatContainer.innerHTML += `<li class="role-user" >${newChat}</li>`
        }
    }

}


if (form && textbox) {
    form.addEventListener("submit", (e) => {
        e.preventDefault()
        if (textbox.value) {
            sendMessage(textbox.value)
            updateChat(textbox.value)
            textbox.value = ""
        }
    })
}

updateChat()


