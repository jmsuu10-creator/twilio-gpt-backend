import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Health check
app.get("/", (req, res) => {
res.send("Twilio GPT Backend is running 🚀");
});

// WhatsApp inbound
app.post("/message", async (req, res) => {
try {
const incomingMsg = req.body.Body || "Hola";

const gptResponse = await fetch(
"https://api.openai.com/v1/chat/completions",
{
method: "POST",
headers: {
"Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
"Content-Type": "application/json",
},
body: JSON.stringify({
model: "gpt-4o-mini",
messages: [
{
role: "system",
content:
"Eres un asistente profesional para una compañía de remodelación. Responde claro, amable y profesional.",
},
{
role: "user",
content: incomingMsg,
},
],
}),
}
);

const data = await gptResponse.json();

const reply =
data?.choices?.[0]?.message?.content ||
"Gracias por tu mensaje. En breve te atendemos.";

res.set("Content-Type", "text/xml");
res.send(`
<Response>
<Message>${reply}</Message>
</Response>
`);
} catch (error) {
console.error(error);
res.set("Content-Type", "text/xml");
res.send(`
<Response>
<Message>Ocurrió un error. Intenta nuevamente.</Message>
</Response>
`);
}
});

app.listen(PORT, () => {
console.log("Server running on port", PORT);
});
