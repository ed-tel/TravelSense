import express from "express";
import cors from "cors";
import multer from "multer";
import OpenAI from "openai";
import pdfParse from "pdf-parse";
import fs from "fs";

const app = express();
app.use(cors());
const upload = multer({ dest: "uploads/" });

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/ai-validate", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ ok: false, error: "No file" });

    const data = fs.readFileSync(file.path);
    let text = "";

    // If PDF, read text; otherwise treat as text
    if (file.mimetype === "application/pdf") {
      const parsed = await pdfParse(data);
      text = parsed.text.slice(0, 10000);
    } else {
      text = data.toString("utf8").slice(0, 10000);
    }

    const chat = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You check if uploaded files are valid." },
        { role: "user", content: `Here is the file text:\n${text}` },
      ],
    });

    const answer = chat.choices[0].message.content;
    const isGood = answer.toLowerCase().includes("yes");

    res.json({ ok: isGood, result: answer });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`AI server running on http://localhost:${PORT}`));
