import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import twilio from "twilio";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Health check
app.get("/", (req, res) => {
res.send("Twilio GPT Backend is running 🚀");
});

// ===== WHATSAPP INBOUND (GPT) =====
app.post("/message", async (req, res) => {
try {
const incomingMsg = req.body.Body || "";

const gptResponse = await fetch(
"https://api.openai.com/v1/chat/completions",
{
method: "POST",
headers: {
Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
"Content-Type": "application/json",
},
body: JSON.stringify({
model: "gpt-4o-mini",
messages: [
{
role: "system",
content:
"Eres un asistente profesional para una compañía de remodelación. Responde claro, corto y en español.",
},
{ role: "user", content: incomingMsg },
],
temperature: 0.4,
}),
}
);

const data = await gptResponse.json();
const reply =
data?.choices?.[0]?.message?.content ||
"No pude responder en este momento.";

res.set("Content-Type", "text/xml");
res.send(`
<Response>
<Message>${escapeXml(reply)}</Message>
</Response>
`);
} catch (error) {
res.set("Content-Type", "text/xml");
res.send(`
<Response>
<Message>⚠️ Error del servidor. Intenta de nuevo.</Message>
</Response>
`);
}
});

function escapeXml(text) {
return text
.replace(/&/g, "&amp;")
.replace(/</g, "&lt;")
.replace(/>/g, "&gt;")
.replace(/"/g, "&quot;")
.replace(/'/g, "&apos;");
}

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
