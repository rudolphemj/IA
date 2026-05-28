const express = require("express");
const axios = require("axios");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// ⚠️ mets ta clé dans une variable d'environnement en prod
const API_KEY = "AIzaSyDse3U5_XSJmqcPW2XvVC0d7gFdcdEH7uo";

// dossier download
const DOWNLOAD_DIR = path.join(__dirname, "downloads");
if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR);
}

//app.use(express.static("public"));
//app.use(express.json());

/* --------------------------
   ✅ UTILS
-------------------------- */
function getDate90DaysAgo() {
  const date = new Date();
  date.setDate(date.getDate() - 90);
  return date.toISOString().split(".")[0] + "Z";
}

/* --------------------------
   ✅ API SEARCH (DYNAMIQUE)
-------------------------- */
app.get("/search", async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: "Paramètre q manquant" });
  }

  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: query,
          type: "video",
          order: "date",
          maxResults: 20,
          publishedAfter: getDate90DaysAgo(),
          key: API_KEY,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("❌ API ERROR:", error.response?.data || error.message);

    res.status(500).json({
      error: error.response?.data || error.message,
    });
  }
});

/* --------------------------
   ✅ DOWNLOAD MP3 (SERVEUR)
-------------------------- */
app.get("/download/:id", (req, res) => {
  const videoId = req.params.id;
  const url = `https://www.youtube.com/watch?v=${videoId}`;

  const outputTemplate = path.join(
    DOWNLOAD_DIR,
    `${videoId}.%(ext)s`
  );

  const command = `yt-dlp -f bestaudio -x --audio-format mp3 --audio-quality 0 --no-playlist --restrict-filenames --force-overwrites -o "${outputTemplate}" "${url}"`;

  console.log("CMD:", command);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(stderr);
      return res.status(500).json({
        error: stderr || error.message,
      });
    }

    const filePath = path.join(DOWNLOAD_DIR, `${videoId}.mp3`);

    // attendre que le fichier existe réellement
    let attempts = 0;

    const waitForFile = setInterval(() => {
      if (fs.existsSync(filePath)) {
        clearInterval(waitForFile);

        res.setHeader("Content-Type", "audio/mpeg");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${videoId}.mp3"`
        );

        fs.createReadStream(filePath).pipe(res);
      }

      attempts++;
      if (attempts > 10) {
        clearInterval(waitForFile);
        res.status(500).json({ error: "Fichier non généré" });
      }
    }, 500);
  });
});


app.use(express.static("public"));
app.use(express.json());


/* --------------------------
   ✅ START SERVER
-------------------------- */
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé : http://localhost:${PORT}`);
});

