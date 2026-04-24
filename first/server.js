const http = require('http');

// Création du serveur
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Hello World depuis Node.js 😊');
});

// Écoute sur le port 3000
server.listen(3000, () => {
    console.log('Serveur démarré sur http://localhost:3000');
});