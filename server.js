const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

app.use(cors());
app.use(express.json());

// Connect MongoDB ek hi baar
let db;
client.connect().then(() => {
  db = client.db("myapp");
  console.log("MongoDB connected");
});

// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = db.collection("users");
    const allUsers = await users.find().toArray();
    res.json(allUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ping route
app.get('/ping', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Root route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    const users = db.collection("users");
    const user = await users.findOne({
      $or: [
        { email: emailOrUsername },
        { username: emailOrUsername }
      ],
      password: password
    });
    if (user) {
      res.json({ success: true, message: 'Login successful', user });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Signup route
app.post('/signup', async (req, res) => {
  try {
    const { username, name, email, password } = req.body;
    const users = db.collection("users");
    const usernameExists = await users.findOne({ username });
    const emailExists = await users.findOne({ email });
    if (usernameExists) {
      return res.json({ success: false, message: 'Username already exists!' });
    }
    if (emailExists) {
      return res.json({ success: false, message: 'Email already exists!' });
    }
    await users.insertOne({ username, name, email, password });
    res.json({ success: true, message: 'Sign Up successful! Now you can login.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Show/Hide Forms
document.getElementById('show-signup').onclick = function(e) {
  e.preventDefault();
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('signupForm').style.display = 'block';
  document.getElementById('form-title').textContent = 'Sign Up';
};
document.getElementById('show-login').onclick = function(e) {
  e.preventDefault();
  document.getElementById('signupForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('form-title').textContent = 'Login';
};

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});