
// 🔑 ta clé API ici
const API_KEY = "AIzaSyDse3U5_XSJmqcPW2XvVC0d7gFdcdEH7uo";

require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();

const PORT = 3000;

app.use(express.static("public"));
app.use(express.json());

// 📅 date -365 jours
function getDate365DaysAgo() {
  const date = new Date();
  date.setDate(date.getDate() - 365);
  return date.toISOString();
}


app.post("/search", async (req, res) => {
  const query = req.body.query;

  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: query,
          type: "video",
          order: "date",
          maxResults: 100,
          publishedAfter: getDate365DaysAgo(),
          key: API_KEY
        }
      }
    );

    res.json(response.data.items);

  } catch (err) {
    console.error("❌ ERREUR BACKEND:", err.response?.data || err.message);

    res.status(500).json({
      error: err.response?.data?.error?.message || err.message
    });
  }
});





app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
