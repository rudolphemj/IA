const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../config/userFields.json');

const readConfig = () =>
  JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const writeConfig = (config) =>
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

// GET champs
exports.getFields = (req, res) => {
  res.json(readConfig());
};

// POST ajouter un champ
exports.addField = (req, res) => {
  const { key, label, type, required } = req.body;
  if (!key || !label || !type) {
    return res.status(400).json({ error: 'Champs invalides' });
  }

  const fields = readConfig();
  fields.push({ key, label, type, required: !!required });

  writeConfig(fields);
  res.status(201).json(fields);
};

// DELETE supprimer un champ
exports.deleteField = (req, res) => {
  const { key } = req.params;
  let fields = readConfig();
  fields = fields.filter(f => f.key !== key);
  writeConfig(fields);
  res.json(fields);
};
