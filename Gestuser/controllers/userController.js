const fs = require('fs');
const path = require('path');


const configPath = path.join(__dirname, '../config/userFields.json');

const readFieldsConfig = () => {
  return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
};


const dataPath = path.join(__dirname, '../data/users.json');

// 🔹 Lire les utilisateurs
const readUsers = () => {
  const data = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(data);
};

// 🔹 Écrire les utilisateurs
const writeUsers = (users) => {
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
};

// ✅ GET /api/users
exports.getUsers = (req, res) => {
  const users = readUsers();
  res.json(users);
};

// ✅ POST /api/users
exports.createUser = (req, res) => {
  const users = readUsers();
  const fieldsConfig = readFieldsConfig();

  // ✅ validation des champs requis
  for (const field of fieldsConfig) {
    if (field.required && !req.body[field.key]) {
      return res.status(400).json({
        error: `Le champ "${field.label}" est requis`
      });
    }
  }

  // ✅ création dynamique de l'utilisateur
  const newUser = {
    id: Date.now()
  };

  fieldsConfig.forEach(field => {
    newUser[field.key] = req.body[field.key] ?? null;
  });

  users.push(newUser);
  writeUsers(users);

  res.status(201).json(newUser);
};
// ✅ PUT /api/users/:id
exports.updateUser = (req, res) => {
  const { id } = req.params;

  const users = readUsers();
  const fieldsConfig = readFieldsConfig();

  const index = users.findIndex(u => u.id == id);

  if (index === -1) {
    return res.status(404).json({ error: 'Utilisateur introuvable' });
  }

  const user = users[index];

  // ✅ Mise à jour dynamique basée sur la config
  fieldsConfig.forEach(field => {
    if (req.body[field.key] !== undefined) {
      user[field.key] = req.body[field.key];
    }
  });

  users[index] = user;
  writeUsers(users);

  res.json(user);
};

// ✅ DELETE /api/users/:id
exports.deleteUser = (req, res) => {
  const { id } = req.params;

  let users = readUsers();
  const initialLength = users.length;

  users = users.filter(u => u.id != id);

  if (users.length === initialLength) {
    return res.status(404).json({ error: 'Utilisateur introuvable' });
  }

  writeUsers(users);
  res.json({ message: 'Utilisateur supprimé' });
};


