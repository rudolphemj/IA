const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const os = require("os");

const app = express();
app.use(express.json());

// détecter le bon binaire
function getYtDlpPath() {
  if (os.platform() === "win32") {
    return path.join(__dirname, "bin", "yt-dlp.exe");
  } else {
    return path.join(__dirname, "bin", "yt-dlp");
  }
}

// interface simple
app.get("/", (req, res) => {
  res.send(`
    <h2>YouTube → MP3</h2>
    <input id="url" placeholder="Colle le lien YouTube" size="50"/>
    <button onclick="go()">Convertir</button>

    <pre id="result"></pre>

    <script>
      async function go() {
        const url = document.getElementById("url").value;

        const res = await fetch("/download", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({ url })
        });

        const text = await res.text();
        document.getElementById("result").innerText = text;
      }
    </script>
  `);
});

// route téléchargement
app.post("/download", (req, res) => {
  const url = req.body.url;
  const ytDlp = getYtDlpPath();

//  const command = `"${ytDlp}" -x --audio-format mp3 "${url}"`;

//const command = `"${ytDlp}" -x --audio-format mp3 --ffmpeg-location "${path.join(__dirname, "bin")}" --extractor-args "youtube:player_client=android" "${url}"`;

const outputPath = path.join(__dirname, "downloads", "%(title)s.%(ext)s");

const command = `"${ytDlp}" -x --audio-format mp3 --audio-quality 0 --ffmpeg-location "${path.join(__dirname, "bin")}" -o "${outputPath}" --extractor-args "youtube:player_client=android" "${url}"`;	

  console.log("🚀 Commande:", command);

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Erreur:", err);
      return res.status(500).send("Erreur téléchargement");
    }

    console.log(stdout);
    res.send("✅ Téléchargement terminé !");
  });
});

app.listen(3000, () => {
  console.log("✅ Serveur lancé : http://localhost:3000");
});

