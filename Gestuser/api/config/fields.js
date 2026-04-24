
let fields = [
  { key: 'prenom', label: 'Prénom', type: 'text', required: true },
  { key: 'nom', label: 'Nom', type: 'text', required: true }
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(fields);
  }

  if (req.method === 'POST') {
    const field = req.body;
    fields.push(field);
    return res.status(201).json(field);
  }

  if (req.method === 'DELETE') {
    const { key } = req.query;
    fields = fields.filter(f => f.key !== key);
    return res.status(200).json({ success: true });
  }

  res.status(405).json({ error: 'Method Not Allowed' });
}
