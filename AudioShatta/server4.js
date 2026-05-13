const express = require("express");
const axios = require("axios");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

const API_KEY = "AIzaSyDse3U5_XSJmqcPW2XvVC0d7gFdcdEH7uo";

// dossier download
const DOWNLOAD_DIR = path.join(__dirname, "downloads");
if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR);
}

app.use(express.static("public"));

// date -30 jours
function getDate30DaysAgo() {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString().split(".")[0] + "Z";
}

// ✅ API vidéos
app.get("/api/videos", async (req, res) => {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: "shatta -wale",
          type: "video",
          order: "date",
          maxResults: 30,
          publishedAfter: getDate30DaysAgo(),
          key: API_KEY
        }
      }
    );

    res.json(response.data.items);

  } catch (error) {
    console.error("❌ API ERROR:", error.response?.data || error.message);

    res.status(500).json({
      error: error.response?.data || error.message
    });
  }
});


// ✅ DOWNLOAD MP3
app.get("/download/:id", (req, res) => {
  const videoId = req.params.id;
  const url = `https://www.youtube.com/watch?v=${videoId}`;

  const outputTemplate = path.join(DOWNLOAD_DIR, `%(title)s.%(ext)s`);

  const command = `yt-dlp -f bestaudio -x --audio-format mp3 --audio-quality 0 --no-playlist --restrict-filenames --force-overwrites -o "${outputTemplate}" "${url}"`;

  console.log("CMD:", command);

  exec(command, (error, stdout, stderr) => {

    console.log("STDOUT:", stdout);
    console.log("STDERR:", stderr);

    if (error) {
      return res.status(500).json({
        error: stderr || error.message
      });
    }

    // attendre écriture fichier
    setTimeout(() => {

      const files = fs.readdirSync(DOWNLOAD_DIR);

      const mp3File = files
        .filter(f => f.endsWith(".mp3"))
        .map(f => ({
          name: f,
          time: fs.statSync(path.join(DOWNLOAD_DIR, f)).mtime
        }))
        .sort((a, b) => b.time - a.time)[0];

      if (!mp3File) {
        return res.status(500).json({
          error: "MP3 non trouvé"
        });
      }

      const filePath = path.join(DOWNLOAD_DIR, mp3File.name);

      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${mp3File.name}"`
      );

      fs.createReadStream(filePath).pipe(res);

    }, 3000);
  });
});


// ✅ START SERVER
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé : http://localhost:${PORT}`);
});
