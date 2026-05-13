const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;
const API_KEY = "AIzaSyDse3U5_XSJmqcPW2XvVC0d7gFdcdEH7uo";

function getDate30DaysAgo() {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString();
}

app.use(express.static("public")); // pour servir l'IHM

app.get("/api/videos", async (req, res) => {
  try {
    const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        part: "snippet",
        q: "shatta clip officiel",
        type: "video",
        order: "date",
        maxResults: 20,
        publishedAfter: getDate30DaysAgo(),
        key: API_KEY
      }
    });

    res.json(response.data.items);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// const ytdl = require("ytdl-core");

app.get("/download/:id", async (req, res) => {
  const videoId = req.params.id;
  const url = `https://www.youtube.com/watch?v=${videoId}`;

  try {
    res.header("Content-Disposition", 'attachment; filename="video.mp4"');

    ytdl(url, { format: "mp4" })
      .pipe(res);

  } catch (error) {
    res.status(500).send("Erreur téléchargement");
  }
});

const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const ytDlp = "yt-dlp"; // ou chemin complet
const binDir = "C:\\ffmpeg\\bin"; // adapte si besoin

app.get("/download/:id", async (req, res) => {
  const videoId = req.params.id;
  const url = `https://www.youtube.com/watch?v=${videoId}`;

  const outputDir = path.join(__dirname, "downloads");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const outputTemplate = path.join(outputDir, `${videoId}.%(ext)s`);

  const command = `"${ytDlp}" -x --audio-format mp3 --audio-quality 0 --ffmpeg-location "${binDir}" -o "${outputTemplate}" "${url}"`;

  console.log("🚀 Commande:", command);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Erreur:", stderr);
      return res.status(500).send("Erreur téléchargement");
    }

    console.log("✅ Téléchargé:", stdout);

    const filePath = path.join(outputDir, `${videoId}.mp3`);

    // attendre que le fichier existe
    if (!fs.existsSync(filePath)) {
      return res.status(500).send("Fichier non trouvé");
    }

    res.download(filePath, `${videoId}.mp3`);
  });
});


app.listen(PORT, () => {
  console.log(`✅ Serveur lancé : http://localhost:${PORT}`);
});


