const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();

const uri = "mongodb+srv://new-1:Gaurav123@userdatabase.swnl18z.mongodb.net/userdatabase?retryWrites=true&w=majority&appName=userdatabase";
let db;

async function connectToDatabase() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db("userdatabase");
    console.log("MongoDB Atlas connected");
  } catch (err) {
    console.error("Failed to connect to MongoDB Atlas:", err.message);
    setTimeout(connectToDatabase, 5000); // 5 seconds me dobara try karein
  }
}

connectToDatabase();

app.use(cors());
app.use(express.json());

// Signup route
app.post('/signup', async (req, res) => {
  try {
    const { username, name, email, password } = req.body;
    const users = db.collection("login");
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

// Login route
app.post('/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    const users = db.collection("login");
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

app.get('/getAllUsers', async (req, res) => {
  try {
    const users = db.collection("login");
    const allUsers = await users.find().toArray();
    res.json(allUsers);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
