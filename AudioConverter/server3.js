const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");

const app = express();
app.use(express.json());

// 📁 dossiers
const downloadsDir = path.join(__dirname, "downloads");
const binDir = path.join(__dirname, "bin");

// créer downloads si absent
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir);
}

// 🔎 détecter yt-dlp selon OS
function getYtDlpPath() {
  if (os.platform() === "win32") {
    return path.join(binDir, "yt-dlp.exe");
  } else {
    return path.join(binDir, "yt-dlp");
  }
}

// 🌐 interface simple
app.get("/", (req, res) => {
  res.send(`
    <h2>YouTube → MP3</h2>
    <input id="url" placeholder="Colle un lien YouTube" size="50"/>
    <button onclick="go()">Convertir</button>

    <p id="status"></p>

    <script>
      async function go() {
        const url = document.getElementById("url").value;
        const status = document.getElementById("status");

        status.innerText = "⏳ Téléchargement en cours...";

        const res = await fetch("/download", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({ url })
        });

        if (!res.ok) {
          status.innerText = "❌ Erreur";
          return;
        }

        const blob = await res.blob();

        // 🔍 récupérer le nom depuis le header
        const disposition = res.headers.get("Content-Disposition");
        let filename = "audio.mp3";

        if (disposition && disposition.includes("filename=")) {
          filename = disposition.split("filename=")[1].replace(/"/g, "");
        }

        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.click();

        status.innerText = "✅ Téléchargement terminé";
      }
    </script>
  `);
});

// 🚀 téléchargement + conversion
app.post("/download", (req, res) => {
  const url = req.body.url;
  const ytDlp = getYtDlpPath();

  const outputTemplate = path.join(downloadsDir, "%(title).200s.%(ext)s");

  const command = `"${ytDlp}" -x --audio-format mp3 --audio-quality 0 \
--no-playlist \
--ffmpeg-location "${binDir}" \
-o "${outputTemplate}" \
--print after_move:filepath \
--extractor-args "youtube:player_client=android" \
"${url}"`;

  console.log("🚀 Commande:", command);

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Erreur:", err);
      console.error(stderr);
      return res.status(500).send("Erreur téléchargement");
    }

    try {
      // ✅ récupérer chemin exact retourné par yt-dlp
      const filePath = stdout.trim();

      console.log("📥 Fichier réel:", filePath);

      if (!fs.existsSync(filePath)) {
        return res.status(500).send("Fichier introuvable");
      }

      // ✅ envoi avec NOM CORRECT
      res.download(filePath, path.basename(filePath));

    } catch (e) {
      console.error("❌ Erreur serveur:", e);
      res.status(500).send("Erreur interne");
    }
  });
});

// ▶️ démarrage serveur
app.listen(3000, () => {
  console.log("✅ Serveur lancé : http://localhost:3000");
});

