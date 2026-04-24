const apiUrl = '/api/config/fields';
const list = document.getElementById('fieldsList');
const form = document.getElementById('fieldForm');

const loadFields = async () => {
  const res = await fetch(apiUrl);
  const fields = await res.json();
  list.innerHTML = '';

  fields.forEach(f => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${f.label} (${f.key}) [${f.type}]
      <button onclick="deleteField('${f.key}')">❌</button>
    `;
    list.appendChild(li);
  });
};

form.addEventListener('submit', async e => {
  e.preventDefault();

  await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      key: key.value,
      label: label.value,
      type: type.value,
      required: required.checked
    })
  });

  form.reset();
  loadFields();
});

const deleteField = async (key) => {
  if (!confirm('Supprimer ce champ ?')) return;
  await fetch(`${apiUrl}/${key}`, { method: 'DELETE' });
  loadFields();
};

loadFields();