backend/
├── app.js                # Point d’entrée de l’application
├── server.js             # Lancement du serveur (optionnel mais propre)
├── package.json
├── package-lock.json
├── .env                  # Variables d’environnement (PORT, DB, etc.)
├── .gitignore

├── src/
│   ├── config/           # Configuration (DB, env, constantes)
│   │   ├── database.js
│   │   └── index.js
│   │
│   ├── routes/           # Définition des routes (URL)
│   │   ├── welcome.routes.js
│   │   └── index.js
│   │
│   ├── controllers/      # Logique métier
│   │   └── welcome.controller.js
│   │
│   ├── services/         # Logique réutilisable (ex: calcul, API externe)
│   │   └── time.service.js
│   │
│   ├── middlewares/      # Middlewares Express
│   │   └── error.middleware.js
│   │
│   ├── utils/            # Fonctions utilitaires
│   │   └── logger.js
│   │
│   └── app.js            # Configuration Express (routes, middlewares)
│
└── public/               # Frontend statique (HTML, CSS, JS)
    ├── index.html
    ├── style.css
    └── script.js
