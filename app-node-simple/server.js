// server.js
// Application Node.js simple sans framework

const http = require("http");

const PORT = 3000;

const server = http.createServer((req, res) => {
  const now = new Date();

  const date = now.toLocaleDateString("fr-FR");
  const time = now.toLocaleTimeString("fr-FR");

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8" />
      <title>Application Node.js simple</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: #f4f4f4;
          padding: 40px;
          text-align: center;
        }
        .box {
          background: white;
          padding: 30px;
          border-radius: 8px;
          display: inline-block;
        }
      </style>
    </head>
    <body>
      <div class="box">
        <h1>🚀 Application Node.js</h1>
        <p>📅 Date : <strong>${date}</strong></p>
        <p>⏰ Heure : <strong>${time}</strong></p>
      </div>
    </body>
    </html>
  `);
});

server.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});