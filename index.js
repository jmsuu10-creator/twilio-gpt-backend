import express from "express";
import bodyParser from "body-parser";
import twilio from "twilio";

const app = express();
app.use(bodyParser.json());

const {
TWILIO_ACCOUNT_SID,
TWILIO_AUTH_TOKEN,
TWILIO_WHATSAPP_NUMBER
} = process.env;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Test route
app.get("/", (req, res) => {
res.send("Twilio GPT Backend is running 🚀");
});

// Send WhatsApp message
app.post('/message', (req, res) => {
console.log('Incoming WhatsApp message:', req.body);

res.set('Content-Type', 'text/xml');
res.send(`
<Response>
<Message>Hola 👋 Tu servidor ya está conectado correctamente 🚀</Message>
</Response>
`);
});

res.json({ success: true, sid: message.sid });
} catch (error) {
res.status(500).json({ success: false, error: error.message });
}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log("Server running on port " + PORT);
});
