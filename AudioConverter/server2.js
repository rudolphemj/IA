const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");

const app = express();
app.use(express.json());

// 📁 chemins utiles
const downloadsDir = path.join(__dirname, "downloads");
const binDir = path.join(__dirname, "bin");

// créer dossier downloads si absent
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir);
}

// 🔍 détecter yt-dlp
function getYtDlpPath() {
  if (os.platform() === "win32") {
    return path.join(binDir, "yt-dlp.exe");
  } else {
    return path.join(binDir, "yt-dlp");
  }
}

// 🌐 page HTML simple
app.get("/", (req, res) => {
  res.send(`
    <h2>YouTube → MP3</h2>
    <input id="url" placeholder="Colle le lien YouTube" size="50"/>
    <button onclick="go()">Convertir</button>

    <p id="status"></p>

    <script>
      async function go() {
        const url = document.getElementById("url").value;
        document.getElementById("status").innerText = "⏳ Téléchargement...";

        const res = await fetch("/download", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({ url })
        });

        if (!res.ok) {
          document.getElementById("status").innerText = "❌ Erreur";
          return;
        }

        const blob = await res.blob();

        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        //link.download = "audio.mp3";
	link.download = "";
        link.click();

        document.getElementById("status").innerText = "✅ Téléchargement terminé";
      }
    </script>
  `);
});

// 🚀 route téléchargement
app.post("/download", (req, res) => {
  const url = req.body.url;
  const ytDlp = getYtDlpPath();

  const outputTemplate = path.join(downloadsDir, "%(title).200s.%(ext)s");

  const command = `"${ytDlp}" -x --audio-format mp3 --audio-quality 0 \
--ffmpeg-location "${binDir}" \
-o "${outputTemplate}" \
--extractor-args "youtube:player_client=android" \
"${url}"`;

  console.log("🚀 Commande:", command);

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Erreur:", err);
      return res.status(500).send("Erreur téléchargement");
    }

    console.log(stdout);

    try {
      // 🔍 trouver le dernier MP3 créé
      const files = fs.readdirSync(downloadsDir)
        .filter(f => f.endsWith(".mp3"))
        .map(f => ({
          name: f,
          time: fs.statSync(path.join(downloadsDir, f)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time);

      if (files.length === 0) {
        return res.status(500).send("Aucun fichier généré");
      }

      const filePath = path.join(downloadsDir, files[0].name);

      console.log("📥 Envoi fichier:", filePath);

      // ✅ envoi au navigateur
      //res.download(filePath);
	res.download(filePath, path.basename(filePath));

    } catch (e) {
      console.error("❌ Erreur lecture fichier:", e);
      res.status(500).send("Erreur serveur");
    }
  });
});

// ▶️ lancement serveur
app.listen(3000, () => {
  console.log("✅ Serveur lancé : http://localhost:3000");
});
