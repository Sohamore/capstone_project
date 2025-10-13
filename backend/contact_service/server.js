const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'contacts.json');

async function readContacts() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    return [];
  }
}

async function writeContacts(items) {
  await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), 'utf8');
}

function makeId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
}

app.post('/api/contact', async (req, res) => {
  const body = req.body || {};
  const required = ['firstName','lastName','email','phone','projectType','message'];
  for (const k of required) {
    if (!body[k]) {
      return res.status(400).json({ error: `Missing field: ${k}` });
    }
  }

  try {
    const contacts = await readContacts();
    const id = makeId();
    const now = new Date().toISOString();
    const entry = {
      id,
      ...body,
      status: 'new',
      createdAt: now,
      updatedAt: now
    };
    contacts.unshift(entry);
    await writeContacts(contacts);
    return res.status(201).json({ id });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to save contact', err);
    return res.status(500).json({ error: 'Failed to save contact' });
  }
});

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Contact service listening on port ${PORT}`);
});
