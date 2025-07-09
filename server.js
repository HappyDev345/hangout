const express = require('express');
const app = express();
const port = 3000;

const DB = require('@replit/database');
const db = new DB();

app.use(express.static('public'));
app.use(express.json());

// Serve index.html at root
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Save user availability slots
app.post('/submit', async (req, res) => {
  const { name, slots } = req.body;
  if (!name || !slots) return res.status(400).json({ error: "Missing name or slots" });

  try {
    await db.set(name, slots);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to save data.' });
  }
});

// Get all availability data
app.get('/get', async (req, res) => {
  try {
    const keys = await db.list();
    const allData = {};
    for (const key of keys) {
      allData[key] = await db.get(key);
    }
    res.json(allData);
  } catch (e) {
    res.status(500).json({ error: 'Failed to retrieve data.' });
  }
});

// Reset all stored data
app.post('/reset', async (req, res) => {
  try {
    const keys = await db.list();
    await Promise.all(keys.map(key => db.delete(key)));
    res.json({ message: 'All responses reset.' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to reset data.' });
  }
});

app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
