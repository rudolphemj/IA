const express = require("express");
const axios = require("axios");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// 🔑 Mets TA vraie clé API ici
const API_KEY = "AIzaSyDse3U5_XSJmqcPW2XvVC0d7gFdcdEH7uo";

// 📁 Dossier download
const DOWNLOAD_DIR = path.join(__dirname, "downloads");
if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR);
}

// détecter le bon binaire
function getYtDlpPath() {
  if (os.platform() === "win32") {
    return path.join(__dirname, "bin", "yt-dlp.exe");
  } else {
    return path.join(__dirname, "bin", "yt-dlp");
  }
}

// 📌 Sert ton frontend
app.use(express.static("public"));


// ✅ Fonction date -30 jours
function getDate30DaysAgo() {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString().split(".")[0] + "Z";
}


// ✅ API vidéos YouTube
app.get("/api/videos", async (req, res) => {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: "shatta clip officiel",
          type: "video",
          order: "date",
          maxResults: 20,
          publishedAfter: getDate30DaysAgo(),
          key: API_KEY
        }
      }
    );

    res.json(response.data.items);

  } catch (error) {
    console.error("❌ ERREUR API:", error.response?.data || error.message);

    res.status(500).json({
      error: error.response?.data || error.message
    });
  }
});


// ✅ ROUTE DOWNLOAD MP3
app.get("/download/:id", (req, res) => {
  const videoId = req.params.id;
  const url = `https://www.youtube.com/watch?v=${videoId}`;

  //const filePath = path.join(DOWNLOAD_DIR, `${videoId}.mp3`);
const files = fs.readdirSync(DOWNLOAD_DIR);

// trouver le fichier mp3 correspondant (dernier créé)
const mp3File = files
  .filter(f => f.endsWith(".mp3"))
  .map(f => ({
    name: f,
    time: fs.statSync(path.join(DOWNLOAD_DIR, f)).mtime
  }))
  .sort((a, b) => b.time - a.time)[0];

if (!mp3File) {
  return res.status(500).json({ error: "Fichier mp3 non trouvé" });
}

const filePath = path.join(DOWNLOAD_DIR, mp3File.name);
 // const outputTemplate = path.join(DOWNLOAD_DIR, `${videoId}.%(ext)s`);
const outputTemplate = path.join(DOWNLOAD_DIR, `%(title)s.%(ext)s`);

  // ✅ COMMANDE yt-dlp (ULTRA STABLE)
//  const command = `yt-dlp -x --audio-format mp3 --audio-quality 0 --no-playlist -o "${outputTemplate}" --extractor-args "youtube:player_client=android" "${url}"`;
//const command = `yt-dlp -x --audio-format mp3 --audio-quality 0 --no-playlist --restrict-filenames -o "${outputTemplate}" --extractor-args "youtube:player_client=android" "${url}"`;
//const command = `yt-dlp -x --audio-format mp3 --audio-quality 0 --no-playlist --restrict-filenames -o "${outputTemplate}" "${url}"`;
//const command = `yt-dlp -f bestaudio -x --audio-format mp3 --audio-quality 0 --no-playlist --restrict-filenames --force-overwrites -o "${outputTemplate}" "${url}"`;
//const command = `yt-dlp -f bestaudio -x --audio-format mp3 --audio-quality 0 --no-playlist --restrict-filenames --force-overwrites -o "${outputTemplate}" "${url}"`;
//const command = `yt-dlp -x --audio-format mp3 --audio-quality 0 --no-playlist --restrict-filenames -o "${outputTemplate}" --extractor-args "youtube:player_client=android" "${url}"`;
const command = `yt-dlp -x --audio-format mp3 --audio-quality 0 --no-playlist --restrict-filenames -o "${outputTemplate}" "${url}"`;
console.log("🚀 CMD:", command);


exec(command, (error, stdout, stderr) => {
  console.log(stdout);
  console.log(stderr);

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
      return res.status(500).json({ error: "MP3 non trouvé" });
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

// ✅ Lancement serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé : http://localhost:${PORT}`);
});

