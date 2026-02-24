import express from "express";
import bodyParser from "body-parser";
import twilio from "twilio';

const app = express();

// Twilio manda x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Health check
app.get("/", (req, res) => {
res.status(200).send("Twilio GPT Backend is running 🚀");
});

// WhatsApp inbound webhook
app.post("/message", async (req, res) => {
try {
const incomingMsg = (req.body?.Body || "").trim();

// Respuesta simple (para probar que funciona)
const replyText = incomingMsg
? `✅ Recibido: "${incomingMsg}". Estoy conectado.`
: "✅ Conectado. Envíame un mensaje.";

// TwiML (NO necesita twilio SDK)
const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
<Message>${escapeXml(replyText)}</Message>
</Response>`;

res.set("Content-Type", "text/xml");
return res.status(200).send(twiml);
} catch (err) {
console.error("Webhook error:", err);

const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
<Message>⚠️ Error interno. Intenta de nuevo.</Message>
</Response>`;

res.set("Content-Type", "text/xml");
return res.status(200).send(twiml);
}
});

// Helper: evita romper XML si hay comillas, & etc.
function escapeXml(unsafe) {
return unsafe
.replaceAll("&", "&amp;")
.replaceAll("<", "&lt;")
.replaceAll(">", "&gt;")
.replaceAll('"', "&quot;")
.replaceAll("'", "&apos;");
}

app.listen(PORT, () => console.log("Server running on port", PORT));
