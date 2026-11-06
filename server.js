
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.use(express.json());

// Paste your working MongoDB Atlas URI here
const MONGO_URI = 'mongodb://reeshutonger_db_user:rachu2005@ac-qef0j4w-shard-00-00.vor7xes.mongodb.net:27017,ac-qef0j4w-shard-00-01.vor7xes.mongodb.net:27017,ac-qef0j4w-shard-00-02.vor7xes.mongodb.net:27017/?ssl=true&replicaSet=atlas-13h5uj-shard-0&authSource=admin';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 1 }
});

const User = mongoose.model('User', userSchema);

// Homepage
app.get('/', (req, res) => {
  res.send('SUCCESS - YOUR API SERVER IS WORKING!');
});

// Get all users
app.get('/api/users', async (req, res) => {
  console.log('GET /api/users ROUTE HIT');

  try {
    const users = await User.find();
    res.json({ count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a user
app.post('/api/users', async (req, res) => {
  try {
    const { name, age } = req.body;
    const user = await User.create({ name, age });
    res.status(201).json({ message: 'User created', data: user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get one user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a user
app.put('/api/users/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, age: req.body.age },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User updated', data: user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a user
app.delete('/api/users/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted', data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully!');

    app.listen(PORT, '127.0.0.1', () => {
      console.log(`Server running at http://127.0.0.1:${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }
}

startServer();
