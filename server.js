const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

app.post('/signup', (req, res) => {
    const user = req.body;
    let users = [];
    if (fs.existsSync('users.json')) {
        users = JSON.parse(fs.readFileSync('users.json'));
    }
    users.push(user);
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
    res.json({ success: true });
});

app.listen(3000, () => console.log('Server running on port 3000'));